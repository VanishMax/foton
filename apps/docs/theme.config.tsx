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
  chat: {
    link: 'https://t.me/fotonjs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" width="24px" height="24px">
        <path
          d="M5.83,23.616c12.568-5.529,28.832-12.27,31.077-13.203c5.889-2.442,7.696-1.974,6.795,3.434 c-0.647,3.887-2.514,16.756-4.002,24.766c-0.883,4.75-2.864,5.313-5.979,3.258c-1.498-0.989-9.059-5.989-10.7-7.163 c-1.498-1.07-3.564-2.357-0.973-4.892c0.922-0.903,6.966-6.674,11.675-11.166c0.617-0.59-0.158-1.559-0.87-1.086 c-6.347,4.209-15.147,10.051-16.267,10.812c-1.692,1.149-3.317,1.676-6.234,0.838c-2.204-0.633-4.357-1.388-5.195-1.676 C1.93,26.43,2.696,24.995,5.83,23.616z"/>
      </svg>
    )
  },
  footer: {
    component: null,
  },
  useNextSeoProps() {
    const {asPath} = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s · Foton'
      }
    }
  },
  head: function useHead() {
    const {title} = useConfig();

    // TODO: implement API for the social cards with @vercel/og
    // const { route } = useRouter();
    // const socialCard =
    //   route === '/' || !title
    //     ? 'https://foton.sh/og.jpeg'
    //     : `https://foton.sh/api/og?title=${title}`

    const description = 'Create TON dApps with the speed of a photon';
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
