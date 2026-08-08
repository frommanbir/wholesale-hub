/**
 * Compress image on client side using HTML Canvas before uploading.
 * Reduces large smartphone photos (5-15MB) to compact JPEGs (~200-500KB)
 * while preserving clear visual readability.
 */
export async function compressImage(
    file: File,
    maxDimension: number = 2048,
    quality: number = 0.88
): Promise<File> {
    // Only process image files
    if (!file || !file.type.startsWith("image/")) {
        return file;
    }

    // Skip compression entirely for files under 1 MB (1024 KB)
    if (file.size <= 1024 * 1024) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let width = img.width;
            let height = img.height;

            // Scale down proportional to maxDimension
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(file);
                return;
            }

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed JPEG
            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size < file.size) {
                        const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                        const compressedFile = new File([blob], newFilename, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        // Fall back to original file if compression didn't reduce size
                        resolve(file);
                    }
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file); // Fall back to original file on error
        };

        img.src = objectUrl;
    });
}
