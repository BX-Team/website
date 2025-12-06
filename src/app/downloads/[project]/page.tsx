import { Download } from 'lucide-react';
import { AtlasBuildsList } from '@/components/downloads/atlas-builds-list';
import { fetchProject, sortVersions } from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    project: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { project } = await params;

  try {
    const projectData = await fetchProject(project);
    return {
      title: `${projectData.project.name} Downloads`,
      description: `Download the latest ${projectData.project.name} builds`,
    };
  } catch {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found',
    };
  }
}

export default async function ProjectDownloadsPage({ params }: ProjectPageProps) {
  const { project: projectId } = await params;

  let projectData: Awaited<ReturnType<typeof fetchProject>> | null = null;
  let versions: string[] = [];
  let error: string | null = null;

  try {
    projectData = await fetchProject(projectId);
    versions = sortVersions([...projectData.versions]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load project';
  }

  // If project not found, show 404
  if (error || !projectData) {
    notFound();
  }

  const githubUrl = `https://github.com/BX-Team/${projectData.project.name}`;
  const docsUrl = `/docs/${projectId}`;

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]' />
      </div>

      <main className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12'>
        <header className='max-w-2xl text-center mx-auto mb-12'>
          <h1 className='font-semibold text-4xl text-white mb-3'>{projectData.project.name} Downloads</h1>
          <p className='text-lg text-neutral-300'>
            Get the latest builds of {projectData.project.name} for your Minecraft server
          </p>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row justify-center'>
            <Button asChild color='primary' size='lg' className='cursor-pointer'>
              <a href={docsUrl}>Documentation</a>
            </Button>
            <Button asChild color='secondary' size='lg' className='cursor-pointer'>
              <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
                <GitHubIcon className='size-5 mr-2' />
                Source Code
              </a>
            </Button>
          </div>
        </header>

        <section className='mt-12 sm:mt-16'>
          {versions.length > 0 ? (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <AtlasBuildsList
                projectId={projectId}
                projectName={projectData.project.name}
                initialVersions={versions}
              />
            </div>
          ) : (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <Download className='size-12 text-neutral-400 mb-4' />
                <h3 className='text-xl font-semibold text-neutral-100 mb-2'>No Versions Available</h3>
                <p className='text-neutral-400 max-w-md mx-auto'>
                  There are currently no {projectData.project.name} builds available.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
