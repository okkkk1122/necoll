import type { Metadata, Viewport } from 'next';

import './fonts.css';
import './globals.css';

import { fetchAPI } from '@/lib/api';
import { ConfigProvider, SiteConfig } from '@/lib/config-context';
import { CartProvider } from '@/lib/cart-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeInjector from '@/components/ThemeInjector';
import ClientProviders from '@/components/ClientProviders';

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
  themeColor: '#ffffff',
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  const seo = config.seo_global;
  const siteName = config.site_name?.fa || 'نکال';
  const logoIcon = config.site_logo && config.site_logo !== '/logo.svg' ? config.site_logo : '/logo.png';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3011'),
    title: {
      default: `${siteName} | Women's Fashion Boutique`,
      template: seo?.titleTemplate?.includes('{page_title}')
        ? seo.titleTemplate.replace('{page_title}', '%s')
        : `%s | ${siteName}`,
    },
    description: seo?.defaultDescription || config.site_description?.fa || 'فروشگاه تخصصی پوشاک بانوان',
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
      <body>
        <ConfigProvider config={config}>
          <CartProvider>
            <ClientProviders>
              <ThemeInjector />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ClientProviders>
          </CartProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
