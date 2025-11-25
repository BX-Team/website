export interface VersionInfo {
  total: number;
  uniqueIps: number;
}

export interface VersionsResponse {
  success: boolean;
  versions: Record<string, VersionInfo>;
}

export interface Build {
  id: number;
  versionId: string;
  projectVersionId: string | null;
  type: string;
  experimental: boolean;
  name: string;
  buildNumber: number;
  jarUrl: string;
  jarSize: number;
  zipUrl: string | null;
  zipSize: number | null;
  installation: Array<
    Array<{
      type: string;
      url: string;
      file: string;
      size: number;
    }>
  >;
  changes: string[];
  created: string;
}

export interface BuildsResponse {
  success: boolean;
  builds: Build[];
}

const MCJARS_API_BASE = 'https://mcjars.app/api/v2';

export async function fetchDivineMCVersions(): Promise<VersionsResponse> {
  const response = await fetch(`${MCJARS_API_BASE}/lookups/versions/DIVINEMC`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch versions: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDivineMCBuilds(version: string): Promise<BuildsResponse> {
  const response = await fetch(`${MCJARS_API_BASE}/builds/DIVINEMC/${version}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch builds: ${response.statusText}`);
  }

  return response.json();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
