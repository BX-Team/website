'use client';

import { ArrowRight } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/gradient-background';

export function Hero() {
  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('projects')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <section className='relative isolate'>
      <GradientBackground />

      <div className='mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>Welcome to BX Team</h1>

          <p className='mt-6 text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8'>
            BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft
            server software. We aim to provide a stable and optimized experience for both server owners and players.
          </p>

          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row'>
            <Button asChild className='w-full sm:w-auto'>
              <Link href='/docs'>Documentation</Link>
            </Button>
            <Button asChild color='ghost' className='w-full sm:w-auto'>
              <a
                href='/team'
                onClick={scrollToProjects}
                target='_self'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2'
              >
                Our projects
                <ArrowRight className='ml-2 h-4 w-4' aria-hidden='true' />
              </a>
            </Button>
          </div>
        </div>

        <div className='mt-16 sm:mt-20'>
          <div className='relative overflow-hidden rounded-xl bg-neutral-800/50 p-2 ring-1 shadow-2xl shadow-neutral-900/50 ring-neutral-700/50 backdrop-blur-sm'>
            <figure className='relative aspect-video'>
              <Image
                src='/banner.png'
                alt='Beautiful Minecraft landscape'
                fill
                className='rounded-lg object-cover'
                priority
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
