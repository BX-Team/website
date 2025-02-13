import { DocsLayout } from 'fumadocs-ui/layouts/notebook';

import type { ReactNode } from 'react';

import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout disableThemeSwitch={!false} sidebar={{ defaultOpenLevel: 0 }} tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
