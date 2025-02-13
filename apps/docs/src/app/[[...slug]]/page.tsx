import { getGithubLastEdit } from 'fumadocs-core/server';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import WorkInProgress from '@/components/wip';
import { source } from '@/lib/source';

import { baseOptions } from '../layout.config';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const lastUpdated = await getGithubLastEdit({
    owner: 'BX-Team',
    repo: 'website',
    path: `apps/docs/content/${page.data._file.path}`,
  });

  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        editOnGithub={{
          owner: 'BX-Team',
          repo: 'website',
          sha: 'master',
          path: `apps/docs/content/${page.data._file.path}`,
        }}
        lastUpdate={lastUpdated ? new Date(lastUpdated) : undefined}
        tableOfContent={{
          single: false,
          style: 'clerk',
        }}
      >
        <div className='text-fd-muted-foreground flex items-center gap-1.5 text-sm'>
          {params.slug ? (
            <>
              Docs
              {params.slug.map((segment, index) => (
                <span key={segment} className='flex items-center gap-1.5'>
                  <span>/</span>
                  <span className={index === (params.slug?.length ?? 0) - 1 ? 'text-fd-foreground' : ''}>
                    {segment
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </span>
                </span>
              ))}
            </>
          ) : (
            <span>Docs</span>
          )}
        </div>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className='mb-0'>{page.data.description}</DocsDescription>
        <div className='mb-6 flex flex-col gap-2'>
          {page.data.authors && (
            <p className='flex items-center gap-2'>
              <span className='text-fd-muted-foreground'>Authors:</span>
              {page.data.authors.map((author) => (
                <Link
                  key={author}
                  href={`https://github.com/${author}`}
                  className='decoration-fd-muted-foreground underline-offset-3 hover:decoration-fd-foreground flex items-center gap-1.5 font-medium underline transition-colors duration-200'
                >
                  <Image
                    src={`https://github.com/${author}.png`}
                    alt={`${author}'s avatar`}
                    width={20}
                    height={20}
                    className='h-5 w-5 rounded-full'
                  />
                  {author}
                </Link>
              ))}
            </p>
          )}
          <p className='flex items-center gap-2'>
            <span className='text-fd-muted-foreground'>Reading time:</span>
            <span>
              {Math.ceil(
                page.data.structuredData.contents.reduce((acc, curr) => acc + curr.content.split(/\s+/).length, 0) /
                  200,
              )}{' '}
              min read
            </span>
          </p>
        </div>
        <DocsBody>
          <hr />
          <MDX components={{ ...defaultMdxComponents, WorkInProgress }} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
