'use client';

import { useState, useEffect } from 'react';
import { BuildCard } from './build-card';
import { VersionSelector } from './version-selector';
import { Loader2, AlertCircle } from 'lucide-react';
import { type Build, type VersionInfo, fetchDivineMCBuilds } from '@/lib/mcjars';

interface BuildsListProps {
  initialVersions: string[];
  versionInfo: Record<string, VersionInfo>;
}

export function BuildsList({ initialVersions, versionInfo }: BuildsListProps) {
  const [selectedVersion, setSelectedVersion] = useState(initialVersions[0]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBuilds() {
      if (!selectedVersion) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchDivineMCBuilds(selectedVersion);
        if (response.success) {
          setBuilds(response.builds);
        } else {
          setError('Failed to load builds');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load builds');
      } finally {
        setLoading(false);
      }
    }

    loadBuilds();
  }, [selectedVersion]);

  return (
    <div>
      <VersionSelector
        versions={initialVersions}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        downloadCounts={versionInfo}
      />

      {loading && (
        <div className='flex items-center justify-center py-24'>
          <div className='flex flex-col items-center gap-3'>
            <Loader2 className='size-8 animate-spin text-neutral-400' />
            <p className='text-neutral-400'>Loading builds...</p>
          </div>
        </div>
      )}

      {error && (
        <div className='flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400'>
          <AlertCircle className='size-5 shrink-0' />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && builds.length === 0 && (
        <div className='flex items-center justify-center py-24'>
          <p className='text-neutral-400'>No builds available for this version.</p>
        </div>
      )}

      {!loading && !error && builds.length > 0 && (
        <div className='space-y-4'>
          {builds.map(build => (
            <BuildCard key={build.id} build={build} version={selectedVersion} />
          ))}
        </div>
      )}
    </div>
  );
}
