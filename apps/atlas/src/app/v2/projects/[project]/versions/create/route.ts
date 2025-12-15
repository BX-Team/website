import { db } from '@/db';
import { projects, versions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api-response';
import { verifyApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface CreateVersionRequest {
  key: string;
  supportStatus?: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
  javaMinVersion?: number;
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ project: string }>;
  },
) {
  try {
    if (!verifyApiKey(request)) {
      return errorResponse('Unauthorized', 401);
    }

    const { project: projectKey } = await params;
    const body: CreateVersionRequest = await request.json();

    if (!body.key) {
      return errorResponse('Version key is required', 400);
    }

    const project = await db.select().from(projects).where(eq(projects.key, projectKey)).limit(1);

    if (project.length === 0) {
      return errorResponse(`Project '${projectKey}' not found`, 404);
    }

    const existingVersion = await db
      .select()
      .from(versions)
      .where(and(eq(versions.projectId, project[0].id), eq(versions.key, body.key)))
      .limit(1);

    if (existingVersion.length > 0) {
      return errorResponse(`Version '${body.key}' already exists for project '${projectKey}'`, 409);
    }

    const [version] = await db
      .insert(versions)
      .values({
        projectId: project[0].id,
        key: body.key,
        supportStatus: (body.supportStatus?.toUpperCase() || 'SUPPORTED') as 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED',
        javaMinVersion: body.javaMinVersion || null,
      })
      .returning();

    return successResponse({
      message: 'Version created successfully',
      version: {
        id: version.id,
        project: projectKey,
        key: version.key,
        supportStatus: version.supportStatus,
        javaMinVersion: version.javaMinVersion,
      },
    });
  } catch (error) {
    console.error('Error creating version:', error);
    return errorResponse(`Failed to create version: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
