import type { Post } from "@/generated/prisma";
import PostCard from "./post-card";

interface PostGridProps {
    posts: Post[];
    isLoggedIn?: boolean;
}

export default function PostGrid({ posts, isLoggedIn }: PostGridProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted text-lg">Inga inlägg hittades.</p>
                <p className="text-sm text-muted mt-2">
                    Vänligen försök igen med en annan sökterm eller kolla
                    tillbaka senare när nya inlägg har publicerats.
                </p>
            </div>
        );
    }

    // Extract the first post from the posts array to feature it, and keep the rest for the grid
    const [featuredPost, ...blogPosts] = posts;

    return (
        <div className="grid gap-6">
            {/* Featured post - full width */}
            <div className="w-full group">
                <PostCard post={featuredPost} isLoggedIn={isLoggedIn} />
            </div>

            {/* Show posts in column, but make 3 col grid on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 group">
                {blogPosts.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        isLoggedIn={isLoggedIn}
                    />
                ))}
            </div>
        </div>
    );
}
