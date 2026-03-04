import Link from "next/link";

export default function Header() {
    return (
        <header className="container flex items-center max-w-5xl transparent bg-background/10 backdrop-blur-sm mb-6">
            <div className="flex-col">
                <h1 className="text-2xl font-bold">
                    <Link href="/">Nattsken</Link>
                </h1>
                <h2 className="text-sm text-gray-600">Utvecklingsblogg</h2>
            </div>

            <div className="ml-auto max-w-xs w-full">
                <input
                    type="text"
                    placeholder="Sök efter inlägg..."
                    className="px-4 py-2 w-full border rounded-lg"
                />
            </div>
        </header>
    );
}
