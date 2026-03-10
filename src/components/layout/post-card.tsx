import Link from "next/link";
import type { Post } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className="border rounded-lg text-white p-6 space-y-4">
            <header>
                <h2 className="font-bold text-2xl mb-2">
                    <Link href={`/${post.slug}`}>{post.title}</Link>
                </h2>
            </header>

            <div className="text-gray-400">
                {post.summary}
            </div>

            <footer><time dateTime={post.publishDate?.toISOString()}>{formatDate(post.publishDate)}</time></footer>
        </article>
    );
}
