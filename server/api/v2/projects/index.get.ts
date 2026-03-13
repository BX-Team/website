import { db, schema } from '@nuxthub/db';
import { eq } from 'drizzle-orm';
import { groupVersions } from '~~/server/utils/version-utils';

export default defineEventHandler(async () => {
  const allProjects = await db.select().from(schema.projects);

  const projects = await Promise.all(
    allProjects.map(async project => {
      const projectVersions = await db.select().from(schema.versions).where(eq(schema.versions.projectId, project.id));
      const version_groups = groupVersions(projectVersions.map(v => v.key));

      return {
        project: {
          id: project.key,
          name: project.name,
          description: project.description || undefined,
          ...(project.latestVersion && { latestVersion: project.latestVersion }),
          ...(project.experimentalVersion && { experimentalVersion: project.experimentalVersion }),
        },
        version_groups,
      };
    }),
  );

  return { projects };
});
