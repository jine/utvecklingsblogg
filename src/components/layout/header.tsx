import { Logo } from "@/components/ui/logo";
import { NewPostLink } from "@/components/ui/new-post-link";

export default function Header() {
    return (
        <header className="flex items-center justify-between mb-8 py-4 border-b border-border">
            <div className="flex flex-col items-center">
                <Logo />
                <span className="text-muted mt-1">Utvecklingsblogg</span>
            </div>
            <div className="flex items-center gap-4">
                <NewPostLink />
                <input
                    type="text"
                    placeholder="Sök..."
                    className="w-28 sm:w-40 px-3 py-1.5 bg-surface border border-border rounded text-sm placeholder:text-muted focus:outline-none focus:border-primary"
                />
            </div>
        </header>
    );
}
