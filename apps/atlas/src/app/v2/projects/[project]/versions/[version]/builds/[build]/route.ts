import { db } from '@/db';
import { projects, versions, builds, commits, downloads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { getPublicUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

interface BuildResponse {
  id: number;
  time: string;
  channel: 'ALPHA' | 'BETA' | 'STABLE';
  commits: {
    sha: string;
    message: string;
    time: string;
  }[];
  downloads: Record<
    string,
    {
      name: string;
      checksums: {
        sha256: string;
      };
      size: number;
      url: string;
    }
  >;
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ project: string; version: string; build: string }>;
  },
) {
  try {
    const { project: projectKey, version: versionKey, build: buildNumber } = await params;

    const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

    if (project.length === 0) {
      return errorResponse(`Project '${projectKey}' not found`);
    }

    const version = await db
      .select()
      .from(versions)
      .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
      .limit(1);

    if (version.length === 0) {
      return errorResponse(`Version '${versionKey}' not found for project '${projectKey}'`);
    }

    const build = await db
      .select()
      .from(builds)
      .where(and(eq(builds.versionId, version[0].id), eq(builds.buildNumber, parseInt(buildNumber))))
      .limit(1);

    if (build.length === 0) {
      return errorResponse(`Build '${buildNumber}' not found for version '${versionKey}' of project '${projectKey}'`);
    }

    const buildCommits = await db.select().from(commits).where(eq(commits.buildId, build[0].id));

    const buildDownloads = await db.select().from(downloads).where(eq(downloads.buildId, build[0].id));

    const downloadsMap: Record<
      string,
      {
        name: string;
        checksums: { sha256: string };
        size: number;
        url: string;
      }
    > = {};

    buildDownloads.forEach(download => {
      downloadsMap[download.name] = {
        name: download.fileName,
        checksums: {
          sha256: download.sha256,
        },
        size: download.size,
        url: getPublicUrl(download.filePath),
      };
    });

    const response: BuildResponse = {
      id: build[0].buildNumber,
      time: build[0].time.toISOString(),
      channel: build[0].channel.toUpperCase() as 'ALPHA' | 'BETA' | 'STABLE',
      commits: buildCommits.map(commit => ({
        sha: commit.sha,
        message: commit.message,
        time: commit.time.toISOString(),
      })),
      downloads: downloadsMap,
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching build:', error);
    return errorResponse('Failed to fetch build', 500);
  }
}
