import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PostGrid from "@/components/layout/post-grid";
import type { Post } from "@/generated/prisma";
import { randomUUID } from "crypto";

const posts: Post[] = [
    {
        id: randomUUID(),
        title: "First Post",  
        slug: "first-post",
        summary: "This is the summary of the first post.",
        htmlContent: "<p>This is the full content of the first post.</p>",
        published: true,
        publishDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
    },
    {
        id: randomUUID(),
        title: "Second Post",  
        slug: "second-post",
        summary: "This is the summary of the second post.",
        htmlContent: "<p>This is the full content of the second post.</p>",
        published: true,
        publishDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
    },
    {
        id: randomUUID(),
        title: "Third Post",  
        slug: "third-post",
        summary: "This is the summary of the third post.",
        htmlContent: "<p>This is the full content of the third post.</p>",
        published: true,
        publishDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
    },
    {
        id: randomUUID(),
        title: "Fourth Post",  
        slug: "fourth-post",
        summary: "This is the summary of the fourth post.",
        htmlContent: "<p>This is the full content of the fourth post.</p>",
        published: true,
        publishDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
    },
    {
        id: randomUUID(),
        title: "Fifth Post",  
        slug: "fifth-post",
        summary: "This is the summary of the fifth post.",
        htmlContent: "<p>This is the full content of the fifth post.</p>",
        published: true,
        publishDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: null,
    }
];

export default function Home() {
  return (
    <div className="container max-w-5xl mx-auto py-6">
      <Header />
      <PostGrid posts={posts}/>
      <Footer />
    </div>
  );
}
