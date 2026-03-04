import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import PostGrid from "@/components/layout/post-grid";
import type { Post } from "@/generated/prisma";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  
    const posts: Post[] = await getAllPosts();

    return (
        <div className="container max-w-5xl mx-auto py-6">
            <Header />
            <PostGrid posts={posts} />
            <Footer />
        </div>
    );
}
