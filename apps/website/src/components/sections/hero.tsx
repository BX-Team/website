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
      block: 'start',
    });
  };

  return (
    <section className='relative isolate min-h-screen'>
      <GradientBackground />

      <div className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32'>
        <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-16'>
          <div className='text-center lg:text-left'>
            <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl'>
              Welcome to <p>BX Team</p>
            </h1>

            <p className='mt-6 text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9'>
              BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft
              server software. We aim to provide a stable and optimized experience for both server owners and players.
            </p>

            <div className='mt-8 flex flex-col items-center lg:items-start justify-center lg:justify-start gap-4 sm:mt-10 sm:flex-row'>
              <Button asChild className='w-full sm:w-auto px-6 py-2'>
                <Link href='/docs'>Documentation</Link>
              </Button>
              <Button asChild color='ghost' className='w-full sm:w-auto px-6 py-2'>
                <a
                  href='#projects'
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

          <div className='hidden lg:flex justify-end'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110'></div>
              <div className='relative w-80 h-80 xl:w-96 xl:h-96'>
                <Image src='/logo.png' alt='BX Team Logo' fill className='object-contain drop-shadow-2xl' priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
