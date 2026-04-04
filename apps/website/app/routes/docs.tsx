import type { Route } from './+types/docs';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from 'fumadocs-ui/layouts/docs/page';
import { source } from '@/lib/source';
import browserCollections from 'collections/browser';
import { baseOptions, gitConfig } from '@/lib/layout.shared';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { getPageImagePath } from '@/lib/og';
import { useMDXComponents } from '@/components/mdx';
import { getGithubLastEdit } from 'fumadocs-core/content/github';

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter(v => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });

  const lastModifiedTime = await getGithubLastEdit({
    owner: gitConfig.user,
    repo: gitConfig.repo,
    path: `apps/website/content/docs/${page.path}`,
    token: `Bearer ${process.env.GITHUB_TOKEN}`,
  });

  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.getPageTree()),
    imagePath: getPageImagePath(slugs),
    lastModifiedTime: lastModifiedTime?.toISOString() ?? null,
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    {
      imagePath,
      lastModifiedTime,
    }: {
      imagePath: string;
      lastModifiedTime: string | null;
    },
  ) {
    return (
      <DocsPage
        toc={toc}
        tableOfContent={{
          single: false,
          style: 'clerk',
        }}
      >
        <title>{frontmatter.title}</title>
        <meta name='description' content={frontmatter.description} />
        <meta property='og:image' content={imagePath} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
          {lastModifiedTime && <PageLastUpdate date={new Date(lastModifiedTime)} />}
        </DocsBody>
      </DocsPage>
    );
  },
});

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree, imagePath, lastModifiedTime } = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      tree={pageTree}
      {...baseOptions}
      themeSwitch={{ enabled: false }}
      nav={{
        title: (
          <div className='flex items-center gap-2'>
            <img src='/logo.png' alt='BX Team Logo' width={22} height={22} />
            <span className='text-sm'>BX Team Documentation</span>
          </div>
        ),
      }}
    >
      {clientLoader.useContent(path, { imagePath, lastModifiedTime })}
    </DocsLayout>
  );
}
