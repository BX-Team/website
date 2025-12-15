import { db } from '@/db';
import { projects, versions, builds } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

interface VersionDetailResponse {
  version: {
    id: string;
    java?: {
      version: {
        minimum: number;
      };
    };
    support: {
      status: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
    };
  };
  builds: number[];
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ project: string; version: string }>;
  },
) {
  try {
    const { project: projectKey, version: versionKey } = await params;

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

    const versionBuilds = await db.select().from(builds).where(eq(builds.versionId, version[0].id));

    const response: VersionDetailResponse = {
      version: {
        id: version[0].key,
        ...(version[0].javaMinVersion && {
          java: {
            version: {
              minimum: version[0].javaMinVersion,
            },
          },
        }),
        support: {
          status: version[0].supportStatus.toUpperCase() as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
        },
      },
      builds: versionBuilds.map(b => b.buildNumber).sort((a, b) => b - a),
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching version:', error);
    return errorResponse('Failed to fetch version', 500);
  }
}
