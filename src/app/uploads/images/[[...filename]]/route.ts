import { readFile } from "fs/promises";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "images");

// Allowed image extensions and their MIME types
const MIME_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
};

/**
 * GET handler for serving uploaded images
 * Route: /uploads/images/[filename]
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename?: string[] }> },
): Promise<Response> {
    try {
        const { filename } = await params;

        // Validate filename parameter
        if (!filename || filename.length === 0) {
            return notFound();
        }

        // Reconstruct filename from path segments (handle nested paths safely)
        const imageFilename = filename.join("/");

        // Security: prevent directory traversal
        if (
            imageFilename.includes("..") ||
            imageFilename.includes("//") ||
            imageFilename.startsWith("/")
        ) {
            return notFound();
        }

        // Get file extension
        const ext = imageFilename
            .substring(imageFilename.lastIndexOf("."))
            .toLowerCase();

        // Validate extension
        if (!MIME_TYPES[ext]) {
            return notFound();
        }

        // Read file
        const filePath = join(UPLOAD_DIR, imageFilename);
        const fileBuffer = await readFile(filePath);

        // Return image with proper content type and caching headers
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": MIME_TYPES[ext],
                "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            },
        });
    } catch (error) {
        // File not found or other error
        return notFound();
    }
}
