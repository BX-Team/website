import { db, schema } from '@nuxthub/db';
import { eq, and } from 'drizzle-orm';

interface CreateVersionBody {
  key: string;
  supportStatus?: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
  javaMinVersion?: number;
}

export default defineEventHandler(async event => {
  const projectKey = getRouterParam(event, 'project')!;
  const body = await readBody<CreateVersionBody>(event);

  if (!body.key) {
    throw createError({ statusCode: 400, statusMessage: 'Version key is required' });
  }

  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.key, projectKey)).limit(1);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: `Project '${projectKey}' not found` });
  }

  const [existingVersion] = await db
    .select()
    .from(schema.versions)
    .where(and(eq(schema.versions.projectId, project.id), eq(schema.versions.key, body.key)))
    .limit(1);

  if (existingVersion) {
    throw createError({ statusCode: 409, statusMessage: `Version '${body.key}' already exists for project '${projectKey}'` });
  }

  const [version] = await db
    .insert(schema.versions)
    .values({
      projectId: project.id,
      key: body.key,
      supportStatus: (body.supportStatus?.toUpperCase() || 'SUPPORTED') as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
      javaMinVersion: body.javaMinVersion || null,
    })
    .returning();

  return {
    message: 'Version created successfully',
    version: {
      id: version.id,
      project: projectKey,
      key: version.key,
      supportStatus: version.supportStatus,
      javaMinVersion: version.javaMinVersion,
    },
  };
});
