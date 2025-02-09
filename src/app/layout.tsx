import { Metadata, Viewport } from 'next';

import { Geist } from 'next/font/google';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';

import './globals.css';
import { siteConfig } from '@/config/site';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#556ABE',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['BX Team', 'Minecraft', 'DivineMC', 'NDailyRewards', 'Nexus'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body
        className={cn(
          geist.variable,
          'antialiased',
          'bg-background text-foreground font-sans',
          'min-h-screen supports-[height:100dvh]:min-h-dvh',
          'selection:bg-neutral-700/50 selection:text-neutral-100',
        )}
      >
        <Navbar />
        <main role='main' className='mt-15'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
