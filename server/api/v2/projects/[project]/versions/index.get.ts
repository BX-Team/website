import { db, schema } from '@nuxthub/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const projectKey = getRouterParam(event, 'project')!;

  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.key, projectKey)).limit(1);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: `Project '${projectKey}' not found` });
  }

  const projectVersions = await db.select().from(schema.versions).where(eq(schema.versions.projectId, project.id));

  return await Promise.all(
    projectVersions.map(async version => {
      const versionBuilds = await db.select().from(schema.builds).where(eq(schema.builds.versionId, version.id));

      return {
        version: {
          id: version.key,
          ...(version.javaMinVersion && {
            java: { version: { minimum: version.javaMinVersion } },
          }),
          support: {
            status: version.supportStatus.toUpperCase() as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
          },
        },
        builds: versionBuilds.map(b => b.buildNumber).sort((a, b) => b - a),
      };
    }),
  );
});
