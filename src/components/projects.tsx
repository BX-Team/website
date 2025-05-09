import { BookOpen, Download, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Project = {
  name: string;
  description: string;
  downloadUrl: string;
  docUrl: string;
  sourceUrl: string;
};

function parseDownloadLinks(downloadUrl: string) {
  const parts = downloadUrl.split(';').map(str => str.trim());
  const regex = /\[([^\]]+)]\(([^)]+)\)/;
  return parts.map(part => {
    const match = part.match(regex);
    if (match) {
      return { label: match[1], url: match[2] };
    } else {
      return { label: 'Download', url: part };
    }
  });
}

const projects: Project[] = [
  {
    name: 'Nexus',
    description: 'Powerful plugin that gives you ability to personalize your Minecraft server with useful features.',
    downloadUrl: 'https://modrinth.com/plugin/nexuss',
    docUrl: '/docs/nexus',
    sourceUrl: 'https://github.com/BX-Team/Nexus',
  },
  {
    name: 'NDailyRewards',
    description:
      'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
    downloadUrl: 'https://modrinth.com/plugin/ndailyrewards',
    docUrl: '/docs/ndailyrewards',
    sourceUrl: 'https://github.com/BX-Team/NDailyRewards',
  },
  {
    name: 'DivineMC',
    description:
      'A high-performance Purpur fork focused on maximizing server performance while maintaining plugin compatibility.',
    downloadUrl:
      '[GitHub](https://github.com/BX-Team/DivineMC/releases);[MCJars](https://mcjars.app/DIVINEMC/versions)',
    docUrl: '/docs/divinemc',
    sourceUrl: 'https://github.com/BX-Team/DivineMC',
  },
];

function ProjectCard({ name, description, downloadUrl, docUrl, sourceUrl }: Project) {
  const downloadLinks = parseDownloadLinks(downloadUrl);

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
        {downloadLinks.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button color='primary' size='sm'>
                <Download className='mr-1 h-4 w-4' />
                <span>Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {downloadLinks.map((link, index) => (
                <DropdownMenuItem key={index}>
                  <a
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`Download ${link.label} for ${name}`}
                    className='flex items-center'
                  >
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild color='primary' size='sm'>
            <a
              href={downloadLinks[0].url}
              target='_self'
              rel='noopener noreferrer'
              aria-label={`Download ${name}`}
              className='flex items-center'
            >
              <Download className='mr-1 h-4 w-4' />
              <span>{downloadLinks[0].label}</span>
            </a>
          </Button>
        )}

        <Button asChild color='secondary' size='sm'>
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
        <Button asChild color='secondary' size='sm'>
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
          <p className='mt-4 text-neutral-300 sm:text-lg'>Explore our projects that are currently in development.</p>
        </header>

        <section className='mt-12'>
          <div className='space-y-8'>
            {projects.map(project => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
