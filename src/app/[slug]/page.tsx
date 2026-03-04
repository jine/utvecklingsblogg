import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Tags } from "@/components/ui/tags";

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
        <article className="max-w-4xl mx-auto py-6 prose prose-lg max-w-none">

            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <sub className="text-sm text-gray-500 mb-4 block">{post.summary}</sub>

                <div className="flex items-center gap-4 mb-4">
                    <time className="text-gray-600" dateTime={post.publishDate?.toISOString()}>
                        {formatDate(post.publishDate)}
                    </time>
                    {post.tags.length > 0 && <>| <div className="text-gray-600">Taggar: <Tags tags={post.tags} /></div></>}
                </div>
            </header>

            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            ></div>
        </article>
    );
}
