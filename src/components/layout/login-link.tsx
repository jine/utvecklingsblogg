"use client";

import { authClient } from "@/lib/auth-client";

export function LoginLink() {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <button onClick={handleLogin} type="button" className="pointer">
            Login with Google
        </button>
    );
}
