import type { Post } from "@/generated/prisma";

export default function PostLayout({ post }: { post: Post }) {
    return (
        <div className="grid gap-6 ">
            <div className="w-full">
                <article className="border rounded-lg">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <div
                        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                    ></div>
                </article>
            </div>
        </div>
    );
}
