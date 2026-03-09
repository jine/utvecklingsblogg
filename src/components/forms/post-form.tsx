"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import slugify from "slugify";

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
    action: (formData: FormData) => void;
    defaultValues?: Partial<PostFormData>;
    submitLabel: string;
    cancelHref: string;
    originalSlug?: string; // For edit mode, to pass to the action
}

export function PostForm({
    action,
    defaultValues,
    submitLabel,
    cancelHref,
    originalSlug,
}: PostFormProps) {

    return (
        <form action={action} className="space-y-6">
            {originalSlug && (
                <input type="hidden" name="originalSlug" value={originalSlug} />
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Titel *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={defaultValues?.title ?? ""}
                    defaultValue={defaultValues?.title ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Inläggets titel"
                />
            </div>

            <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                    Slug * (URL-vänligt namn)
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={slug}
                    defaultValue={defaultValues?.slug ?? ""}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="mitt-inlagg"
                />
            </div>

            <div>
                <label htmlFor="summary" className="block text-sm font-medium mb-1">
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
                <label htmlFor="htmlContent" className="block text-sm font-medium mb-1">
                    Innehåll (HTML) *
                </label>
               <SimpleEditor content={defaultValues?.htmlContent} />
               {/*<textarea
                    id="htmlContent"
                    name="htmlContent"
                    required
                    rows={15}
                    defaultValue={defaultValues?.htmlContent ?? ""}
                    ></textarea>
                */}
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {submitLabel}
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