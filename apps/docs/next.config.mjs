import nextra from 'nextra';
import { BUNDLED_LANGUAGES, getHighlighter } from 'shiki';
import { fileURLToPath } from 'url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: (options) =>
        getHighlighter({
          ...options,
          langs: [
            ...BUNDLED_LANGUAGES.filter((language) => ['typescript', 'tsx', 'json', 'shellscript'].includes(language.id)),
            {
              id: 'tact',
              scopeName: 'source.tact',
              aliases: ['tact'],
              path: path.join(__dirname, 'tact-grammar.json'),
            }
          ]
        })
    }
  },
});

export default withNextra({});

