import type { Metadata, Viewport } from 'next';

import './fonts.css';
import './globals.css';

import { fetchAPI } from '@/lib/api';

import { ConfigProvider, SiteConfig } from '@/lib/config-context';

import { CartProvider } from '@/lib/cart-context';

import Header from '@/components/Header';

import Footer from '@/components/Footer';

import ChatWidget from '@/components/ChatWidget';

import ThemeInjector from '@/components/ThemeInjector';

import ClientProviders from '@/components/ClientProviders';

import ModuleGate from '@/components/ModuleGate';



async function getConfig(): Promise<SiteConfig> {

  try {

    return await fetchAPI<SiteConfig>('/config/public');

  } catch {

    return {};

  }

}



export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5FAFE' },
    { media: '(prefers-color-scheme: dark)', color: '#142230' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {

  const config = await getConfig();

  const seo = config.seo_global;

  const siteName = config.site_name?.fa || 'نکال';



  const logoIcon = (config.site_logo && config.site_logo !== '/logo.svg') ? config.site_logo : '/logo.png';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3011'),
    title: {
      default: `${siteName} | Women's Fashion Boutique`,
      template: seo?.titleTemplate?.includes('{page_title}')
        ? seo.titleTemplate.replace('{page_title}', '%s')
        : `%s | ${siteName}`,
    },
    description: seo?.defaultDescription || config.site_description?.fa || 'بوتیک مد و پوشاک زنانه',
    keywords: seo?.keywords,
    icons: {
      icon: logoIcon,
      apple: '/logo.png',
    },
    openGraph: {
      images: seo?.ogImage ? [seo.ogImage] : ['/logo.png'],
    },
  };

}



export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const config = await getConfig();



  return (

    <html lang="fa" dir="rtl" suppressHydrationWarning>

      <head>

        <script

          dangerouslySetInnerHTML={{

            __html: `(function(){try{var t=localStorage.getItem('necoll_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));}catch(e){}})();`,

          }}

        />

      </head>

      <body>

        <ConfigProvider config={config}>

          <CartProvider>

            <ClientProviders>

              <ThemeInjector />

              <div className="min-h-screen flex flex-col">

                <Header />

                <main className="flex-1 main-with-mobile-nav">{children}</main>

                <Footer />

                <ModuleGate module="chat">

                  <ChatWidget />

                </ModuleGate>

              </div>

            </ClientProviders>

          </CartProvider>

        </ConfigProvider>

      </body>

    </html>

  );

}


