import { and, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { describeRoute, resolver, validator } from 'hono-openapi';
import * as v from 'valibot';
import { getDb } from '../db';
import { builds, commits, downloads, projects, versions } from '../db/schema';
import { groupVersions } from '../lib/version-utils';
import type { Env } from '../types';

export const v2 = new Hono<{ Bindings: Env }>();

const apiAuth = bearerAuth({ verifyToken: (token, c) => token === c.env.API_SECRET_KEY });

function getDownloadUrl(env: Env, r2Key: string): string {
  return `${env.R2_PUBLIC_URL}/${r2Key}`;
}

// --- Shared schemas ---

const ErrorSchema = v.object({
  ok: v.literal(false),
  error: v.string(),
  message: v.string(),
});

const CommitSchema = v.object({
  sha: v.string(),
  message: v.string(),
  time: v.string(),
});

const DownloadFileSchema = v.object({
  name: v.string(),
  checksums: v.object({ sha256: v.string() }),
  size: v.number(),
  url: v.string(),
});

const ChannelEnum = v.picklist(['ALPHA', 'BETA', 'STABLE'] as const);
const SupportStatusEnum = v.picklist(['SUPPORTED', 'DEPRECATED', 'UNSUPPORTED'] as const);

const BuildSchema = v.object({
  id: v.number(),
  time: v.string(),
  channel: ChannelEnum,
  commits: v.array(CommitSchema),
  downloads: v.record(v.string(), DownloadFileSchema),
});

const ProjectSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  latestVersion: v.optional(v.string()),
  experimentalVersion: v.optional(v.string()),
});

const VersionInfoSchema = v.object({
  id: v.string(),
  java: v.optional(v.object({ version: v.object({ minimum: v.number() }) })),
  support: v.object({ status: SupportStatusEnum }),
});

const VersionWithBuildsSchema = v.object({
  version: VersionInfoSchema,
  builds: v.array(v.number()),
});

// --- Param schemas ---

const ProjectParam = v.object({ project: v.string() });
const ProjectVersionParam = v.object({ project: v.string(), version: v.string() });
const ProjectVersionBuildParam = v.object({
  project: v.string(),
  version: v.string(),
  build: v.pipe(v.string(), v.regex(/^\d+$/, 'Build number must be a positive integer')),
});

// --- Helpers ---

const jsonContent = (schema: v.GenericSchema) => ({
  'application/json': { schema: resolver(schema) },
});

const errorResponses = {
  404: { description: 'Not found', content: jsonContent(ErrorSchema) },
  500: { description: 'Internal server error', content: jsonContent(ErrorSchema) },
};

// GET /v2/projects
v2.get(
  '/projects',
  describeRoute({
    tags: ['Projects'],
    summary: 'List all projects',
    description: 'Get all projects with their version groups',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(
          v.object({
            projects: v.array(v.object({ project: ProjectSchema, version_groups: v.array(v.string()) })),
          }),
        ),
      },
      500: errorResponses[500],
    },
  }),
  async c => {
    try {
      const db = await getDb(c.env);
      const allProjects = await db.select().from(projects);

      const projectsResponse = await Promise.all(
        allProjects.map(async project => {
          const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project.id));
          const versionGroups = groupVersions(projectVersions.map(ver => ver.key));

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

      return c.json({ projects: projectsResponse });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch projects' }, 500);
    }
  },
);

