import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openAPIRouteHandler } from 'hono-openapi';
import { v2 } from './routes/v2';
import { getDb } from './db';
import { builds, downloads, commits } from './db/schema';
import type { Env, BuildQueueMessage } from './types';
import { swaggerUI } from '@hono/swagger-ui';
import { rateLimiter } from 'hono-rate-limiter';

const app = new Hono<{ Bindings: Env }>();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
    maxAge: 86400,
  }),
);

app.use(
  rateLimiter<{ Bindings: Env }>({
    binding: (c) => c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  })
);

app.route('/v2', v2);

app.get(
  '/docs',
  swaggerUI({
    url: '/openapi.json',
  }),
);

app.get(
  '/openapi.json',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Atlas API',
        version: '2.0.0',
        description: 'API for retrieving build information for BX Team projects',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    },
  }),
);

export default {
  fetch: app.fetch,

  async queue(batch: MessageBatch<BuildQueueMessage>, env: Env): Promise<void> {
    const db = await getDb(env);

    for (const message of batch.messages) {
      try {
        const {
          versionId,
          buildNumber,
          channel,
          r2Key,
          fileName,
          fileSize,
          sha256,
          commits: buildCommits,
        } = message.body;

        const [build] = await db
          .insert(builds)
          .values({ versionId, buildNumber, channel, time: new Date() })
          .returning();

        await db.insert(downloads).values({
          buildId: build.id,
          name: 'application',
          fileName,
          filePath: r2Key,
          size: fileSize,
          sha256,
        });

        if (buildCommits.length > 0) {
          await db.insert(commits).values(
            buildCommits.map(c => ({
              buildId: build.id,
              sha: c.sha,
              message: c.message,
              time: new Date(c.time),
            })),
          );
        }

        message.ack();
      } catch (error) {
        console.error('Failed to process build upload message:', error);
        message.retry();
      }
    }
  },
} satisfies ExportedHandler<Env, BuildQueueMessage>;
