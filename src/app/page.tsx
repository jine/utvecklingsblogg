import { headers } from "next/headers";
import PostGrid from "@/components/layout/post-grid";
import type { Post } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import {
    getAllPosts,
    getAllPostsWithUnpublished,
    searchPosts,
    searchPostsWithUnpublished,
} from "@/lib/posts";

interface HomePageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const params = await searchParams;
    const query = params.q;

    // Check if user is logged in
    const session = await auth.api.getSession({ headers: await headers() });
    const isLoggedIn = !!session;

    const posts: Post[] = query
        ? isLoggedIn
            ? await searchPostsWithUnpublished(query)
            : await searchPosts(query)
        : isLoggedIn
          ? await getAllPostsWithUnpublished()
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
            <PostGrid posts={posts} isLoggedIn={isLoggedIn} />
        </>
    );
}
