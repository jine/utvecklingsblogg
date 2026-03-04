import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nattsken - Utvecklingsblogg",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="sv">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="container max-w-5xl mx-auto py-6">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    );
}
