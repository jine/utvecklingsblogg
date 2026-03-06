import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Neon = PostgreSQL
    }),

    // No emailAndPassword

    socialProviders: {
        google: {
            // Required: pull from .env (these are the standard names)
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

            // Optional but strongly recommended:
            // Better Auth auto-builds callback as ${baseURL}/api/auth/callback/google
            // If you need to override (rare), set redirectURI explicitly
            // redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,

            // Optional: request these scopes (email & profile are usually default)
            // scopes: ["openid", "email", "profile"],
        },
    },

    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,

    // If you want to force users to have verified email from Google
    trustEmailFromProvider: true, // or check docs for exact flag in your version

    // Optional: better performance with joins (if your Better Auth version ≥ ~1.4)
    // experimental: {
    //   joins: true,
    // },
});
