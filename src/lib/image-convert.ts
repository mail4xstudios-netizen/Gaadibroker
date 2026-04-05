/**
 * Converts PNG/JPEG images to WebP format.
 * Falls back to original format if sharp is unavailable (e.g., on some hosting platforms).
 */
export async function convertToWebP(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  if (mimeType === "image/webp") {
    return { buffer, contentType: "image/webp", ext: "webp" };
  }

  try {
    const sharp = (await import("sharp")).default;
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    return {
      buffer: webpBuffer,
      contentType: "image/webp",
      ext: "webp",
    };
  } catch (e) {
    console.warn("sharp not available, uploading original format:", e);
    const ext = mimeType === "image/png" ? "png" : "jpg";
    return { buffer, contentType: mimeType, ext };
  }
}
