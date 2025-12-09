'use client';

import { useState, useEffect } from 'react';
import { AtlasBuildCard } from './atlas-build-card';
import { VersionSelector } from './version-selector';
import { Loader2, AlertCircle, AlertTriangle, XCircle, FlaskConical } from 'lucide-react';
import { type Build, type VersionWithBuilds, fetchBuilds } from '@/lib/atlas';

interface AtlasBuildsListProps {
  projectId: string;
  projectName: string;
  initialVersions: string[];
  versionsMetadata?: VersionWithBuilds[];
  experimentalVersion?: string;
}

export function AtlasBuildsList({
  projectId,
  projectName,
  initialVersions,
  versionsMetadata,
  experimentalVersion,
}: AtlasBuildsListProps) {
  const [selectedVersion, setSelectedVersion] = useState(initialVersions[0]);
  const [showExperimental, setShowExperimental] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableVersions =
    showExperimental && experimentalVersion ? [experimentalVersion, ...initialVersions] : initialVersions;

  useEffect(() => {
    async function loadBuilds() {
      if (!selectedVersion) return;

      setLoading(true);
      setError(null);

      try {
        const buildsData = await fetchBuilds(projectId, selectedVersion);
        setBuilds(buildsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load builds');
      } finally {
        setLoading(false);
      }
    }

    loadBuilds();
  }, [projectId, selectedVersion]);

  const getVersionStatus = () => {
    const metadata = versionsMetadata?.find(v => v.version.id === selectedVersion);
    return metadata?.version.support.status;
  };

  const versionStatus = getVersionStatus();
  const isExperimentalVersion = selectedVersion === experimentalVersion;

  return (
    <div>
      <VersionSelector
        versions={availableVersions}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        versionsMetadata={versionsMetadata}
        experimentalVersion={experimentalVersion}
        showExperimental={showExperimental}
        onToggleExperimental={checked => {
          setShowExperimental(checked);
          if (!checked && selectedVersion === experimentalVersion) {
            setSelectedVersion(initialVersions[0]);
          }
        }}
      />

      {isExperimentalVersion && (
        <div className='flex items-start gap-3 p-4 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
          <FlaskConical className='size-5 shrink-0 text-blue-400 mt-0.5' />
          <div>
            <h4 className='text-sm font-semibold text-blue-400 mb-1'>Experimental Build</h4>
            <p className='text-sm text-blue-400/90'>
              This is an experimental build and may contain bugs or unstable features. Use at your own risk. Not
              recommended for production servers. Make sure to back up your data before using this version.
            </p>
          </div>
        </div>
      )}

      {versionStatus === 'DEPRECATED' && (
        <div className='flex items-start gap-3 p-4 mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
          <AlertTriangle className='size-5 shrink-0 text-yellow-500 mt-0.5' />
          <div>
            <h4 className='text-sm font-semibold text-yellow-500 mb-1'>Deprecated Version</h4>
            <p className='text-sm text-yellow-500/90'>
              This Minecraft version is deprecated and may not receive future updates. Consider upgrading to a newer
              version.
            </p>
          </div>
        </div>
      )}

      {versionStatus === 'UNSUPPORTED' && (
        <div className='flex items-start gap-3 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
          <XCircle className='size-5 shrink-0 text-red-500 mt-0.5' />
          <div>
            <h4 className='text-sm font-semibold text-red-500 mb-1'>Unsupported Version</h4>
            <p className='text-sm text-red-500/90'>
              This Minecraft version is no longer supported. No further updates or bug fixes will be provided. Please
              upgrade to a supported version.
            </p>
          </div>
        </div>
      )}

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
