import Link from "next/link";
import type { Post } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className="border rounded-lg">
            <div className="p-6">
                <header>
                    <h2 className="font-bold text-2xl mb-2">
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                    </h2>
                </header>
                <div className="text-gray-400">{post.summary}</div>
                <footer>{formatDate(post.publishDate)}</footer>
            </div>
        </article>
    );
}
