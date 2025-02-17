import type { ReactNode } from 'react';

import Image from 'next/image';

import { baseOptions } from '@/app/layout.config';
import { DocsLayout } from '@/components/notebook';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      disableThemeSwitch={true}
      nav={{
        title: (
          <div className='flex items-center gap-2'>
            <Image src='/logo.png' alt='BX Team Logo' width={22} height={22} />
            <span>BX Team Documentation</span>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
