"use client";

import { authClient } from "@/lib/auth-client";

export function LoginLink() {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <button onClick={handleLogin} type="button">
            Login with Google
        </button>
    );
}
