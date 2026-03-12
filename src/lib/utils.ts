import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export function formatDate(date: Date | null | undefined): string {
    if (!date) return "";

    return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export async function requireSession() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/");
    }

    return session;
}
