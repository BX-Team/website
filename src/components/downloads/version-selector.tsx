'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';

interface VersionSelectorProps {
  versions: string[];
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  downloadCounts?: Record<string, { total: number; uniqueIps: number }>;
}

export function VersionSelector({ versions, selectedVersion, onVersionChange, downloadCounts }: VersionSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='mb-6'>
      <label className='block text-sm font-medium text-neutral-300 mb-2'>Minecraft Version</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full sm:w-64 flex items-center justify-between px-4 py-2.5 rounded-md',
              'bg-neutral-900 border border-neutral-800 text-white',
              'hover:border-neutral-700 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-neutral-600',
            )}
          >
            <span className='font-medium'>{selectedVersion}</span>
            <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='w-64 max-h-80 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-md shadow-lg z-50'
            sideOffset={5}
            align='start'
          >
            <div className='p-1'>
              {versions.map(version => (
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
                  <span className='font-medium'>{version}</span>
                  {version === selectedVersion && <Check className='size-4' />}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
