'use client';

import { useState, useEffect } from 'react';
import { AtlasBuildCard } from './atlas-build-card';
import { VersionSelector } from './version-selector';
import { Loader2, AlertCircle } from 'lucide-react';
import { type Build, fetchBuilds } from '@/lib/atlas';

interface AtlasBuildsListProps {
  projectId: string;
  projectName: string;
  initialVersions: string[];
}

export function AtlasBuildsList({ projectId, projectName, initialVersions }: AtlasBuildsListProps) {
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
        const buildsData = await fetchBuilds(projectId, selectedVersion);
        // Sort builds by ID descending (newest first)
        setBuilds(buildsData.sort((a, b) => b.id - a.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load builds');
      } finally {
        setLoading(false);
      }
    }

    loadBuilds();
  }, [projectId, selectedVersion]);

  return (
    <div>
      <VersionSelector
        versions={initialVersions}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
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
            <AtlasBuildCard key={build.id} build={build} projectName={projectName} version={selectedVersion} />
          ))}
        </div>
      )}
    </div>
  );
}
