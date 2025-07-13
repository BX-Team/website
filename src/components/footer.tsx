'use client';

import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { DiscordIcon, GitHubIcon } from './icons';
interface LinkItem {
  href: string;
  label: string;
}

interface SocialItem {
  href: string;
  Icon: React.ComponentType<{ className: string }>;
  label: string;
}

interface LinkColumnProps {
  title: string;
  links: LinkItem[];
}

const LINK_SECTIONS: { title: string; links: LinkItem[] }[] = [
  {
    title: 'BX Team',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/team', label: 'Our team' },
      { href: 'https://status.bxteam.org', label: 'Status' },
      { href: 'https://repo.bxteam.org', label: 'Maven Repo' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/resources/flags', label: 'Flags Generator' },
    ],
  },
  {
    title: 'Community',
    links: [{ href: siteConfig.links.discord, label: 'Discord' }],
  },
];

const SOCIALS: SocialItem[] = [
  {
    href: siteConfig.links.github,
    label: 'GitHub',
    Icon: ({ className }: { className: string }) => <GitHubIcon className={className} />,
  },
  {
    href: siteConfig.links.discord,
    label: 'Discord',
    Icon: ({ className }: { className: string }) => <DiscordIcon className={className} />,
  },
];

function LinkColumn({ title, links }: LinkColumnProps) {
  return (
    <section className='space-y-3'>
      <h3 className='text-sm font-medium'>{title}</h3>
      <ul role='list' className='space-y-1.5'>
        {links.map(({ href, label }) => {
          const isExternal = href.startsWith('http');
          return (
            <li key={href} role='listitem'>
              {isExternal ? (
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-neutral-400 transition-colors duration-200 hover:text-white'
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className='text-sm text-neutral-400 transition-colors duration-200 hover:text-white'>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-background/50 border-t border-neutral-800/80 backdrop-blur-xl'>
      <div className='container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
        <div className='grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5'>
          <section className='text-left lg:col-span-2'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 rounded-xl transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none'
            >
              <Image src='/logo.png' alt='' width={28} height={28} className='rounded-xl' />
              <div>
                <h2 className='text-base font-semibold'>BX Team</h2>
              </div>
            </Link>

            <p className='mt-1 text-sm text-neutral-400'>
              BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft
              server software. We aim to provide a stable and optimized experience for both server owners and players.
            </p>

            <div className='mt-6 flex gap-4'>
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${label} (opens in new tab)`}
                  className='text-neutral-300 transition-colors hover:text-neutral-100'
                >
                  <Icon className='h-4.5 w-4.5' />
                </a>
              ))}
            </div>
          </section>

          <div className='grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3'>
            {LINK_SECTIONS.map(section => (
              <LinkColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        <div className='mt-8 flex flex-col items-start justify-between gap-4 border-t border-neutral-800/80 pt-8 text-sm sm:flex-row sm:items-center'>
          <p className='text-neutral-400'>
            &copy; {currentYear} BX Team. Not affiliated with Mojang Studios or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
