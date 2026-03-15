import slugify from "slugify";
import { z } from "zod";
import type { Post, Tag } from "@/generated/prisma";
import { prisma } from "./db";

export type PostWithTags = Post & { tags: Tag[] };

// fixes tags: remove duplicates, trim, lowercase, filter out empty
function parseTags(tagsInput: string): string[] {
    return tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .filter((t, i, arr) => arr.indexOf(t) === i);
}

// upsert tags: create if not exist, otherwise return existing
async function upsertTags(names: string[]): Promise<Tag[]> {
    return Promise.all(
        names.map((name) =>
            prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
            }),
        ),
    );
}

export async function getPostBySlug(
    slug: string | undefined,
): Promise<PostWithTags | null> {
    if (!slug) return null;
    return prisma.post.findUnique({ where: { slug }, include: { tags: true } });
}

export async function getAllPosts(): Promise<Post[]> {
    return prisma.post.findMany({
        where: { published: true },
        orderBy: { publishDate: "desc" },
    });
}

export async function searchPosts(query: string): Promise<Post[]> {
    const searchTerm = query.trim();
    if (!searchTerm) return getAllPosts();

    return prisma.post.findMany({
        where: {
            published: true,
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { summary: { contains: searchTerm, mode: "insensitive" } },
                { htmlContent: { contains: searchTerm, mode: "insensitive" } },
                {
                    tags: {
                        some: {
                            name: { contains: searchTerm, mode: "insensitive" },
                        },
                    },
                },
            ],
        },
        orderBy: { publishDate: "desc" },
        include: { tags: true },
    });
}

export async function createPost(formData: FormData) {
    // Normalize slug from form data
    const rawSlug = formData.get("slug") as string;
    const normalizedSlug = slugify(rawSlug, { lower: true, strict: true });

    // Validate input using Zod
    const result = z
        .object({
            slug: z
                .string()
                .min(1, "Du måste ange en slug (sökmotorvänlig sökväg)")
                .max(100, "Slug får inte vara längre än 100 tecken"),
            title: z
                .string()
                .min(1, "Du måste ange en titel")
                .max(100, "Titel får inte vara längre än 100 tecken"),
            htmlContent: z.string().min(1, "Du måste skriva något innehåll!"),
            summary: z
                .string()
                .max(500, "Sammanfattning får inte vara längre än 500 tecken")
                .optional(),
            published: z.boolean().default(false),
            tags: z.string(),
            authorId: z.string().min(1),
        })
        .safeParse({
            slug: normalizedSlug,
            title: formData.get("title"),
            htmlContent: formData.get("htmlContent"),
            summary: formData.get("summary") || undefined,
            published: formData.get("published") === "on",
            tags: formData.get("tags") || "",
            authorId: formData.get("authorId"),
        });

    // We need to validate the slug is unique before we can create the post, so we check if a post with the same slug already exists
    if (result.success) {
        const existing = await prisma.post.findUnique({
            where: { slug: result.data.slug },
        });
        if (existing) {
            return {
                success: false as const,
                errors: ["En post med denna slug finns redan"],
            };
        }
    }

    // If validation fails, return errors as an array of strings
    if (!result.success) {
        return {
            success: false as const,
            errors: result.error.issues.map((e) => e.message),
        };
    }

    const { tags, ...data } = result.data;
    const tagList = await upsertTags(parseTags(tags));

    await prisma.post.create({
        data: {
            ...data,
            publishDate: data.published ? new Date() : null,
            tags: { connect: tagList.map((t) => ({ id: t.id })) },
        },
    });

    return { success: true as const };
}

export async function updatePost(formData: FormData) {
    // we need the post ID to know which post to update, if it's missing return an error
    const id = formData.get("postId") as string;
    if (!id) {
        return { success: false as const, errors: ["Post ID saknas"] };
    }

    // Normalize slug from form data
    const rawSlug = formData.get("slug") as string;
    const normalizedSlug = slugify(rawSlug, { lower: true, strict: true });

    // Validate input using Zod
    const result = z
        .object({
            slug: z
                .string()
                .min(1, "Du måste ange en slug (sökmotorvänlig sökväg)")
                .max(100, "Slug får inte vara längre än 100 tecken"),
            title: z
                .string()
                .min(1, "Du måste ange en titel")
                .max(100, "Titel får inte vara längre än 100 tecken"),
            htmlContent: z.string().min(1, "Du måste skriva något innehåll!"),
            summary: z
                .string()
                .max(500, "Sammanfattning får inte vara längre än 500 tecken")
                .optional(),
            published: z.boolean().default(false),
            tags: z.string(),
        })
        .safeParse({
            slug: normalizedSlug,
            title: formData.get("title"),
            htmlContent: formData.get("htmlContent"),
            summary: formData.get("summary") || undefined,
            published: formData.get("published") === "on",
            tags: formData.get("tags") || "",
        });

    // If validation fails, return errors as an array of strings
    if (!result.success) {
        return {
            success: false as const,
            errors: result.error.issues.map((e) => e.message),
        };
    }

    const { tags, ...data } = result.data;
    const tagList = await upsertTags(parseTags(tags));

    // Check if already published to avoid resetting publish date
    const current = await prisma.post.findUnique({
        where: { id },
        select: { publishDate: true },
    });

    await prisma.post.update({
        where: { id },
        data: {
            ...data,
            // If the post is being published now but wasn't before, set publish date to now. Otherwise, keep existing publish date.
            publishDate:
                data.published && !current?.publishDate
                    ? new Date()
                    : current?.publishDate,
            tags: { set: [], connect: tagList.map((t) => ({ id: t.id })) },
        },
    });

    return { success: true as const };
}
