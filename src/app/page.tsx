import PostGrid from "@/components/layout/post-grid";
import type { Post } from "@/generated/prisma";
import { getAllPosts, searchPosts } from "@/lib/posts";

interface HomePageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const params = await searchParams;
    const query = params.q;

    const posts: Post[] = query
        ? await searchPosts(query)
        : await getAllPosts();

    return (
        <>
            {query && (
                <div className="mb-6 text-sm text-muted">
                    {posts.length > 0 ? (
                        <p>
                            Visar {posts.length} resultat för &quot;{query}
                            &quot;
                        </p>
                    ) : (
                        <p>Inga resultat hittades för &quot;{query}&quot;</p>
                    )}
                </div>
            )}
            <PostGrid posts={posts} />
        </>
    );
}
