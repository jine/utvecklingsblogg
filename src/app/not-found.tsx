import Link from "next/link";

export default function NotFound() {
    return (
        <div className="py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-gray-500 mb-8">Sidan hittades inte.</p>
            <Link href="/" className="underline">
                Tillbaka till startsidan
            </Link>
        </div>
    );
}
