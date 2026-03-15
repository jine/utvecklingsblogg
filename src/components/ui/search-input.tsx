"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchTerm = formData.get("q") as string;

        const params = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
            params.set("q", searchTerm.trim());
        } else {
            params.delete("q");
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Sök..."
                className="w-32 sm:w-44 px-3 py-1.5 bg-surface border border-border rounded text-sm placeholder:text-muted focus:outline-none focus:border-primary"
            />
        </form>
    );
}
