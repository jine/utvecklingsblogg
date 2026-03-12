import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPostBySlug } from "@/lib/posts";
import { PostForm } from "@/components/forms/post-form";
import { updatePostAction } from "@/lib/actions";
import { Metadata } from "next";
import { requireSession } from "@/lib/utils";

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
        title: `Redigerar "${post.title}" | Utvecklingsblogg`,
        description: post.summary || "Läs mer om detta inlägg på utvecklingsbloggen.",
    };
}


export default async function EditPostPage({ params }: PageProps) {
    await requireSession();
    
    const { slug } = await params;

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto py-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Redigera inlägg</h1>
            </header>

            <PostForm
                action={updatePostAction}
                defaultValues={{
                    title: post.title,
                    slug: post.slug,
                    summary: post.summary || "",
                    htmlContent: post.htmlContent,
                    tags: post.tags.map((t) => t.name).join(", "),
                    published: post.published,
                }}
                submitLabel="Spara ändringar"
                cancelHref={`/${slug}`}
                postId={post.id}
            />
        </main>
    );
}
