import type { Post } from "@/generated/prisma";
import { prisma } from "./db";

export async function getPostBySlug(
    slug: string | undefined,
): Promise<Post | null> {
    if (!slug) {
        throw new Error("Missing required parameter: slug");
    }

    return await prisma.post.findUnique({ where: { slug } });
}

export async function getAllPosts(): Promise<Post[]> {
    return prisma.post.findMany({ orderBy: { publishDate: "desc" } });
}

// create, update, delete
