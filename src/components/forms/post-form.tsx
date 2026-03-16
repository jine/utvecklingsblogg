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
                <ul className="list-disc list-inside text-primary">
                    {state.errors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            )}

            {postId && <input type="hidden" name="postId" value={postId} />}

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2 text-text"
                >
                    Titel * <span className="text-muted">(max 100 tecken)</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    maxLength={100}
                    minLength={1}
                    defaultValue={defaultValues?.title ?? ""}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Inläggets titel"
                />
            </div>

            <div>
                <label
                    htmlFor="slug"
                    className="block text-sm font-medium mb-2 text-text"
                >
                    Slug *{" "}
                    <span className="text-muted">
                        (unik identifierare i URL, t.ex. "mitt-inlagg")
                    </span>
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    maxLength={100}
                    defaultValue={defaultValues?.slug ?? ""}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="mitt-inlagg"
                />
            </div>

            <div>
                <label
                    htmlFor="summary"
                    className="block text-sm font-medium mb-2 text-text"
                >
                    Sammanfattning{" "}
                    <span className="text-muted">
                        (kort beskrivning av inlägget)
                    </span>
                </label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    defaultValue={defaultValues?.summary ?? ""}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Kort beskrivning av inlägget"
                />
            </div>

            <div>
                <label
                    htmlFor="htmlContent"
                    className="block text-sm font-medium mb-2 text-text"
                >
                    Inläggets innehåll
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
                    className="block text-sm font-medium mb-2 text-text"
                >
                    Taggar <span className="text-muted">(kommaseparerade)</span>
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    defaultValue={defaultValues?.tags ?? ""}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="react, nextjs, tutorial"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    name="published"
                    defaultChecked={defaultValues?.published ?? false}
                    className="w-4 h-4 accent-primary"
                />
                <label htmlFor="published" className="text-sm text-text">
                    Publicerad{" "}
                    <span className="text-muted">(visas på huvudsidan)</span>
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isPending ? "Sparar..." : submitLabel}
                </button>
                <a
                    href={cancelHref}
                    className="px-6 py-2 bg-surface border border-border rounded-md text-text hover:border-primary transition-colors cursor-pointer"
                >
                    Avbryt
                </a>
            </div>
        </form>
    );
}
