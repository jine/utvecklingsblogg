import { LoginLink } from "@/components/ui/login-link";

export default function Footer() {
    return (
        <footer className="container text-center text-sm text-gray-500 py-6">
            <p>
                &copy; {new Date().getFullYear()} Nattsken. All rights reserved.
            </p>
            <div className="mt-4">
                <LoginLink />
            </div>
        </footer>
    );
}
