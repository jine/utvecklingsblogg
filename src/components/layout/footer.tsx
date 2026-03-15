import { LoginLink } from "@/components/ui/login-link";

export default function Footer() {
    return (
        <footer className="text-center text-sm text-muted py-8 mt-12 border-t border-border">
            <p>
                &copy; {new Date().getFullYear()} Nattsken. All rights reserved.
            </p>
            <div className="mt-4">
                <LoginLink />
            </div>
        </footer>
    );
}
