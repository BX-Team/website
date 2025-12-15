import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
      throw new Error(
        'S3 credentials are not configured. Please set S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY',
      );
    }

    s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

export const S3_BUCKET = process.env.S3_BUCKET || 'atlas';
export const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || 'https://files.bxteam.org';

export async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string = 'application/java-archive',
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await getS3Client().send(command);
  return `${S3_PUBLIC_URL}/${key}`;
}

export function getPublicUrl(key: string): string {
  return `${S3_PUBLIC_URL}/${key}`;
}
