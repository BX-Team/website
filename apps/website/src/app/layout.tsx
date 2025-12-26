import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { siteConfig } from '@/config/site';

import './global.css';
import SnowEffect from '@/components/snow';

const inter = Inter({
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#2a2d30',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['BX Team', 'Minecraft', 'DivineMC', 'Quark', 'NDailyRewards'],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body className='dark flex min-h-screen flex-col'>
        <RootProvider theme={{ enabled: false }}>
          <SnowEffect /> {children}
        </RootProvider>
      </body>
    </html>
  );
}
