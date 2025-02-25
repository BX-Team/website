import { getGithubLastEdit } from 'fumadocs-core/server';
import { Callout } from 'fumadocs-ui/components/callout';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';

import { notFound } from 'next/navigation';

import WorkInProgress from '@/components/wip';
import { source } from '@/lib/source';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const lastUpdated = await getGithubLastEdit({
    owner: 'BX-Team',
    repo: 'website',
    path: `content/docs/${page.data._file.path}`,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      editOnGithub={{
        owner: 'BX-Team',
        repo: 'website',
        sha: 'master',
        path: `content/docs/${page.data._file.path}`,
      }}
      lastUpdate={lastUpdated ? new Date(lastUpdated) : undefined}
      tableOfContent={{
        single: false,
        style: 'clerk',
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className='mb-0'>{page.data.description}</DocsDescription>
      <DocsBody>
        <hr />
        <MDX
          components={{
            ...defaultMdxComponents,
            WorkInProgress,
            Step,
            Steps,
            Callout,
            Tab,
            Tabs,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
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
