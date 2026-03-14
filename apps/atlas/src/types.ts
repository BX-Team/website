export interface BuildQueueMessage {
  versionId: number;
  buildNumber: number;
  channel: 'ALPHA' | 'BETA' | 'STABLE';
  r2Key: string;
  fileName: string;
  fileSize: number;
  sha256: string;
  commits: { sha: string; message: string; time: string }[];
}

export type Env = {
  API_SECRET_KEY: string;
  R2_PUBLIC_URL: string;
  HYPERDRIVE: Hyperdrive;
  BUCKET: R2Bucket;
  BUILD_QUEUE: Queue<BuildQueueMessage>;
  RATE_LIMITER: RateLimit;
};
