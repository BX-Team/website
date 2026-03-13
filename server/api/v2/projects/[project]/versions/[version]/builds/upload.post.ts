import { db, schema } from '@nuxthub/db';
import { eq, and, desc } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { blob } from '@nuxthub/blob'

interface UploadBuildMetadata {
  buildNumber?: number;
  channel?: 'ALPHA' | 'BETA' | 'STABLE';
  commits?: { sha: string; message: string; time: string }[];
}

export default defineEventHandler(async event => {
  const projectKey = getRouterParam(event, 'project')!;
  const versionKey = getRouterParam(event, 'version')!;

  const parts = await readMultipartFormData(event);
  if (!parts) {
    throw createError({ statusCode: 400, statusMessage: 'No multipart data provided' });
  }

  const filePart = parts.find(p => p.name === 'file');
  const metadataPart = parts.find(p => p.name === 'metadata');

  if (!filePart) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' });
  }

  const metadata: UploadBuildMetadata = metadataPart ? JSON.parse(metadataPart.data.toString()) : {};

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

  let buildNumber = metadata.buildNumber;
  if (!buildNumber) {
    const [lastBuild] = await db
      .select()
      .from(schema.builds)
      .where(eq(schema.builds.versionId, version.id))
      .orderBy(desc(schema.builds.buildNumber))
      .limit(1);

    buildNumber = lastBuild ? lastBuild.buildNumber + 1 : 1;
  }

  const channelValue = (metadata.channel?.toUpperCase() || 'STABLE') as 'ALPHA' | 'BETA' | 'STABLE';
  const [build] = await db
    .insert(schema.builds)
    .values({ versionId: version.id, buildNumber, channel: channelValue, time: new Date() })
    .returning();

  const buffer = Buffer.from(filePart.data);
  const fileName = filePart.filename || 'file.jar';
  const blobPath = `${projectKey}/versions/${versionKey}/${buildNumber}/${fileName}`;

  await blob.put(blobPath, buffer, { contentType: 'application/java-archive' });

  const sha256 = createHash('sha256').update(buffer).digest('hex');

  await db.insert(schema.downloads).values({
    buildId: build.id,
    name: 'application',
    fileName,
    filePath: blobPath,
    size: buffer.length,
    sha256,
  });

  if (metadata.commits?.length) {
    await db.insert(schema.commits).values(
      metadata.commits.map(c => ({
        buildId: build.id,
        sha: c.sha,
        message: c.message,
        time: new Date(c.time),
      })),
    );
  }

  return {
    message: 'Build uploaded successfully',
    build: {
      id: build.buildNumber,
      project: projectKey,
      version: versionKey,
      channel: build.channel,
    },
  };
});
