import { Download, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { AtlasBuildsList } from '@/components/downloads/atlas-builds-list';
import {
  fetchProject,
  fetchLatestBuild,
  fetchVersions,
  sortVersions,
  formatFileSize,
  type VersionWithBuilds,
} from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/components/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  let versionsMetadata: VersionWithBuilds[] = [];
  let latestBuild: Awaited<ReturnType<typeof fetchLatestBuild>> | null = null;
  let error: string | null = null;

  try {
    projectData = await fetchProject(projectId);
    versions = sortVersions([...projectData.versions]);

    try {
      versionsMetadata = await fetchVersions(projectId);
    } catch { }

    if (versions.length > 0) {
      try {
        latestBuild = await fetchLatestBuild(projectId, versions[0]);
      } catch { }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load project';
  }

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

      <main className='mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12'>
        <div className='mb-8'>
          <Button asChild color='ghost' size='sm' className='cursor-pointer -ml-2'>
            <Link href='/downloads'>
              <ArrowLeft className='size-4 mr-2' />
              Back to Downloads
            </Link>
          </Button>
        </div>

        <div className='border border-neutral-800 rounded-lg p-8 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 backdrop-blur-sm mb-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='flex-1'>
              <h1 className='font-semibold text-4xl text-white mb-3'>{projectData.project.name}</h1>
              <p className='text-lg text-neutral-300 mb-6'>
                Get the latest builds of {projectData.project.name} for your Minecraft server
              </p>

              {latestBuild && (
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-neutral-800/50 rounded-lg p-4'>
                    <div className='text-xs text-neutral-400 mb-1'>Latest Build</div>
                    <div className='text-xl font-bold text-white'>#{latestBuild.id}</div>
                  </div>
                  <div className='bg-neutral-800/50 rounded-lg p-4'>
                    <div className='text-xs text-neutral-400 mb-1'>Channel</div>
                    <div className='text-xl font-bold text-green-400'>{latestBuild.channel}</div>
                  </div>
                  <div className='bg-neutral-800/50 rounded-lg p-4'>
                    <div className='text-xs text-neutral-400 mb-1'>File Size</div>
                    <div className='text-xl font-bold text-white'>
                      {formatFileSize(latestBuild.downloads.application.size)}
                    </div>
                  </div>
                  <div className='bg-neutral-800/50 rounded-lg p-4'>
                    <div className='text-xs text-neutral-400 mb-1'>Updated</div>
                    <div className='text-lg font-bold text-white'>
                      {new Date(latestBuild.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              )}

              <div className='flex flex-col sm:flex-row gap-3'>
                {latestBuild && (
                  <Button asChild size='lg' className='cursor-pointer bg-white text-neutral-900 hover:bg-neutral-100'>
                    <a href={latestBuild.downloads.application.url} target='_blank' rel='noopener noreferrer'>
                      <Download className='size-5 mr-2' />
                      Download Latest Build
                    </a>
                  </Button>
                )}
                <Button asChild color='secondary' size='lg' className='cursor-pointer'>
                  <Link href={docsUrl}>
                    <BookOpen className='size-5 mr-2' />
                    Documentation
                  </Link>
                </Button>
                <Button asChild color='secondary' size='lg' className='cursor-pointer'>
                  <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
                    <GitHubIcon className='size-5 mr-2' />
                    Source Code
                  </a>
                </Button>
              </div>
            </div>

            <div className='lg:w-80'>
              <div className='bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50'>
                <h3 className='flex items-center gap-2 text-sm font-medium text-neutral-300 mb-4'>
                  <Info className='size-4' />
                  Latest Build Info
                </h3>
                <div className='space-y-4'>
                  {latestBuild ? (
                    <>
                      <div>
                        <div className='text-xs text-neutral-500 mb-2'>Build #{latestBuild.id} Changes</div>
                        <div className='space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800'>
                          {latestBuild.commits.map(commit => (
                            <div key={commit.sha} className='flex items-start gap-2 text-xs'>
                              <span className='text-neutral-600 mt-1 shrink-0'>•</span>
                              <div className='flex-1 min-w-0'>
                                <a
                                  href={`https://github.com/BX-Team/${projectData.project.name}/commit/${commit.sha}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-400 hover:text-blue-300 font-mono text-[10px] transition-colors'
                                >
                                  {commit.sha.substring(0, 7)}
                                </a>
                                <p className='text-neutral-400 mt-0.5 break-words'>{commit.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='text-sm text-neutral-500 text-center py-8'>No build information available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className='text-2xl font-semibold text-white mb-6'>All Builds</h2>
          {versions.length > 0 ? (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <AtlasBuildsList
                projectId={projectId}
                projectName={projectData.project.name}
                initialVersions={versions}
                versionsMetadata={versionsMetadata}
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
