import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;
    const safeFilename = path.basename(filename);

    // 1. Try to find the file in the new root-level uploads folder
    let filePath = path.join(process.cwd(), "uploads", safeFilename);

    // 2. Fallback to the old public/uploads folder for existing images
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), "public", "uploads", safeFilename);
    }

    // 3. Return 404 if the file doesn't exist in either folder
    if (!fs.existsSync(filePath)) {
        return new NextResponse("File Not Found", { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filePath);
        const ext = path.extname(safeFilename).toLowerCase();
        
        let contentType = "application/octet-stream";
        if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".svg") contentType = "image/svg+xml";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=604800, immutable", // Browser cache for 7 days
            },
        });
    } catch (error) {
        console.error("Error serving image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
