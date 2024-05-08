import { useConfig } from 'nextra-theme-docs';
import type { DocsThemeConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
      <img src="/logo.png" alt="Foton logo" width={32} height={32} />
      Foton
    </div>
  ),
  docsRepositoryBase: 'https://github.com/VanishMax/foton/tree/main/apps/docs',
  project: {
    link: 'https://github.com/VanishMax/foton',
  },
  footer: {
    component: null,
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s · Foton'
      }
    }
  },
  head: function useHead () {
    const { title } = useConfig();

    // TODO: implement API for the social cards with @vercel/og
    // const { route } = useRouter();
    // const socialCard =
    //   route === '/' || !title
    //     ? 'https://foton.sh/og.jpeg'
    //     : `https://foton.sh/api/og?title=${title}`

    const description = 'Create TON dApps with the speed of a foton';
    const domain = 'foton.sh';

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content={domain} />
        <meta name="twitter:url" content={`https://${domain}`} />
        <meta
          name="og:title"
          content={title ? title + ' · Foton' : 'Foton'}
        />
        <meta name="apple-mobile-web-app-title" content="Foton" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </>
    )
  },
}

export default config
