import { db } from '@/db';
import { projects, versions, builds, commits, downloads } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { verifyApiKey } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface UploadBuildRequest {
  buildNumber?: number;
  channel?: 'ALPHA' | 'BETA' | 'STABLE';
  commits?: {
    sha: string;
    message: string;
    time: string;
  }[];
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ project: string; version: string }>;
  },
) {
  try {
    if (!verifyApiKey(request)) {
      return errorResponse('Unauthorized', 401);
    }

    const { project: projectKey, version: versionKey } = await params;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataJson = formData.get('metadata') as string;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    const metadata: UploadBuildRequest = metadataJson ? JSON.parse(metadataJson) : {};

    const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

    if (project.length === 0) {
      return errorResponse(`Project '${projectKey}' not found`, 404);
    }

    const version = await db
      .select()
      .from(versions)
      .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
      .limit(1);

    if (version.length === 0) {
      return errorResponse(`Version '${versionKey}' not found for project '${projectKey}'`, 404);
    }

    let buildNumber = metadata.buildNumber;
    if (!buildNumber) {
      const lastBuild = await db
        .select()
        .from(builds)
        .where(eq(builds.versionId, version[0].id))
        .orderBy(desc(builds.buildNumber))
        .limit(1);

      buildNumber = lastBuild.length > 0 ? lastBuild[0].buildNumber + 1 : 1;
    }

    const channelValue = (metadata.channel?.toUpperCase() || 'STABLE') as 'ALPHA' | 'BETA' | 'STABLE';
    const [build] = await db
      .insert(builds)
      .values({
        versionId: version[0].id,
        buildNumber,
        channel: channelValue,
        time: new Date(),
      })
      .returning();

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const fileName = file.name;

    const s3Key = `${projectKey}/versions/${versionKey}/${buildNumber}/${fileName}`;

    const publicUrl = await uploadToS3(s3Key, buffer);

    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const sha256 = hash.digest('hex');

    await db.insert(downloads).values({
      buildId: build.id,
      name: 'application',
      fileName,
      filePath: s3Key,
      size: buffer.length,
      sha256,
    });

    if (metadata.commits && metadata.commits.length > 0) {
      await db.insert(commits).values(
        metadata.commits.map(commit => ({
          buildId: build.id,
          sha: commit.sha,
          message: commit.message,
          time: new Date(commit.time),
        })),
      );
    }

    return successResponse({
      message: 'Build uploaded successfully',
      build: {
        id: build.buildNumber,
        project: projectKey,
        version: versionKey,
        channel: build.channel,
      },
    });
  } catch (error) {
    console.error('Error uploading build:', error);
    return errorResponse(`Failed to upload build: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
