"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginLink() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleLogin = async () => {
        await authClient.signIn.social({ provider: "google" });
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    if (session) {
        return (
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-muted">
                    Inloggad som: {session.user.email} {" - "}
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="text-sm text-primary hover:text-primary transition-colors cursor-pointer"
                    >
                        Logga ut
                    </button>
                </span>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            type="button"
            className="text-sm text-muted hover:text-primary transition-colors cursor-pointer underline-offset-2"
        >
            Logga in med Google
        </button>
    );
}
