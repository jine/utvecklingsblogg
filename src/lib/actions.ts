"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { requireSession } from "@/lib/utils";
import { createPost, updatePost } from "@/lib/posts";

export type ActionResult = 
	| { success: true }
	| { success: false; errors: string[] };

// useActionState passes the previous state as the first argument
// We don't use it, but Next.js requires this signature

export async function createPostAction(state: unknown, formData: FormData): Promise<ActionResult> {
	const session = await requireSession();

	// Normalize slug before saving
	const rawSlug = formData.get("slug") as string;
	const normalizedSlug = slugify(rawSlug, { lower: true, strict: true });
	formData.set("slug", normalizedSlug);

	// Add authorId to formData for validation
	formData.append("authorId", session.user.id);

	const postResult = await createPost(formData);

	if (!postResult.success) {
		return postResult;
	}

	// Revalidate the homepage and the new post's page to reflect the new content
	revalidatePath("/");
	redirect(`/${normalizedSlug}`);
}

export async function updatePostAction(state: unknown, formData: FormData): Promise<ActionResult> {
	await requireSession();

	// Normalize slug before saving
	const rawSlug = formData.get("slug") as string;
	const normalizedSlug = slugify(rawSlug, { lower: true, strict: true });
	formData.set("slug", normalizedSlug);

	const postResult = await updatePost(formData);

	if (!postResult.success) {
		return postResult;
	}

	// Revalidate the homepage and the updated post's page to reflect the changes
	revalidatePath("/");
	revalidatePath(`/${normalizedSlug}`);

	// Redirect to the updated post's page
	redirect(`/${normalizedSlug}`);
}
