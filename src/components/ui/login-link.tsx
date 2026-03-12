"use client";

import { authClient } from "@/lib/auth-client";

export function LoginLink() {
    const { data: session } = authClient.useSession();

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    const handleLogout = async () => {
        await authClient.signOut();
    };

    if (session) {
        return (
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-600">
                    Inloggad som: {session.user.email}
                </span>
                <button
                    onClick={handleLogout}
                    type="button"
                    className="pointer"
                >
                    Logga ut
                </button>
                <details className="mt-4">
                    <pre className="mt-2 p-2 rounded overflow-auto max-h-128 text-left">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </details>
            </div>
        );
    }

    return (
        <button onClick={handleLogin} type="button" className="pointer">
            Login with Google
        </button>
    );
}
