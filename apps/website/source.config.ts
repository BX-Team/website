import { remarkMermaid } from '@theguild/remark-mermaid';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      method: z.string().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
      engine: 'oniguruma',
      langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
      inline: 'tailing-curly-colon',
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    },
    remarkPlugins: [remarkMermaid, remarkAdmonition],
  },
});
