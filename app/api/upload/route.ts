import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Only allow images
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Limit: 20 MB
        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure root-level uploads directory exists
        const uploadDir = path.join(process.cwd(), "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Compress and convert image to WebP using sharp with fallback
        let optimizedBuffer: Buffer;
        let safeName: string;
        try {
            const sharpModule = await import("sharp");
            const sharp = sharpModule.default;
            optimizedBuffer = await sharp(buffer)
                .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        } catch (sharpError) {
            console.warn("Sharp optimization failed, using original format:", sharpError);
            optimizedBuffer = buffer;
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
            safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        }

        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, optimizedBuffer);

        return NextResponse.json({ url: `/uploads/${safeName}` });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
