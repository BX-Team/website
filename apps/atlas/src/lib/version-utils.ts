/**
 * Parses version string like "1.21.11-rc3" into a structured object
 */
export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  preRelease: 'pre' | 'rc' | null;
  preNumber: number;
}

/**
 * Parses version string into components
 * Supports formats: 1.21, 1.21.11, 1.21.11-pre5, 1.21.11-rc3
 */
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

/**
 * Compares two versions for sorting
 * Returns: negative (a < b), 0 (a === b), positive (a > b)
 *
 * Sort order (from newest to oldest):
 * 1. Release (no suffix) - e.g. 1.21.10
 * 2. RC (release candidate) - e.g. 1.21.11-rc3
 * 3. PRE (preview) - e.g. 1.21.11-pre5
 */
export function compareVersions(a: string, b: string): number {
  const vA = parseVersion(a);
  const vB = parseVersion(b);

  // Compare major.minor.patch
  if (vA.major !== vB.major) return vB.major - vA.major;
  if (vA.minor !== vB.minor) return vB.minor - vA.minor;
  if (vA.patch !== vB.patch) return vB.patch - vA.patch;

  // If base versions are equal, compare pre/rc
  // Release (null) > rc > pre
  if (vA.preRelease === null && vB.preRelease !== null) return -1;
  if (vA.preRelease !== null && vB.preRelease === null) return 1;

  if (vA.preRelease !== vB.preRelease) {
    if (vA.preRelease === 'rc' && vB.preRelease === 'pre') return -1;
    if (vA.preRelease === 'pre' && vB.preRelease === 'rc') return 1;
  }

  // Compare pre/rc numbers (higher number is newer)
  return vB.preNumber - vA.preNumber;
}

/**
 * Sorts array of versions from newest to oldest
 */
export function sortVersions(versions: string[]): string[] {
  return [...versions].sort(compareVersions);
}

/**
 * Groups versions by major.minor and sorts within each group
 */
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
