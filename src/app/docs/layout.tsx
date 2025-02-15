import type { ReactNode } from 'react';

import { baseOptions } from '@/app/layout.config';
import { DocsLayout } from '@/components/notebook';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions} disableThemeSwitch={true}>
      {children}
    </DocsLayout>
  );
}
