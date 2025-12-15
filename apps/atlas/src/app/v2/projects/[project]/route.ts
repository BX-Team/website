import { db } from '@/db';
import { projects, versions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { groupVersions } from '@/lib/version-utils';

export const dynamic = 'force-dynamic';

interface ProjectResponse {
  project: {
    id: string;
    name: string;
    description?: string;
    latestVersion?: string;
    experimentalVersion?: string;
  };
  version_groups: Record<string, string[]>;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ project: string }> }) {
  try {
    const { project: projectKey } = await params;

    const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

    if (project.length === 0) {
      return errorResponse(`Project '${projectKey}' not found`);
    }

    const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project[0].id));
    const versionGroups = groupVersions(projectVersions.map(v => v.key));

    const response: ProjectResponse = {
      project: {
        id: project[0].key,
        name: project[0].name,
        description: project[0].description || undefined,
        ...(project[0].latestVersion && { latestVersion: project[0].latestVersion }),
        ...(project[0].experimentalVersion && { experimentalVersion: project[0].experimentalVersion }),
      },
      version_groups: versionGroups,
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching project:', error);
    return errorResponse('Failed to fetch project', 500);
  }
}
