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
    name: 'DivineMC',
    description:
      'Multi-functional fork of Purpur, which focuses on the flexibility of your server and its optimization.',
    downloadUrl:
      '[GitHub](https://github.com/BX-Team/DivineMC/releases);[MCJars](https://mcjars.app/DIVINEMC/versions)',
    docUrl: '/docs/divinemc',
    sourceUrl: 'https://github.com/BX-Team/DivineMC',
  },
  {
    name: 'Quark',
    description:
      'A lightweight, runtime dependency management system for plugins running on Minecraft server platforms. ',
    downloadUrl: '/docs/quark/getting-started/dependencies',
    docUrl: '/docs/quark',
    sourceUrl: 'https://github.com/BX-Team/Quark',
  },
  {
    name: 'NDailyRewards',
    description:
      'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
    downloadUrl: 'https://modrinth.com/plugin/ndailyrewards',
    docUrl: '/docs/ndailyrewards',
    sourceUrl: 'https://github.com/BX-Team/NDailyRewards',
  },
];

function ProjectCard({ name, description, downloadUrl, docUrl, sourceUrl }: Project) {
  const downloadLinks = parseDownloadLinks(downloadUrl);

  return (
    <Card className='flex flex-col h-full p-6 transition-all duration-200 hover:ring-neutral-600/60'>
      <div className='flex-1'>
        <h3 className='font-medium text-neutral-100 text-lg'>{name}</h3>
        <p className='mt-2 text-neutral-400 text-sm'>{description}</p>
      </div>

      <div className='mt-6 space-y-3'>
        {downloadLinks.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button color='secondary' className='w-full'>
                <Download className='mr-2 h-4 w-4' />
                Download
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
          <Button asChild color='secondary' className='w-full'>
            <a
              href={downloadLinks[0].url}
              target='_self'
              rel='noopener noreferrer'
              aria-label={`Download ${name}`}
              className='flex items-center justify-center'
            >
              <Download className='mr-2 h-4 w-4' />
              {downloadLinks[0].label}
            </a>
          </Button>
        )}

        <div className='flex gap-2'>
          <Button asChild color='outline' size='sm' className='flex-1'>
            <a
              href={docUrl}
              target='_self'
              rel='noopener noreferrer'
              aria-label={`Read Documentation for ${name}`}
              className='flex items-center justify-center'
            >
              <BookOpen className='mr-1 h-3 w-3' />
              Docs
            </a>
          </Button>
          <Button asChild color='outline' size='sm' className='flex-1'>
            <a
              href={sourceUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`View Source Code for ${name}`}
              className='flex items-center justify-center'
            >
              <Github className='mr-1 h-3 w-3' />
              Source
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function Projects() {
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'sm:grid-cols-2';
    return 'sm:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className='mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16' id='projects'>
      <header className='max-w-2xl text-left'>
        <h2 className='font-semibold text-3xl text-white'>Our Projects</h2>
        <p className='mt-3 text-lg text-neutral-300'>Explore our projects that are currently in development.</p>
      </header>

      <div className={`mt-10 grid gap-6 ${getGridCols(projects.length)}`}>
        {projects.map(project => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}
