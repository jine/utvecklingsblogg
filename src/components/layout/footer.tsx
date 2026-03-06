import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LoginLink } from "./login-link";

export default async function Footer() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <footer className="container text-center text-sm text-gray-500 py-6">
            <p>
                &copy; {new Date().getFullYear()} Nattsken. All rights reserved.
            </p>
            <p className="mt-2">
                {session ? (
                    <span>Logged in as: {session.user.email}</span>
                ) : (
                    <LoginLink />
                )}
            </p>
            {session && (
                <details className="mt-4">
                    <pre className="mt-2 p-2 rounded overflow-auto max-h-128 text-left">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </details>
            )}
        </footer>
    );
}
