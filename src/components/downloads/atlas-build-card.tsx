'use client';

import { Download, Calendar, Package, GitCommit, ExternalLink } from 'lucide-react';
import { type Build, formatDate, formatFileSize, getChannelColor } from '@/lib/atlas';
import { Button } from '@/components/ui/button';

interface AtlasBuildCardProps {
  build: Build;
  projectName: string;
  version: string;
}

export function AtlasBuildCard({ build, projectName, version }: AtlasBuildCardProps) {
  const handleDownload = () => {
    window.open(build.downloads.application.url, '_blank');
  };

  return (
    <div className='border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all bg-neutral-900/30 backdrop-blur-sm'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-lg font-semibold text-white'>Build #{build.id}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium border rounded ${getChannelColor(build.channel)}`}>
              {build.channel}
            </span>
          </div>
          <div className='flex flex-wrap gap-4 text-sm text-neutral-400'>
            <div className='flex items-center gap-1.5'>
              <Calendar className='size-4' />
              <span>{formatDate(build.time)}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Package className='size-4' />
              <span>{formatFileSize(build.downloads.application.size)}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          color='primary'
          size='default'
          className='cursor-pointer bg-white text-neutral-900 hover:bg-neutral-100/90'
        >
          <Download className='size-4' />
          <span className='ml-2'>Download</span>
        </Button>
      </div>

      {build.commits && build.commits.length > 0 && (
        <div className='mt-4 pt-4 border-t border-neutral-800'>
          <h4 className='text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2'>
            <GitCommit className='size-4' />
            Commits:
          </h4>
          <ul className='space-y-2'>
            {build.commits.map(commit => (
              <li key={commit.sha} className='text-sm text-neutral-400 pl-4 relative'>
                <span className='absolute left-0 top-2 w-1.5 h-1.5 bg-neutral-600 rounded-full' />
                <div className='flex items-start gap-2'>
                  <a
                    href={`https://github.com/BX-Team/${projectName}/commit/${commit.sha}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-xs bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors'
                  >
                    <code>{commit.sha.substring(0, 7)}</code>
                    <ExternalLink className='size-3' />
                  </a>
                  <span>{commit.message}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='mt-4 pt-4 border-t border-neutral-800'>
        <div className='text-xs text-neutral-500 space-y-1'>
          <div className='flex items-center justify-between'>
            <span>File:</span>
            <code className='text-neutral-400'>{build.downloads.application.name}</code>
          </div>
          <div className='flex items-center justify-between'>
            <span>SHA-256:</span>
            <code className='text-neutral-400 font-mono break-all'>
              {build.downloads.application.checksums.sha256.substring(0, 16)}...
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
