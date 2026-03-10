import type { Post, Tag } from "@/generated/prisma";
import { prisma } from "./db";

export type PostWithTags = Post & { tags: Tag[] };

export async function getPostBySlug(
    slug: string | undefined,
): Promise<PostWithTags | null> {
    if (!slug) {
        throw new Error("Missing required parameter: slug");
    }

    return await prisma.post.findUnique({
        where: { slug },
        include: { tags: true },
    });
}

export async function getAllPosts(): Promise<Post[]> {
    return prisma.post.findMany({ orderBy: { publishDate: "desc" } });
}

export async function createPost(data: {
    title: string;
    slug: string;
    summary: string;
    htmlContent: string;
    published: boolean;
    authorId: string;
    tagNames: string[];
}): Promise<void> {
    const tags = await upsertTags(data.tagNames);

    await prisma.post.create({
        data: {
            title: data.title,
            slug: data.slug,
            summary: data.summary,
            htmlContent: data.htmlContent,
            published: data.published,
            authorId: data.authorId,
            publishDate: data.published ? new Date() : null,
            tags: { connect: tags.map((t) => ({ id: t.id })) },
        },
    });
}

export async function updatePost(
    originalSlug: string,
    data: {
        title: string;
        slug: string;
        summary: string;
        htmlContent: string;
        published: boolean;
        tagNames: string[];
    },
): Promise<void> {
    const tags = await upsertTags(data.tagNames);

    await prisma.post.update({
        where: { slug: originalSlug },
        data: {
            title: data.title,
            slug: data.slug,
            summary: data.summary,
            htmlContent: data.htmlContent,
            published: data.published,
            publishDate: data.published ? new Date() : null,
            tags: {
                set: [],
                connect: tags.map((t) => ({ id: t.id })),
            },
        },
    });
}

async function upsertTags(names: string[]): Promise<Tag[]> {
    return Promise.all(
        names.map((name) =>
            prisma.tag.upsert({ where: { name }, create: { name }, update: {} }),
        ),
    );
}
