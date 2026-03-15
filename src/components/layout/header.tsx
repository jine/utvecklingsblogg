import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { NewPostLink } from "@/components/ui/new-post-link";
import { SearchInput } from "@/components/ui/search-input";

export default function Header() {
    return (
        <header className="flex items-center justify-between mb-8 py-4 border-b border-border">
            <div className="flex flex-col items-center">
                <Logo />
                <span className="text-muted mt-1">Utvecklingsblogg</span>
            </div>
            <div className="flex items-center gap-4">
                <NewPostLink />
                <Suspense
                    fallback={
                        <div className="w-32 sm:w-44 h-8 bg-surface border border-border rounded" />
                    }
                >
                    <SearchInput />
                </Suspense>
            </div>
        </header>
    );
}
