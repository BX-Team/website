import { db } from '@/db';
import { projects, versions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

interface VersionResponse {
  version: {
    id: string;
    java?: {
      version: {
        minimum: number;
      };
      flags?: {
        recommended: string[];
      };
    };
    support?: {
      status: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
      end?: string;
    };
  };
  builds: number[];
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ project: string }> }) {
  try {
    const { project: projectKey } = await params;

    const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

    if (project.length === 0) {
      return errorResponse(`Project '${projectKey}' not found`);
    }

    const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project[0].id));

    const versionResponses: VersionResponse[] = await Promise.all(
      projectVersions.map(async version => {
        const { builds } = await import('@/db/schema');
        const versionBuilds = await db.select().from(builds).where(eq(builds.versionId, version.id));

        const response: VersionResponse = {
          version: {
            id: version.key,
            ...(version.javaMinVersion && {
              java: {
                version: {
                  minimum: version.javaMinVersion,
                },
              },
            }),
            support: {
              status: version.supportStatus.toUpperCase() as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
            },
          },
          builds: versionBuilds.map(b => b.buildNumber).sort((a, b) => b - a),
        };

        return response;
      }),
    );

    return successResponse(versionResponses);
  } catch (error) {
    console.error('Error fetching versions:', error);
    return errorResponse('Failed to fetch versions', 500);
  }
}
