"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import type { ActionResult } from "@/lib/actions";

const SimpleEditor = dynamic(() => import("./tiptap"), { ssr: false });

interface PostFormData {
    title: string;
    slug: string;
    summary: string;
    htmlContent: string;
    tags: string;
    published: boolean;
}

interface PostFormProps {
    action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
    defaultValues?: Partial<PostFormData>;
    submitLabel: string;
    cancelHref: string;
    postId?: string; // For edit mode
}

export function PostForm({
    action,
    defaultValues,
    submitLabel,
    cancelHref,
    postId,
}: PostFormProps) {
    // Use the custom hook to manage form state and submission
    const [state, formAction, isPending] = useActionState(action, null);

    // State to hold the HTML content from the editor
    const [htmlContent, setHtmlContent] = useState(
        defaultValues?.htmlContent ?? "",
    );

    return (
        <form action={formAction} className="space-y-6">
            {/* Display validation errors if the action returned any */}
            {state && !state.success && (
                <ul className="list-disc list-inside text-red-600">
                    {state.errors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            )}

            {postId && <input type="hidden" name="postId" value={postId} />}

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                >
                    Titel *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    defaultValue={defaultValues?.title ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Inläggets titel"
                />
            </div>

            <div>
                <label
                    htmlFor="slug"
                    className="block text-sm font-medium mb-1"
                >
                    Slug * (URL-vänligt namn)
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    defaultValue={defaultValues?.slug ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="mitt-inlagg"
                />
            </div>

            <div>
                <label
                    htmlFor="summary"
                    className="block text-sm font-medium mb-1"
                >
                    Sammanfattning
                </label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    defaultValue={defaultValues?.summary ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kort beskrivning av inlägget"
                />
            </div>

            <div>
                <label
                    htmlFor="htmlContent"
                    className="block text-sm font-medium mb-1"
                >
                    Innehåll (HTML) *
                </label>
                <input type="hidden" name="htmlContent" value={htmlContent} />
                <SimpleEditor
                    content={defaultValues?.htmlContent}
                    onChange={setHtmlContent}
                />
            </div>

            <div>
                <label
                    htmlFor="tags"
                    className="block text-sm font-medium mb-1"
                >
                    Taggar (kommaseparerade)
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    defaultValue={defaultValues?.tags ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="react, nextjs, tutorial"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    name="published"
                    defaultChecked={defaultValues?.published ?? false}
                    className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm">
                    Publicerad
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Sparar..." : submitLabel}
                </button>
                <a
                    href={cancelHref}
                    className="px-6 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                    Avbryt
                </a>
            </div>
        </form>
    );
}
