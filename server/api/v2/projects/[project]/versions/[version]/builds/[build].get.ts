import { db, schema } from '@nuxthub/db';
import { eq, and } from 'drizzle-orm';
import { getPublicUrl } from '~~/server/utils/blob';

export default defineEventHandler(async event => {
  const projectKey = getRouterParam(event, 'project')!;
  const versionKey = getRouterParam(event, 'version')!;
  const buildNumber = getRouterParam(event, 'build')!;

  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.key, projectKey)).limit(1);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: `Project '${projectKey}' not found` });
  }

  const [version] = await db
    .select()
    .from(schema.versions)
    .where(and(eq(schema.versions.projectId, project.id), eq(schema.versions.key, versionKey)))
    .limit(1);

  if (!version) {
    throw createError({ statusCode: 404, statusMessage: `Version '${versionKey}' not found for project '${projectKey}'` });
  }

  const [build] = await db
    .select()
    .from(schema.builds)
    .where(and(eq(schema.builds.versionId, version.id), eq(schema.builds.buildNumber, parseInt(buildNumber))))
    .limit(1);

  if (!build) {
    throw createError({ statusCode: 404, statusMessage: `Build '${buildNumber}' not found for version '${versionKey}' of project '${projectKey}'` });
  }

  const buildCommits = await db.select().from(schema.commits).where(eq(schema.commits.buildId, build.id));
  const buildDownloads = await db.select().from(schema.downloads).where(eq(schema.downloads.buildId, build.id));

  const downloads: Record<string, { name: string; checksums: { sha256: string }; size: number; url: string }> = {};
  for (const dl of buildDownloads) {
    downloads[dl.name] = {
      name: dl.fileName,
      checksums: { sha256: dl.sha256 },
      size: dl.size,
      url: getPublicUrl(dl.filePath),
    };
  }

  return {
    id: build.buildNumber,
    time: build.time.toISOString(),
    channel: build.channel.toUpperCase() as 'ALPHA' | 'BETA' | 'STABLE',
    commits: buildCommits.map(c => ({ sha: c.sha, message: c.message, time: c.time.toISOString() })),
    downloads,
  };
});
