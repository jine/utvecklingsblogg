export default function Header() {
    return (
        <header>
            <div className="container flex max-w-4xl transparent bg-background/10 backdrop-blur-sm">
                <div className="flex-col">
                    <h1 className="text-2xl font-bold">Nattsken</h1>
                    <h2 className="text-sm text-gray-600">Utvecklingsblogg</h2>
                </div>

                <div className="ml-auto">
                    <input type="text" placeholder="Sök..." />
                </div>
            </div>
        </header>
    );
}