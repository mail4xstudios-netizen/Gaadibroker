import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

let s3Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return public URL
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

export function isR2Ready(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}
