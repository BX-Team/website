import { db } from '@/db';
import { projects, versions } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

interface ProjectsResponse {
  projects: ProjectResponse[];
}

export async function GET() {
  try {
    const allProjects = await db.select().from(projects);

    const projectsResponse: ProjectResponse[] = await Promise.all(
      allProjects.map(async project => {
        const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project.id));
        const versionGroups = groupVersions(projectVersions.map(v => v.key));

        return {
          project: {
            id: project.key,
            name: project.name,
            description: project.description || undefined,
            ...(project.latestVersion && { latestVersion: project.latestVersion }),
            ...(project.experimentalVersion && { experimentalVersion: project.experimentalVersion }),
          },
          version_groups: versionGroups,
        };
      }),
    );

    const response: ProjectsResponse = {
      projects: projectsResponse,
    };

    return successResponse(response);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return errorResponse('Failed to fetch projects', 500);
  }
}
