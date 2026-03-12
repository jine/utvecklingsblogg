import { redirect } from "next/navigation";
import { PostForm } from "@/components/forms/post-form";
import { createPostAction } from "@/lib/actions";
import { requireSession } from "@/lib/utils";

export default async function NewPostPage() {
    await requireSession();
    
    return (
        <article className="max-w-4xl mx-auto py-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Nytt inlägg</h1>
            </header>

            <PostForm
                action={createPostAction}
                submitLabel="Spara"
                cancelHref="/"
            />
        </article>
    );
}
