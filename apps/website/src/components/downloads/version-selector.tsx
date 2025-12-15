'use client';

import { useState } from 'react';
import { ChevronDown, Check, AlertTriangle, XCircle, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';
import type { VersionWithBuilds } from '@/lib/atlas';

interface VersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  versionsMetadata?: VersionWithBuilds[];
  experimentalVersion?: string;
  showExperimental?: boolean;
  onToggleExperimental?: (checked: boolean) => void;
}

export function VersionSelector({
  versions,
  selectedVersion,
  onVersionChange,
  versionsMetadata,
  experimentalVersion,
  showExperimental,
  onToggleExperimental,
}: VersionSelectorProps) {
  const [open, setOpen] = useState(false);

  const getVersionStatus = (version: string) => {
    const metadata = versionsMetadata?.find(v => v.version.id === version);
    return metadata?.version.support.status;
  };

  const getStatusIcon = (status?: string) => {
    if (status === 'DEPRECATED') {
      return <AlertTriangle className='size-3.5 text-yellow-500' />;
    }
    if (status === 'UNSUPPORTED') {
      return <XCircle className='size-3.5 text-red-500' />;
    }
    return null;
  };

  const getStatusText = (status?: string) => {
    if (status === 'DEPRECATED') return 'Deprecated';
    if (status === 'UNSUPPORTED') return 'Unsupported';
    return null;
  };

  const selectedStatus = getVersionStatus(selectedVersion);
  const isExperimental = selectedVersion === experimentalVersion;

  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between mb-2'>
        <label className='text-sm font-medium text-neutral-300'>Minecraft Version</label>
        {experimentalVersion && onToggleExperimental && (
          <button
            onClick={() => onToggleExperimental(!showExperimental)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              showExperimental
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/15',
            )}
          >
            <FlaskConical className='size-4' />
            <span>Toggle Experimental Builds</span>
          </button>
        )}
      </div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full sm:w-80 flex items-center justify-between px-4 py-2.5 rounded-md',
              'bg-neutral-900 border border-neutral-800 text-white',
              'hover:border-neutral-700 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-neutral-600',
            )}
          >
            <div className='flex items-center gap-2'>
              <span className='font-medium'>{selectedVersion}</span>
              {isExperimental && (
                <span className='px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1'>
                  <FlaskConical className='size-3' />
                  Experimental
                </span>
              )}
              {!isExperimental && selectedStatus && selectedStatus !== 'SUPPORTED' && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded',
                    selectedStatus === 'DEPRECATED' && 'bg-yellow-500/10 text-yellow-500',
                    selectedStatus === 'UNSUPPORTED' && 'bg-red-500/10 text-red-500',
                  )}
                >
                  {getStatusText(selectedStatus)}
                </span>
              )}
            </div>
            <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='w-80 max-h-80 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-md shadow-lg z-50'
            sideOffset={5}
            align='start'
          >
            <div className='p-1'>
              {versions.map(version => {
                const status = getVersionStatus(version);
                const isExp = version === experimentalVersion;
                return (
                  <button
                    key={version}
                    onClick={() => {
                      onVersionChange(version);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors',
                      version === selectedVersion
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white',
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>{version}</span>
                      {isExp && (
                        <span className='flex items-center gap-1 px-1.5 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                          <FlaskConical className='size-3' />
                          Experimental
                        </span>
                      )}
                      {!isExp && status && status !== 'SUPPORTED' && (
                        <span
                          className={cn(
                            'flex items-center gap-1 px-1.5 py-0.5 text-xs rounded',
                            status === 'DEPRECATED' && 'bg-yellow-500/10 text-yellow-500',
                            status === 'UNSUPPORTED' && 'bg-red-500/10 text-red-500',
                          )}
                        >
                          {getStatusIcon(status)}
                          {getStatusText(status)}
                        </span>
                      )}
                    </div>
                    {version === selectedVersion && <Check className='size-4' />}
                  </button>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
