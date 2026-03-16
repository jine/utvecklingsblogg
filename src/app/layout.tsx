import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-dm-sans",
});

export const metadata: Metadata = {
    title: "Nattsken - Utvecklingsblogg",
    description:
        "Här delar jag mina erfarenheter och insikter från utvecklingsvärlden, inklusive projekt, tekniker och lärdomar.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="sv">
            <body
                className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
            >
                <div className="atmospheric-bg" />
                <div className="relative z-10 container max-w-5xl mx-auto p-6">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    );
}
