"use client";

import { authClient } from "@/lib/auth-client";

export function EditLink({ slug }: { slug: string }) {
    const { data: session } = authClient.useSession();

    if (!session) return null;

    return (
        <a href={`/${slug}/edit`} className="px-3 py-1 text-sm">
            Redigera
        </a>
    );
}