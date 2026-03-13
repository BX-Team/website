import { db, schema } from '@nuxthub/db';
import { eq } from 'drizzle-orm';
import { groupVersions } from '~~/server/utils/version-utils';

export default defineEventHandler(async event => {
  const projectKey = getRouterParam(event, 'project')!;

  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.key, projectKey)).limit(1);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: `Project '${projectKey}' not found` });
  }

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
});
