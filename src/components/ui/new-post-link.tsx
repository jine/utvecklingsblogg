"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function NewPostLink() {
    const { data: session } = authClient.useSession();

    if (!session) {
        return null;
    }

    return (
        <Link href="/new" className="font-medium whitespace-nowrap">
            Nytt inlägg
        </Link>
    );
}
