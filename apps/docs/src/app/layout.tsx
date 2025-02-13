import { DocsLayout } from 'fumadocs-ui/layouts/notebook';

import type { ReactNode } from 'react';

import { Geist, Geist_Mono } from 'next/font/google';

import './global.css';
import {source} from '@/lib/source';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className='dark flex min-h-screen flex-col'>
        <DocsLayout tree={source.pageTree}>{children}</DocsLayout >
      </body>
    </html>
  );
}
