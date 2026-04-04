import sharp from "sharp";

/**
 * Converts PNG/JPEG images to WebP format.
 * If already WebP, returns the original buffer.
 */
export async function convertToWebP(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  if (mimeType === "image/webp") {
    return { buffer, contentType: "image/webp", ext: "webp" };
  }

  const webpBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();

  return {
    buffer: webpBuffer,
    contentType: "image/webp",
    ext: "webp",
  };
}
