'use client';

import { Download, ExternalLink, Calendar, Package } from 'lucide-react';
import { type Build, formatDate, formatFileSize } from '@/lib/mcjars';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BuildCardProps {
  build: Build;
  version: string;
}

export function BuildCard({ build, version }: BuildCardProps) {
  const handleDownload = () => {
    window.open(build.jarUrl, '_blank');
  };

  return (
    <div className='border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all bg-neutral-900/30 backdrop-blur-sm'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-lg font-semibold text-white'>Build {build.name}</h3>
            {build.experimental && (
              <span className='px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded'>
                Experimental
              </span>
            )}
          </div>
          <div className='flex flex-wrap gap-4 text-sm text-neutral-400'>
            <div className='flex items-center gap-1.5'>
              <Calendar className='size-4' />
              <span>{formatDate(build.created)}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Package className='size-4' />
              <span>{formatFileSize(build.jarSize)}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          color='primary'
          size='default'
          className='cursor-pointer bg-white text-neutral-900 hover:bg-neutral-100/90'
        >
          <Download className='size-4 mr-2' />
          Download
        </Button>
      </div>

      {build.changes && build.changes.length > 0 && (
        <div className='mt-4 pt-4 border-t border-neutral-800'>
          <h4 className='text-sm font-medium text-neutral-300 mb-2'>Changes:</h4>
          <ul className='space-y-1'>
            {build.changes.map((change, idx) => (
              <li
                key={idx}
                className="text-sm text-neutral-400 pl-4 relative before:content-['•'] before:absolute before:left-0"
              >
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
