import { successResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

interface ApiRoute {
  path: string;
  method: string;
  description: string;
  parameters?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export async function GET() {
  const routes: ApiRoute[] = [
    {
      path: '/v2/projects',
      method: 'GET',
      description: 'Get all projects with their version groups',
    },
    {
      path: '/v2/projects/:project',
      method: 'GET',
      description: 'Get detailed information about a specific project',
      parameters: {
        project: 'Project identifier (e.g., divinemc)',
      },
    },
    {
      path: '/v2/projects/:project/versions',
      method: 'GET',
      description: 'Get all versions for a specific project',
      parameters: {
        project: 'Project identifier',
      },
    },
    {
      path: '/v2/projects/:project/versions/:version',
      method: 'GET',
      description: 'Get detailed information about a specific version',
      parameters: {
        project: 'Project identifier',
        version: 'Version identifier (e.g., 1.21.4)',
      },
    },
    {
      path: '/v2/projects/:project/versions/:version/builds',
      method: 'GET',
      description: 'Get all builds for a specific version',
      parameters: {
        project: 'Project identifier',
        version: 'Version identifier',
      },
      queryParams: {
        channel: 'Filter by channel (ALPHA, BETA, STABLE)',
      },
    },
    {
      path: '/v2/projects/:project/versions/:version/builds/latest',
      method: 'GET',
      description: 'Get the latest build for a specific version',
      parameters: {
        project: 'Project identifier',
        version: 'Version identifier',
      },
    },
    {
      path: '/v2/projects/:project/versions/:version/builds/:build',
      method: 'GET',
      description: 'Get detailed information about a specific build',
      parameters: {
        project: 'Project identifier',
        version: 'Version identifier',
        build: 'Build number',
      },
    },
  ];

  return successResponse({
    name: 'Atlas API',
    version: '2.0',
    description: 'API for retrieving build information for BX Team projects',
    routes,
  });
}
