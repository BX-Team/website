import { BookOpen, Download, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Project = {
  name: string;
  description: string;
  downloadUrl: string;
  docUrl: string;
  sourceUrl: string;
};

const projects: Project[] = [
  {
    name: 'NDailyRewards',
    description:
      'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
    downloadUrl: 'https://modrinth.com/plugin/ndailyrewards',
    docUrl: 'https://docs.bx-team.space/documentation/ndailyrewards/about',
    sourceUrl: 'https://github.com/BX-Team/NDailyRewards',
  },
  {
    name: 'Nexus',
    description: 'Powerful plugin that gives you ability to personalize your Minecraft server with useful features.',
    downloadUrl: 'https://modrinth.com/plugin/nexuss',
    docUrl: 'https://docs.bx-team.space/documentation/nexus/about',
    sourceUrl: 'https://github.com/BX-Team/Nexus',
  },
  {
    name: 'DivineMC',
    description: 'Fork of Purpur compatible with Spigot plugins, offering the best performance for your server.',
    downloadUrl: '/downloads/divinemc',
    docUrl: 'https://docs.bx-team.space/documentation/divinemc/about',
    sourceUrl: 'https://github.com/DivineMC/DivineMC',
  },
];

function ProjectCard({ name, description, downloadUrl, docUrl, sourceUrl }: Project) {
  return (
    <Card
      className='flex flex-col items-start justify-between p-8 transition-all hover:bg-neutral-800/50 hover:ring-1 hover:ring-neutral-700 md:flex-row md:items-center'
      id='projects'
    >
      <div className='flex-1'>
        <h3 className='text-3xl font-bold sm:text-2xl lg:text-3xl'>{name}</h3>
        <p className='mt-4 text-base text-neutral-300'>{description}</p>
      </div>
      <div className='mt-6 flex flex-wrap gap-3 md:mt-0 md:ml-6'>
        <Button asChild variant='default' size='sm'>
          <a
            href={downloadUrl}
            target='_self'
            rel='noopener noreferrer'
            aria-label={`Download ${name}`}
            className='flex items-center'
          >
            <Download className='mr-1 h-4 w-4' />
            <span>Download</span>
          </a>
        </Button>
        <Button asChild variant='secondary' size='sm'>
          <a
            href={docUrl}
            target='_self'
            rel='noopener noreferrer'
            aria-label={`Read Documentation for ${name}`}
            className='flex items-center'
          >
            <BookOpen className='mr-1 h-4 w-4' />
            <span>Read Documentation</span>
          </a>
        </Button>
        <Button asChild variant='secondary' size='sm'>
          <a
            href={sourceUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`View Source Code for ${name}`}
            className='flex items-center'
          >
            <Github className='mr-1 h-4 w-4' />
            <span>Source Code</span>
          </a>
        </Button>
      </div>
    </Card>
  );
}

export function Projects() {
  return (
    <div className='relative min-h-screen'>
      <div className='mx-auto max-w-7xl px-6 py-16 pb-32 sm:px-8 sm:py-20 sm:pb-40 lg:px-12'>
        <header className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>Our Projects</h1>
          <p className='mt-4 text-neutral-300 sm:text-lg'>Here are some of the projects we're working on.</p>
        </header>

        <section className='mt-12'>
          <div className='space-y-8'>
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
