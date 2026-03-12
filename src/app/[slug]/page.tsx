import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tags } from "@/components/ui/tags";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { EditLink } from "@/components/ui/edit-link";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Inlägget hittades inte",
            description: "Tyvärr kunde vi inte hitta det inlägg du letade efter. Det kan ha tagits bort eller så har du angett en felaktig URL.",
        };
    }

    // Limit title to 60 characters for SEO
    if (post.title && post.title.length > 60) {
        post.title = post.title.substring(0, 57) + "...";
    }

    // Limit description to 160 characters for SEO
    if (post.summary && post.summary.length > 160) {
        post.summary = post.summary.substring(0, 157) + "...";
    }

    // Use post title and summary for SEO metadata
    return {
        title: `${post.title} | Utvecklingsblogg`,
        description: post.summary || "Läs mer om detta inlägg på utvecklingsbloggen.",
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;

    // If slug is missing, show 404 page
    if (!slug) notFound();

    // Fetch the post by slug
    const post = await getPostBySlug(slug);

    // If no post is found, show 404 page
    if (!post) notFound();

    return (
        <article className="max-w-4xl mx-auto py-6 prose prose-lg prose-invert">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <sub className="text-sm text-gray-500 mb-4 block">
                    {post.summary}
                </sub>

                <div className="flex items-center gap-4 mb-4">
                    <time
                        className="text-gray-600"
                        dateTime={post.publishDate?.toISOString()}
                    >
                        {formatDate(post.publishDate)}
                    </time>
                    {post.tags.length > 0 && (
                        <>
                            |{" "}
                            <div className="text-gray-600">
                                Taggar: <Tags tags={post.tags} />
                            </div>
                        </>
                    )}
                    <EditLink slug={post.slug} />
                </div>
            </header>

            <div
                className="max-w-none"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            ></div>
        </article>
    );
}
