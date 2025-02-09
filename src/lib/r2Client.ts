import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  const bucketName = process.env.R2_BUCKET_NAME!;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return await s3Client.send(command);
}

export async function getR2FileStream(key: string) {
  const bucketName = process.env.R2_BUCKET_NAME!;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const response = await s3Client.send(command);
  if (!response.Body) throw new Error('No file body returned');

  const stream = response.Body as Readable;
  return {
    body: stream,
    contentType: response.ContentType || 'application/octet-stream',
  };
}
