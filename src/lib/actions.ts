"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/utils";
import { createPost, updatePost } from "@/lib/posts";

export type ActionResult = 
	| { success: true }
	| { success: false; errors: string[] };

// useActionState passes the previous state as the first argument
// We don't use it, but Next.js requires this signature

export async function createPostAction(state: unknown, formData: FormData): Promise<ActionResult> {
	const session = await requireSession();

	// Add authorId to formData for validation
	formData.append("authorId", session.user.id);

	const postResult = await createPost(formData);

	if (!postResult.success) {
		return postResult;
	}

	const slug = formData.get("slug") as string;

	// Revalidate the homepage and the new post's page to reflect the new content
	revalidatePath("/");
	redirect(`/${slug}`);
}

export async function updatePostAction(state: unknown, formData: FormData): Promise<ActionResult> {
	await requireSession();

	const postResult = await updatePost(formData);

	if (!postResult.success) {
		return postResult;
	}

	const slug = formData.get("slug") as string;

	// Revalidate the homepage and the updated post's page to reflect the changes
	revalidatePath("/");
	revalidatePath(`/${slug}`);

	// Redirect to the updated post's page
	redirect(`/${slug}`);
}
