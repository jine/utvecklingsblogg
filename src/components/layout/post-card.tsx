import Link from "next/link";
import type { Post } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className="p-5 bg-surface border border-border rounded-lg hover:border-primary transition-colors">
            <header className="mb-3">
                <h2 className="font-semibold text-lg">
                    <Link
                        href={`/${post.slug}`}
                        className="hover:text-primary transition-colors"
                    >
                        {post.title}
                    </Link>
                </h2>
            </header>

            <p className="text-muted text-sm mb-4 line-clamp-2">
                {post.summary}
            </p>

            <footer className="text-xs text-muted">
                <time dateTime={post.publishDate?.toISOString()}>
                    {formatDate(post.publishDate)}
                </time>
            </footer>
        </article>
    );
}
