import { mkdir, writeFile } from "fs/promises";
import { headers } from "next/headers";
import { join } from "path";
import sharp from "sharp";
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "images");

// Maximum dimensions for uploaded images
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

/**
 * Resize image if it exceeds maximum dimensions
 * Maintains aspect ratio and only downsizes (never upscales)
 * Returns the processed buffer
 */
async function resizeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    // Skip resizing for GIFs (preserve animation)
    if (mimeType === "image/gif") {
        return buffer;
    }

    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        // If image is already within bounds, return original
        if (
            !metadata.width ||
            !metadata.height ||
            (metadata.width <= MAX_WIDTH && metadata.height <= MAX_HEIGHT)
        ) {
            return buffer;
        }

        // Resize to fit within MAX_WIDTH x MAX_HEIGHT while maintaining aspect ratio
        // Using 'inside' fit ensures the image fits within the bounds
        const resizedBuffer = await image
            .resize(MAX_WIDTH, MAX_HEIGHT, {
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();

        return resizedBuffer;
    } catch (error) {
        console.error("Image resize failed:", error);
        // Return original buffer if resize fails
        return buffer;
    }
}

/**
 * Check if file extension matches the claimed MIME type
 */
function isValidExtension(filename: string, mimeType: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (!ext) return false;

    const extWithDot = `.${ext}`;
    if (!ALLOWED_EXTENSIONS.includes(extWithDot)) {
        return false;
    }

    // Validate MIME type matches extension
    const mimeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
    };

    return mimeMap[ext] === mimeType;
}

/**
 * Generate a unique filename based on timestamp and random string
 * Format: YYYY-MM-DD-HH-mm-ss-{random}.{ext}
 */
function generateFilename(originalName: string): string {
    const now = new Date();
    const timestamp = now
        .toISOString()
        .replace(/[:T]/g, "-")
        .slice(0, 19)
        .replace(/\./g, ""); // YYYY-MM-DD-HH-mm-ss

    // Get file extension - only allow safe extensions
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "bin";

    // Validate extension
    if (!ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
        throw new Error("Invalid file extension");
    }

    // Generate random suffix (8 characters for better collision resistance)
    const random = Math.random().toString(36).substring(2, 10);

    return `${timestamp}-${random}.${ext}`;
}

/**
 * POST handler for image uploads
 * Requires authentication
 */
export async function POST(request: Request): Promise<Response> {
    try {
        // Check authentication
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });

        if (!session?.user) {
            return Response.json(
                { error: "Unauthorized - Please sign in to upload images" },
                { status: 401 },
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return Response.json(
                {
                    error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
                },
                { status: 400 },
            );
        }

        // Validate file extension matches MIME type
        if (!isValidExtension(file.name, file.type)) {
            return Response.json(
                {
                    error: "File extension does not match the file type",
                },
                { status: 400 },
            );
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            return Response.json(
                {
                    error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${MAX_SIZE / 1024 / 1024}MB`,
                },
                { status: 400 },
            );
        }

        // Generate unique filename
        let filename: string;
        try {
            filename = generateFilename(file.name);
        } catch {
            return Response.json(
                { error: "Invalid file extension" },
                { status: 400 },
            );
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Read file and resize if needed
        const buffer = Buffer.from(await file.arrayBuffer());
        const processedBuffer = await resizeImage(buffer, file.type);

        // Write processed file to disk
        await writeFile(join(UPLOAD_DIR, filename), processedBuffer);

        // Return the public URL
        const url = `/uploads/images/${filename}`;

        return Response.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Internal server error";
        return Response.json(
            { error: `Upload failed: ${errorMessage}` },
            { status: 500 },
        );
    }
}
