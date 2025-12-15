export interface Project {
  id: string;
  name: string;
  description?: string;
  latestVersion: string;
  experimentalVersion?: string;
}

export interface ProjectWithVersions {
  project: Project;
  version_groups: Record<string, string[]>;
}

export interface JavaVersion {
  version: {
    minimum: number;
  };
}

export interface SupportStatus {
  status: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
}

export interface Version {
  id: string;
  java: JavaVersion;
  support: SupportStatus;
}

export interface VersionWithBuilds {
  version: Version;
  builds: number[];
}

export interface Commit {
  sha: string;
  message: string;
  time: string;
}

export interface Download {
  name: string;
  checksums: {
    sha256: string;
  };
  size: number;
  url: string;
}

export interface Build {
  id: number;
  time: string;
  channel: 'ALPHA' | 'BETA' | 'STABLE';
  commits: Commit[];
  downloads: {
    application: Download;
  };
}

export interface ProjectsResponse {
  projects: ProjectWithVersions[];
}

const ATLAS_API_BASE =
  typeof window !== 'undefined'
    ? '/api/atlas/v2'
    : process.env.NEXT_PUBLIC_ATLAS_API_URL
      ? `${process.env.NEXT_PUBLIC_ATLAS_API_URL}/v2`
      : 'https://api.bxteam.org/v2';

/**
 * Fetch all available projects
 */
export async function fetchProjects(): Promise<ProjectsResponse> {
  const response = await fetch(`${ATLAS_API_BASE}/projects`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch information about a specific project
 */
export async function fetchProject(projectId: string): Promise<ProjectWithVersions> {
  const response = await fetch(`${ATLAS_API_BASE}/projects/${projectId}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all versions for a project
 */
export async function fetchVersions(projectId: string): Promise<VersionWithBuilds[]> {
  const response = await fetch(`${ATLAS_API_BASE}/projects/${projectId}/versions`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch versions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a specific version
 */
export async function fetchVersion(projectId: string, versionId: string): Promise<VersionWithBuilds> {
  const response = await fetch(`${ATLAS_API_BASE}/projects/${projectId}/versions/${versionId}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch version: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all builds for a version
 */
export async function fetchBuilds(
  projectId: string,
  versionId: string,
  channel?: 'ALPHA' | 'BETA' | 'STABLE',
): Promise<Build[]> {
  const url = new URL(
    `${ATLAS_API_BASE}/projects/${projectId}/versions/${versionId}/builds`,
    typeof window !== 'undefined' ? window.location.origin : 'https://bxteam.org',
  );
  if (channel) {
    url.searchParams.set('channel', channel);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch builds: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch the latest build for a version
 */
export async function fetchLatestBuild(projectId: string, versionId: string): Promise<Build> {
  const response = await fetch(`${ATLAS_API_BASE}/projects/${projectId}/versions/${versionId}/builds/latest`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest build: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a specific build
 */
export async function fetchBuild(projectId: string, versionId: string, buildId: number): Promise<Build> {
  const response = await fetch(`${ATLAS_API_BASE}/projects/${projectId}/versions/${versionId}/builds/${buildId}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour (builds don't change)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch build: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format date to human-readable format
 */
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

/**
 * Get channel badge color
 */
export function getChannelColor(channel: 'ALPHA' | 'BETA' | 'STABLE'): string {
  switch (channel) {
    case 'ALPHA':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'BETA':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'STABLE':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
  }
}

/**
 * Get all versions from version groups (flattened and in order)
 */
export function getAllVersions(versionGroups: Record<string, string[]>): string[] {
  return Object.values(versionGroups).flat();
}

/**
 * Get version groups in descending order (1.21, 1.20, 1.19...)
 */
export function getOrderedVersionGroups(versionGroups: Record<string, string[]>): [string, string[]][] {
  return Object.entries(versionGroups).sort((a, b) => {
    const aNum = parseFloat(a[0]);
    const bNum = parseFloat(b[0]);
    return bNum - aNum;
  });
}