// GET /v2/projects/:project
v2.get(
  '/projects/:project',
  describeRoute({
    tags: ['Projects'],
    summary: 'Get project',
    description: 'Get detailed information about a specific project',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(v.object({ project: ProjectSchema, version_groups: v.array(v.string()) })),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectParam),
  async c => {
    try {
      const { project: projectKey } = c.req.valid('param');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project[0].id));
      const versionGroups = groupVersions(projectVersions.map(ver => ver.key));

      return c.json({
        project: {
          id: project[0].key,
          name: project[0].name,
          description: project[0].description || undefined,
          ...(project[0].latestVersion && { latestVersion: project[0].latestVersion }),
          ...(project[0].experimentalVersion && { experimentalVersion: project[0].experimentalVersion }),
        },
        version_groups: versionGroups,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch project' }, 500);
    }
  },
);

// GET /v2/projects/:project/versions
v2.get(
  '/projects/:project/versions',
  describeRoute({
    tags: ['Versions'],
    summary: 'List versions',
    description: 'Get all versions for a specific project',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(v.array(VersionWithBuildsSchema)),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectParam),
  async c => {
    try {
      const { project: projectKey } = c.req.valid('param');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const projectVersions = await db.select().from(versions).where(eq(versions.projectId, project[0].id));

      const versionResponses = await Promise.all(
        projectVersions.map(async version => {
          const versionBuilds = await db.select().from(builds).where(eq(builds.versionId, version.id));

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

      return c.json(versionResponses);
    } catch (error) {
      console.error('Error fetching versions:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch versions' }, 500);
    }
  },
);

// POST /v2/projects/:project/versions/create
v2.post(
  '/projects/:project/versions/create',
  apiAuth,
  describeRoute({
    tags: ['Versions'],
    summary: 'Create version',
    description: 'Create a new version for a project',
    security: [{ bearerAuth: [] }],
    responses: {
      201: {
        description: 'Version created',
        content: jsonContent(
          v.object({
            message: v.string(),
            version: v.object({
              id: v.number(),
              project: v.string(),
              key: v.string(),
              supportStatus: SupportStatusEnum,
              javaMinVersion: v.nullable(v.number()),
            }),
          }),
        ),
      },
      400: { description: 'Bad request', content: jsonContent(ErrorSchema) },
      409: { description: 'Conflict', content: jsonContent(ErrorSchema) },
      ...errorResponses,
    },
  }),
  validator('param', ProjectParam),
  validator(
    'json',
    v.object({
      key: v.string(),
      supportStatus: v.optional(SupportStatusEnum),
      javaMinVersion: v.optional(v.number()),
    }),
  ),
  async c => {
    try {
      const { project: projectKey } = c.req.valid('param');
      const body = c.req.valid('json');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const existingVersion = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, body.key)))
        .limit(1);

      if (existingVersion.length > 0) {
        return c.json(
          { ok: false, error: 'Conflict', message: `Version '${body.key}' already exists for project '${projectKey}'` },
          409,
        );
      }

      const [version] = await db
        .insert(versions)
        .values({
          projectId: project[0].id,
          key: body.key,
          supportStatus: (body.supportStatus || 'SUPPORTED') as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
          javaMinVersion: body.javaMinVersion || null,
        })
        .returning();

      return c.json(
        {
          message: 'Version created successfully',
          version: {
            id: version.id,
            project: projectKey,
            key: version.key,
            supportStatus: version.supportStatus,
            javaMinVersion: version.javaMinVersion,
          },
        },
        201,
      );
    } catch (error) {
      console.error('Error creating version:', error);
      return c.json(
        {
          ok: false,
          error: 'Internal Server Error',
          message: `Failed to create version: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        500,
      );
    }
  },
);

// GET /v2/projects/:project/versions/:version
v2.get(
  '/projects/:project/versions/:version',
  describeRoute({
    tags: ['Versions'],
    summary: 'Get version',
    description: 'Get detailed information about a specific version',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(VersionWithBuildsSchema),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectVersionParam),
  async c => {
    try {
      const { project: projectKey, version: versionKey } = c.req.valid('param');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const version = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
        .limit(1);

      if (version.length === 0) {
        return c.json(
          { ok: false, error: 'Not Found', message: `Version '${versionKey}' not found for project '${projectKey}'` },
          404,
        );
      }

      const versionBuilds = await db.select().from(builds).where(eq(builds.versionId, version[0].id));

      return c.json({
        version: {
          id: version[0].key,
          ...(version[0].javaMinVersion && {
            java: { version: { minimum: version[0].javaMinVersion } },
          }),
          support: {
            status: version[0].supportStatus.toUpperCase() as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
          },
        },
        builds: versionBuilds.map(b => b.buildNumber).sort((a, b) => b - a),
      });
    } catch (error) {
      console.error('Error fetching version:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch version' }, 500);
    }
  },
);

// GET /v2/projects/:project/versions/:version/builds
v2.get(
  '/projects/:project/versions/:version/builds',
  describeRoute({
    tags: ['Builds'],
    summary: 'List builds',
    description: 'Get all builds for a specific version, optionally filtered by channel',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(v.array(BuildSchema)),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectVersionParam),
  validator('query', v.object({ channel: v.optional(ChannelEnum) })),
  async c => {
    try {
      const { project: projectKey, version: versionKey } = c.req.valid('param');
      const { channel: channelFilter } = c.req.valid('query');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const version = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
        .limit(1);

      if (version.length === 0) {
        return c.json(
          { ok: false, error: 'Not Found', message: `Version '${versionKey}' not found for project '${projectKey}'` },
          404,
        );
      }

      const conditions = [eq(builds.versionId, version[0].id)];

      if (channelFilter) {
        conditions.push(eq(builds.channel, channelFilter));
      }

      const versionBuilds = await db
        .select()
        .from(builds)
        .where(and(...conditions))
        .orderBy(desc(builds.buildNumber));

      const buildResponses = await Promise.all(
        versionBuilds.map(async build => {
          const buildCommits = await db.select().from(commits).where(eq(commits.buildId, build.id));
          const buildDownloads = await db.select().from(downloads).where(eq(downloads.buildId, build.id));

          const downloadsMap: Record<
            string,
            { name: string; checksums: { sha256: string }; size: number; url: string }
          > = {};
          buildDownloads.forEach(dl => {
            downloadsMap[dl.name] = {
              name: dl.fileName,
              checksums: { sha256: dl.sha256 },
              size: dl.size,
              url: getDownloadUrl(c.env, dl.filePath),
            };
          });

          return {
            id: build.buildNumber,
            time: build.time.toISOString(),
            channel: build.channel.toUpperCase() as 'ALPHA' | 'BETA' | 'STABLE',
            commits: buildCommits.map(commit => ({
              sha: commit.sha,
              message: commit.message,
              time: commit.time.toISOString(),
            })),
            downloads: downloadsMap,
          };
        }),
      );

      return c.json(buildResponses);
    } catch (error) {
      console.error('Error fetching builds:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch builds' }, 500);
    }
  },
);

// GET /v2/projects/:project/versions/:version/builds/latest
// Must be registered before /:build to ensure static segment takes priority
v2.get(
  '/projects/:project/versions/:version/builds/latest',
  describeRoute({
    tags: ['Builds'],
    summary: 'Get latest build',
    description: 'Get the latest build for a specific version',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(BuildSchema),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectVersionParam),
  async c => {
    try {
      const { project: projectKey, version: versionKey } = c.req.valid('param');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const version = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
        .limit(1);

      if (version.length === 0) {
        return c.json(
          { ok: false, error: 'Not Found', message: `Version '${versionKey}' not found for project '${projectKey}'` },
          404,
        );
      }

      const latestBuild = await db
        .select()
        .from(builds)
        .where(eq(builds.versionId, version[0].id))
        .orderBy(desc(builds.buildNumber))
        .limit(1);

      if (latestBuild.length === 0) {
        return c.json(
          {
            ok: false,
            error: 'Not Found',
            message: `No builds found for version '${versionKey}' of project '${projectKey}'`,
          },
          404,
        );
      }

      const build = latestBuild[0];
      const buildCommits = await db.select().from(commits).where(eq(commits.buildId, build.id));
      const buildDownloads = await db.select().from(downloads).where(eq(downloads.buildId, build.id));

      const downloadsMap: Record<string, { name: string; checksums: { sha256: string }; size: number; url: string }> =
        {};
      buildDownloads.forEach(dl => {
        downloadsMap[dl.name] = {
          name: dl.fileName,
          checksums: { sha256: dl.sha256 },
          size: dl.size,
          url: getDownloadUrl(c.env, dl.filePath),
        };
      });

      return c.json({
        id: build.buildNumber,
        time: build.time.toISOString(),
        channel: build.channel.toUpperCase() as 'ALPHA' | 'BETA' | 'STABLE',
        commits: buildCommits.map(commit => ({
          sha: commit.sha,
          message: commit.message,
          time: commit.time.toISOString(),
        })),
        downloads: downloadsMap,
      });
    } catch (error) {
      console.error('Error fetching latest build:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch latest build' }, 500);
    }
  },
);

// GET /v2/projects/:project/versions/:version/builds/:build
v2.get(
  '/projects/:project/versions/:version/builds/:build',
  describeRoute({
    tags: ['Builds'],
    summary: 'Get build',
    description: 'Get detailed information about a specific build',
    responses: {
      200: {
        description: 'Successful response',
        content: jsonContent(BuildSchema),
      },
      ...errorResponses,
    },
  }),
  validator('param', ProjectVersionBuildParam),
  async c => {
    try {
      const { project: projectKey, version: versionKey, build: buildNumber } = c.req.valid('param');
      const db = await getDb(c.env);

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const version = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
        .limit(1);

      if (version.length === 0) {
        return c.json(
          { ok: false, error: 'Not Found', message: `Version '${versionKey}' not found for project '${projectKey}'` },
          404,
        );
      }

      const build = await db
        .select()
        .from(builds)
        .where(and(eq(builds.versionId, version[0].id), eq(builds.buildNumber, parseInt(buildNumber))))
        .limit(1);

      if (build.length === 0) {
        return c.json(
          {
            ok: false,
            error: 'Not Found',
            message: `Build '${buildNumber}' not found for version '${versionKey}' of project '${projectKey}'`,
          },
          404,
        );
      }

      const buildCommits = await db.select().from(commits).where(eq(commits.buildId, build[0].id));
      const buildDownloads = await db.select().from(downloads).where(eq(downloads.buildId, build[0].id));

      const downloadsMap: Record<string, { name: string; checksums: { sha256: string }; size: number; url: string }> =
        {};
      buildDownloads.forEach(dl => {
        downloadsMap[dl.name] = {
          name: dl.fileName,
          checksums: { sha256: dl.sha256 },
          size: dl.size,
          url: getDownloadUrl(c.env, dl.filePath),
        };
      });

      return c.json({
        id: build[0].buildNumber,
        time: build[0].time.toISOString(),
        channel: build[0].channel.toUpperCase() as 'ALPHA' | 'BETA' | 'STABLE',
        commits: buildCommits.map(commit => ({
          sha: commit.sha,
          message: commit.message,
          time: commit.time.toISOString(),
        })),
        downloads: downloadsMap,
      });
    } catch (error) {
      console.error('Error fetching build:', error);
      return c.json({ ok: false, error: 'Internal Server Error', message: 'Failed to fetch build' }, 500);
    }
  },
);

// POST /v2/projects/:project/versions/:version/builds/upload
v2.post(
  '/projects/:project/versions/:version/builds/upload',
  apiAuth,
  describeRoute({
    tags: ['Builds'],
    summary: 'Upload build',
    description: 'Upload a new build file for a specific version. Queued for async processing.',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['file'],
            properties: {
              file: { type: 'string', format: 'binary', description: 'JAR file to upload' },
              metadata: {
                type: 'string',
                description: 'JSON string with build metadata (buildNumber, channel, commits)',
              },
            },
          },
        },
      },
    },
    responses: {
      202: {
        description: 'Build queued for processing',
        content: jsonContent(
          v.object({
            message: v.string(),
            build: v.object({
              id: v.number(),
              project: v.string(),
              version: v.string(),
              channel: ChannelEnum,
            }),
          }),
        ),
      },
      400: { description: 'Bad request', content: jsonContent(ErrorSchema) },
      ...errorResponses,
    },
  }),
  validator('param', ProjectVersionParam),
  async c => {
    try {
      const { project: projectKey, version: versionKey } = c.req.valid('param');
      const db = await getDb(c.env);

      const formData = await c.req.formData();
      const file = formData.get('file') as File | null;
      const metadataJson = formData.get('metadata') as string | null;

      if (!file) {
        return c.json({ ok: false, error: 'Bad Request', message: 'No file provided' }, 400);
      }

      const metadata: {
        buildNumber?: number;
        channel?: 'ALPHA' | 'BETA' | 'STABLE';
        commits?: { sha: string; message: string; time: string }[];
      } = metadataJson ? JSON.parse(metadataJson) : {};

      const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

      if (project.length === 0) {
        return c.json({ ok: false, error: 'Not Found', message: `Project '${projectKey}' not found` }, 404);
      }

      const version = await db
        .select()
        .from(versions)
        .where(and(eq(versions.projectId, project[0].id), eq(versions.key, versionKey)))
        .limit(1);

      if (version.length === 0) {
        return c.json(
          { ok: false, error: 'Not Found', message: `Version '${versionKey}' not found for project '${projectKey}'` },
          404,
        );
      }

      let buildNumber = metadata.buildNumber;
      if (!buildNumber) {
        const lastBuild = await db
          .select()
          .from(builds)
          .where(eq(builds.versionId, version[0].id))
          .orderBy(desc(builds.buildNumber))
          .limit(1);

        buildNumber = lastBuild.length > 0 ? lastBuild[0].buildNumber + 1 : 1;
      }

      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      const fileName = file.name;
      const r2Key = `${projectKey}/versions/${versionKey}/${buildNumber}/${fileName}`;

      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBytes);
      const sha256 = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      await c.env.BUCKET.put(r2Key, fileBytes, {
        httpMetadata: { contentType: 'application/java-archive' },
      });

      const channelValue = (metadata.channel?.toUpperCase() || 'STABLE') as 'ALPHA' | 'BETA' | 'STABLE';

      await c.env.BUILD_QUEUE.send({
        versionId: version[0].id,
        buildNumber,
        channel: channelValue,
        r2Key,
        fileName,
        fileSize: fileBytes.length,
        sha256,
        commits: metadata.commits ?? [],
      });

      return c.json(
        {
          message: 'Build received and queued for processing',
          build: {
            id: buildNumber,
            project: projectKey,
            version: versionKey,
            channel: channelValue,
          },
        },
        202,
      );
    } catch (error) {
      console.error('Error uploading build:', error);
      return c.json(
        {
          ok: false,
          error: 'Internal Server Error',
          message: `Failed to upload build: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        500,
      );
    }
  },
);
