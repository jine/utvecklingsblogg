import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostForm } from "@/components/forms/post-form";

async function createPost(formData: FormData) {
    "use server";

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const htmlContent = formData.get("htmlContent") as string;
    const tagsString = formData.get("tags") as string;
    const published = formData.get("published") === "on";

    if (!title || !slug || !htmlContent) {
        throw new Error("Missing required fields");
    }

    // Handle tags - create if they don't exist
    const tagNames = tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    const tags = await Promise.all(
        tagNames.map(async (name) => {
            return prisma.tag.upsert({
                where: { name },
                create: { name },
                update: {},
            });
        })
    );

    await prisma.post.create({
        data: {
            title,
            slug,
            summary,
            htmlContent,
            published,
            authorId: session.user.id,
            publishDate: published ? new Date() : null,
            tags: {
                connect: tags.map((t) => ({ id: t.id })),
            },
        },
    });

    revalidatePath("/");
    redirect(`/${slug}`);
}

export default function NewPostPage() {
    return (
        <article className="max-w-4xl mx-auto py-6">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Nytt inlägg</h1>
            </header>

            <PostForm
                action={createPost}
                submitLabel="Spara"
                cancelHref="/"
            />
        </article>
    );
}
