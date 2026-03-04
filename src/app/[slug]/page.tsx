import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface PageProps {
    params: {
        slug: string;
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
        <article className="max-w-2xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <time className="text-gray-600">
                    {formatDate(post.publishDate)}
                </time>
            </header>

            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            ></div>
        </article>
    );
}
