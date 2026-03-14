export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  preRelease: 'pre' | 'rc' | null;
  preNumber: number;
}

export function parseVersion(version: string): ParsedVersion {
  const match = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?(?:-(pre|rc)(\d+))?$/);

  if (!match) {
    return { major: 0, minor: 0, patch: 0, preRelease: null, preNumber: 0 };
  }

  const major = parseInt(match[1]) || 0;
  const minor = parseInt(match[2]) || 0;
  const patch = parseInt(match[3]) || 0;
  const preRelease = (match[4] as 'pre' | 'rc') || null;
  const preNumber = parseInt(match[5]) || 0;

  return { major, minor, patch, preRelease, preNumber };
}

export function compareVersions(a: string, b: string): number {
  const vA = parseVersion(a);
  const vB = parseVersion(b);

  if (vA.major !== vB.major) return vB.major - vA.major;
  if (vA.minor !== vB.minor) return vB.minor - vA.minor;
  if (vA.patch !== vB.patch) return vB.patch - vA.patch;

  if (vA.preRelease === null && vB.preRelease !== null) return -1;
  if (vA.preRelease !== null && vB.preRelease === null) return 1;

  if (vA.preRelease !== vB.preRelease) {
    if (vA.preRelease === 'rc' && vB.preRelease === 'pre') return -1;
    if (vA.preRelease === 'pre' && vB.preRelease === 'rc') return 1;
  }

  return vB.preNumber - vA.preNumber;
}

export function sortVersions(versions: string[]): string[] {
  return [...versions].sort(compareVersions);
}

export function groupVersions(versions: string[]): Record<string, string[]> {
  const sorted = sortVersions(versions);
  const groups: Record<string, string[]> = {};

  sorted.forEach(version => {
    const majorMinor = version.split('.').slice(0, 2).join('.');
    if (!groups[majorMinor]) {
      groups[majorMinor] = [];
    }
    groups[majorMinor].push(version);
  });

  return groups;
}
