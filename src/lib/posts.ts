import type { Post, Tag } from "@/generated/prisma";
import { prisma } from "./db";

export type PostWithTags = Post & { tags: Tag[] };

export async function getPostBySlug(
    slug: string | undefined,
): Promise<PostWithTags | null> {
    if (!slug) {
        throw new Error("Missing required parameter: slug");
    }

    return await prisma.post.findUnique({ where: { slug }, include: { tags: true } });
}

export async function getAllPosts(): Promise<Post[]> {
    return prisma.post.findMany({ orderBy: { publishDate: "desc" } });
}

// create, update, delete
