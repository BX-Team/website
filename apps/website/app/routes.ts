import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('docs/*', 'routes/docs.tsx'),
  route('api/search', 'routes/search.ts'),
  route('downloads', 'routes/downloads.tsx'),
  route('downloads/:project', 'routes/downloads.$project.tsx'),
  route('team', 'routes/team.tsx'),
  route('resources', 'routes/resources.tsx'),
  route('resources/flags', 'routes/resources.flags.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
