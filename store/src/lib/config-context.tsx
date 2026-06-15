'use client';



import { createContext, useContext, ReactNode } from 'react';



export interface LocalizedText {

  fa: string;

  en?: string;

}



export interface SiteConfig {

  site_name?: LocalizedText;

  site_description?: LocalizedText;

  site_logo?: string;

  colors_theme?: Record<string, string>;

  typography?: Record<string, string>;

  spacing?: Record<string, string>;

  animations?: { enabled: boolean; duration: string; easing?: string };

  card_style?: { variant?: string; shadow?: string; border?: boolean };

  home_layout_blocks?: string[];

  hero_slider?: {

    enabled: boolean;

    slides: Array<{

      mediaType?: 'image' | 'video';

      image?: string;

      video?: string;

      title: string;

      subtitle: string;

      link: string;

      buttonText: string;

      showOverlay?: boolean;

    }>;

    autoplay: boolean;

    interval: number;

  };

  announcement_bar?: { enabled: boolean; text: LocalizedText; link?: string };

  banner_config?: {

    enabled: boolean;

    label: LocalizedText;

    title: LocalizedText;

    subtitle: LocalizedText;

    buttonText: LocalizedText;

    buttonLink: string;

  };

  section_labels?: Record<string, {

    label?: LocalizedText;

    title?: LocalizedText;

    subtitle?: LocalizedText;

    linkText?: LocalizedText;

  }>;

  contact_info?: { email: string; phone: string; phoneDisplay: string; address: LocalizedText };

  footer_services?: LocalizedText[];

  lookbook_config?: {

    enabled: boolean;

    pageTitle: LocalizedText;

    pageSubtitle: LocalizedText;

    items: Array<{

      id: string;

      mediaType?: 'image' | 'video';

      image?: string;

      video?: string;

      title: LocalizedText;

      subtitle?: LocalizedText;

      link?: string;

    }>;

  };

  newsletter_config?: {

    enabled: boolean;

    label: LocalizedText;

    title: LocalizedText;

    subtitle: LocalizedText;

    placeholder: string;

    buttonText: LocalizedText;

  };

  mobile_nav_config?: { enabled: boolean; useNavigation: boolean; maxItems: number };

  category_display?: Record<string, { image?: string; gradient?: string }>;

  seo_global?: {

    titleTemplate: string;

    defaultDescription: string;

    keywords: string;

    ogImage: string;

  };

  social_links?: Record<string, string>;

  social_enabled?: Record<string, boolean>;

  footer_config?: {

    columns: Array<{ title: string; links: Array<{ label: string; url: string }> }>;

    copyright: string;

    showSocial: boolean;

  };

  shipping_config?: { baseCost: number; freeThreshold: number; estimatedDays: string };

  currency?: { code: string; symbol: string; position: string };

  ai_chat_enabled?: boolean;

  _navigation?: NavItem[];

  _modules?: Module[];

  _productFields?: ProductField[];

  _businessRules?: BusinessRule[];

  [key: string]: unknown;

}



interface NavItem {

  id: string;

  label: { fa: string; en: string };

  url: string;

  children?: NavItem[];

}



interface Module {

  id: string;

  slug: string;

  name: string;

  isActive: boolean;

  components: Component[];

}



interface Component {

  id: string;

  slug: string;

  name: string;

  type: string;

  isActive: boolean;

  config: Record<string, unknown>;

}



interface ProductField {

  key: string;

  label: { fa: string };

  type: string;

  showIn: string[];

}



interface BusinessRule {

  id: string;

  name: string;

  condition: unknown;

  action: { type: string; payload: Record<string, unknown> };

}



const ConfigContext = createContext<SiteConfig>({});



export function ConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;

}



export function useConfig() {

  return useContext(ConfigContext);

}



export function useTheme() {

  const config = useConfig();

  return config.colors_theme || {};

}



export function useSectionLabel(key: string, field: 'label' | 'title' | 'subtitle' | 'linkText' = 'title') {

  const config = useConfig();

  const section = config.section_labels?.[key];

  return section?.[field]?.fa || '';

}



export function formatPrice(price: number): string {

  const config = useContext(ConfigContext);

  const symbol = (config.currency as { symbol?: string })?.symbol || 'تومان';

  const formatted = new Intl.NumberFormat('fa-IR').format(price);

  return `${formatted} ${symbol}`;

}


