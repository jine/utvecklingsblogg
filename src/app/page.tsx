import PostGrid from "@/components/layout/post-grid";
import type { Post } from "@/generated/prisma";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
    const posts: Post[] = await getAllPosts();

    return <PostGrid posts={posts} />;
}
