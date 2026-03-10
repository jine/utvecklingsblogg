"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createPost, updatePost } from "@/lib/posts";

export async function createPostAction(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const htmlContent = formData.get("htmlContent") as string;
    const tagNames = (formData.get("tags") as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    const published = formData.get("published") === "on";

    if (!title || !slug || !htmlContent) throw new Error("Missing required fields");

    await createPost({ title, slug, summary, htmlContent, published, authorId: session.user.id, tagNames });

    revalidatePath("/");
    redirect(`/${slug}`);
}

export async function updatePostAction(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    const originalSlug = formData.get("originalSlug") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const htmlContent = formData.get("htmlContent") as string;
    const tagNames = (formData.get("tags") as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    const published = formData.get("published") === "on";

    if (!title || !slug || !htmlContent) throw new Error("Missing required fields");

    await updatePost(originalSlug, { title, slug, summary, htmlContent, published, tagNames });

    revalidatePath("/");
    revalidatePath(`/${slug}`);
    redirect(`/${slug}`);
}
