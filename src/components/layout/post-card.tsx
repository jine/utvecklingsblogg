import Link from "next/link";
import type { Post } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
    post: Post;
    isLoggedIn?: boolean;
}

export default function PostCard({ post, isLoggedIn }: PostCardProps) {
    const isUnpublished = isLoggedIn && !post.published;

    return (
        <article
            className={`p-5 bg-surface border-2 rounded-lg hover:border-primary transition-colors ${
                isUnpublished
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border"
            }`}
        >
            <header className="mb-3">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-lg">
                        <Link
                            href={`/${post.slug}`}
                            className="hover:text-primary transition-colors"
                        >
                            {post.title}
                        </Link>
                    </h2>
                    {isUnpublished && (
                        <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded">
                            Utkast
                        </span>
                    )}
                </div>
            </header>

            <p className="text-muted text-sm mb-4 line-clamp-2">
                {post.summary}
            </p>

            <footer className="text-xs text-muted">
                <time dateTime={post.publishDate?.toISOString()}>
                    {isUnpublished
                        ? `Skapad: ${formatDate(post.createdAt)}`
                        : formatDate(post.publishDate)}
                </time>
            </footer>
        </article>
    );
}
