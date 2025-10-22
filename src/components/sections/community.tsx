'use client';

import { Github, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

const COMMUNITIES = [
  {
    title: 'Discord',
    description: 'Join our Discord community to get support, share your experiences, and connect with other users.',
    icon: MessageCircle,
    buttonText: 'Join Discord',
    href: siteConfig.links.discord,
  },
  {
    title: 'GitHub',
    description: 'Contribute to BX Team, report issues, and explore our open source codebase on GitHub.',
    icon: Github,
    buttonText: 'View GitHub',
    href: siteConfig.links.github,
  },
] as const;

export function Community() {
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'sm:grid-cols-2';
    return 'sm:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28'>
      <header className='max-w-2xl'>
        <h2 className='font-semibold text-3xl text-white'>Join our community</h2>
        <p className='mt-3 text-lg text-neutral-300'>
          Connect with our community, contribute to development, and stay up to date.
        </p>
      </header>

      <div className={`mt-10 grid gap-6 ${getGridCols(COMMUNITIES.length)}`}>
        {COMMUNITIES.map(({ title, description, icon: Icon, buttonText, href }) => (
          <Card key={title} className='flex flex-col h-full p-6 transition-all duration-200 hover:ring-neutral-600/60'>
            <div className='flex gap-4 flex-1'>
              <div className='shrink-0'>
                <div className='rounded-lg bg-neutral-700/50 p-2.5'>
                  <Icon className='size-5 text-neutral-100' />
                </div>
              </div>
              <div>
                <h3 className='font-medium text-neutral-100'>{title}</h3>
                <p className='mt-1.5 text-neutral-400 text-sm'>{description}</p>
              </div>
            </div>
            <div className='mt-6 border-neutral-800 border-t pt-4'>
              <Button asChild color='secondary' className='w-full'>
                <a href={href} target='_blank' rel='noopener noreferrer'>
                  {buttonText}
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
