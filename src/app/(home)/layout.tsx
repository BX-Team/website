import type { ReactNode } from 'react';
import React from 'react';

import { baseOptions } from '@/app/layout.config';
import { HomeLayout } from '@/components/layouts/home';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions} themeSwitch={{ enabled: false }}>
      {children}
    </HomeLayout>
  );
}
