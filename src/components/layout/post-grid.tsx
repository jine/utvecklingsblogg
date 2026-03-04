import { Post } from "@/generated/prisma";
import PostCard from "./post-card";

export default function PostGrid({ posts }: { posts: Post[] }) {
    if (posts.length === 0) return null;

    // Extract the first post from the posts array to feature it, and keep the rest for the grid
    const [featuredPost, ...blogPosts] = posts;

    return (
        <div className="grid gap-6">
            {/* Featured post - full width */}
            <div className="w-full">
                <PostCard post={featuredPost} />
            </div>

            {/* Show posts in column, but make 3 col grid on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {blogPosts.map((post: Post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};