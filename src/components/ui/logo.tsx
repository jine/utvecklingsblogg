import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="font-bold text-3xl tracking-tight">
            NATT<span className="text-primary">SKEN</span>
        </Link>
    );
}
