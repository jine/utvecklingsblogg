import { Post } from "@/generated/prisma";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border rounded-lg">
      <div className="p-6">
        <header>
          <h2 className="font-bold text-2xl mb-2">
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
        </header>
        <div className="text-gray-400">{post.summary}</div>
        <footer>
          {post.publishDate?.toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </footer>
      </div>
    </article>
  );
}
