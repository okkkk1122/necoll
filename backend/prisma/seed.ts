import { PrismaClient, ConfigCategory, ConfigLayer, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Necoll database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@necoll.ir' },
    update: {},
    create: {
      email: 'admin@necoll.ir',
      password: adminPassword,
      name: 'مدیر سیستم',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // ═══ HyperConfig Settings ═══
  const settings = [
    // General
    {
      key: 'site_name',
      value: { fa: 'نکال', en: 'Necoll' },
      defaultValue: { fa: 'نکال', en: 'Necoll' },
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.SYSTEM,
      label: 'نام سایت',
      deletable: false,
    },
    {
      key: 'site_description',
      value: { fa: 'فروشگاه آنلاین نکال - بهترین محصولات با کیفیت', en: 'necoll Online Store' },
      defaultValue: { fa: 'فروشگاه آنلاین نکال', en: 'necoll Online Store' },
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.MODULE,
      label: 'توضیحات سایت',
    },
    {
      key: 'site_logo',
      value: '/logo.png',
      defaultValue: '/logo.png',
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.COMPONENT,
      label: 'لوگو',
    },
    {
      key: 'currency',
      value: { code: 'IRR', symbol: 'تومان', position: 'after' },
      defaultValue: { code: 'IRR', symbol: 'تومان', position: 'after' },
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.SYSTEM,
      label: 'واحد پول',
      deletable: false,
    },

    // Appearance / Theme
    {
      key: 'colors_theme',
      value: {
        primary: '#2D4A5E',
        secondary: '#A8DDF2',
        accent: '#7EC8EB',
        background: '#F5FAFE',
        surface: '#FFFFFF',
        text: '#2D4A5E',
        textMuted: '#6B8FA3',
        header: '#FFFFFF',
        footer: '#E8F4FC',
        button: '#3A9FD4',
        buttonText: '#FFFFFF',
        link: '#3A9FD4',
        card: '#FFFFFF',
        border: '#C8E4F2',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF6B6B',
      },
      defaultValue: {
        primary: '#2D4A5E',
        secondary: '#A8DDF2',
        accent: '#7EC8EB',
        background: '#F5FAFE',
        surface: '#FFFFFF',
        text: '#2D4A5E',
        textMuted: '#6B8FA3',
        header: '#FFFFFF',
        footer: '#E8F4FC',
        button: '#3A9FD4',
        buttonText: '#FFFFFF',
        link: '#3A9FD4',
        card: '#FFFFFF',
        border: '#C8E4F2',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF6B6B',
      },
      category: ConfigCategory.APPEARANCE,
      layer: ConfigLayer.MODULE,
      label: 'رنگ‌های تم',
    },
    {
      key: 'typography',
      value: {
        fontFamily: 'IRANSansX, Tahoma, sans-serif',
        fontBody: 'IRANSansX, Tahoma, sans-serif',
        fontHeading: 'Kalameh, IRANSansX, sans-serif',
        fontDisplay: 'Kalameh, IRANSansX, sans-serif',
        fontProduct: 'Dana, IRANSansX, sans-serif',
        fontNav: 'YekanBakh, IRANSansX, sans-serif',
        fontPrice: 'Dana, YekanBakh, IRANSansX, sans-serif',
        fontEditorial: 'Dana, IRANSansX, sans-serif',
        fontSizeBase: '17px',
        fontSizeH1: '2.75rem',
        fontSizeH2: '2.125rem',
        fontSizeH3: '1.625rem',
        lineHeight: '1.75',
      },
      defaultValue: {
        fontFamily: 'IRANSansX, Tahoma, sans-serif',
        fontBody: 'IRANSansX, Tahoma, sans-serif',
        fontHeading: 'Kalameh, IRANSansX, sans-serif',
        fontDisplay: 'Kalameh, IRANSansX, sans-serif',
        fontProduct: 'Dana, IRANSansX, sans-serif',
        fontNav: 'YekanBakh, IRANSansX, sans-serif',
        fontPrice: 'Dana, YekanBakh, IRANSansX, sans-serif',
        fontEditorial: 'Dana, IRANSansX, sans-serif',
        fontSizeBase: '17px',
        fontSizeH1: '2.75rem',
        fontSizeH2: '2.125rem',
        fontSizeH3: '1.625rem',
        lineHeight: '1.75',
      },
      category: ConfigCategory.APPEARANCE,
      layer: ConfigLayer.MODULE,
      label: 'تایپوگرافی',
    },
    {
      key: 'spacing',
      value: { padding: '1rem', margin: '1rem', gap: '1rem', borderRadius: '12px' },
      defaultValue: { padding: '1rem', margin: '1rem', gap: '1rem', borderRadius: '12px' },
      category: ConfigCategory.APPEARANCE,
      layer: ConfigLayer.COMPONENT,
      label: 'فاصله‌گذاری',
    },
    {
      key: 'animations',
      value: { enabled: true, duration: '300ms', easing: 'ease-in-out' },
      defaultValue: { enabled: true, duration: '300ms', easing: 'ease-in-out' },
      category: ConfigCategory.APPEARANCE,
      layer: ConfigLayer.COMPONENT,
      label: 'انیمیشن‌ها',
    },
    {
      key: 'card_style',
      value: { variant: 'elevated', shadow: '0 4px 6px rgba(0,0,0,0.1)', border: false },
      defaultValue: { variant: 'elevated', shadow: '0 4px 6px rgba(0,0,0,0.1)', border: false },
      category: ConfigCategory.APPEARANCE,
      layer: ConfigLayer.COMPONENT,
      label: 'استایل کارت',
    },

    // Layout
    {
      key: 'home_layout_blocks',
      value: ['hero_slider', 'featured_products', 'categories', 'lookbook', 'banner', 'new_arrivals', 'blog_posts', 'newsletter'],
      defaultValue: ['hero_slider', 'featured_products', 'categories', 'lookbook', 'banner', 'new_arrivals'],
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.MODULE,
      label: 'بلوک‌های صفحه اصلی',
    },
    {
      key: 'hero_slider',
      value: {
        enabled: true,
        slides: [
          {
            mediaType: 'image',
            image: '/images/slides/hero-sky-collection.jpg',
            video: '',
            title: 'کلکسیون آبی آسمانی',
            subtitle: 'لباس‌های زنانه مدرن با طراحی انتزاعی و ظرافت بی‌نظیر',
            link: '/products',
            buttonText: 'مشاهده کلکسیون',
          },
          {
            mediaType: 'image',
            image: '/images/slides/hero-elegant-style.jpg',
            video: '',
            title: 'استایل شیک و رسمی',
            subtitle: 'مانتو، بلیزر و ست‌های دو تکه برای هر موقعیت',
            link: '/products',
            buttonText: 'خرید کنید',
          },
          {
            mediaType: 'image',
            image: '/images/slides/hero-new-season.jpg',
            video: '',
            title: 'فصل جدید نکال',
            subtitle: 'جدیدترین طراحی‌ها با الهام از هنر و مد معاصر',
            link: '/products',
            buttonText: 'اکنون کشف کنید',
          },
        ],
        autoplay: true,
        interval: 5000,
      },
      defaultValue: {
        enabled: true,
        slides: [
          { mediaType: 'image', image: '', video: '', title: 'مجموعه جدید پاییزه', subtitle: 'تا ۳۰٪ تخفیف', link: '/products', buttonText: 'مشاهده محصولات' },
        ],
        autoplay: true,
        interval: 5000,
      },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'اسلایدر اصلی',
    },
    {
      key: 'announcement_bar',
      value: { enabled: true, text: { fa: 'ارسال رایگان بالای ۱ میلیون تومان · Spring Collection · Women\'s Fashion Boutique', en: 'Free shipping over 1M' }, link: '/products' },
      defaultValue: { enabled: true, text: { fa: 'ارسال رایگان بالای ۱ میلیون تومان', en: 'Free shipping' }, link: '' },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'نوار اعلان هدر',
    },
    {
      key: 'banner_config',
      value: { enabled: true, label: { fa: 'Free Shipping', en: 'Free Shipping' }, title: { fa: 'ارسال رایگان بالای ۱ میلیون تومان', en: 'Free Shipping' }, subtitle: { fa: 'همین حالا از جدیدترین مجموعه‌های فصل خرید کنید', en: '' }, buttonText: { fa: 'شروع خرید', en: 'Shop Now' }, buttonLink: '/products' },
      defaultValue: { enabled: true, label: { fa: 'Free Shipping', en: '' }, title: { fa: 'ارسال رایگان', en: '' }, subtitle: { fa: '', en: '' }, buttonText: { fa: 'خرید', en: '' }, buttonLink: '/products' },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'بنر تبلیغاتی صفحه اصلی',
    },
    {
      key: 'section_labels',
      value: {
        featured_products: { label: { fa: 'Featured', en: 'Featured' }, title: { fa: 'منتخب ویژه', en: '' }, subtitle: { fa: 'برگزیده‌های فصل', en: '' }, linkText: { fa: 'همه محصولات', en: '' } },
        categories: { label: { fa: 'Shop by Category', en: '' }, title: { fa: 'کالکشن‌های زنانه', en: '' }, subtitle: { fa: 'مانتو، تونیک، ست رسمی و شال و روسری', en: '' }, linkText: { fa: 'مشاهده همه', en: '' } },
        new_arrivals: { label: { fa: 'New Arrivals', en: '' }, title: { fa: 'جدیدترین‌ها', en: '' }, subtitle: { fa: 'تازه‌ترین استایل‌های فصل', en: '' }, linkText: { fa: 'مشاهده همه', en: '' } },
        blog_posts: { label: { fa: 'Editorial', en: '' }, title: { fa: 'مجله مد', en: '' }, subtitle: { fa: 'ترندها و الهام استایل', en: '' }, linkText: { fa: 'همه مقالات', en: '' } },
        lookbook: { label: { fa: 'Lookbook', en: '' }, title: { fa: 'لوک‌بوک', en: '' }, subtitle: { fa: 'الهام استایل از مجموعه نکال', en: '' }, linkText: { fa: 'مشاهده همه', en: '' } },
        products_page: { label: { fa: 'Shop All', en: '' }, title: { fa: 'فروشگاه', en: '' }, subtitle: { fa: 'کشف مجموعه کامل محصولات', en: '' } },
        blog_page: { label: { fa: 'Magazine', en: '' }, title: { fa: 'مجله مد نکال', en: '' }, subtitle: { fa: 'ترندها و راهنمای استایل', en: '' } },
      },
      defaultValue: {},
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'عناوین بخش‌های سایت',
    },
    {
      key: 'contact_info',
      value: { email: 'info@necoll.ir', phone: '021-12345678', phoneDisplay: '۰۲۱-۱۲۳۴۵۶۷۸', address: { fa: 'تهران، ایران', en: 'Tehran, Iran' } },
      defaultValue: { email: 'info@necoll.ir', phone: '', phoneDisplay: '', address: { fa: '', en: '' } },
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.MODULE,
      label: 'اطلاعات تماس',
    },
    {
      key: 'footer_services',
      value: [
        { fa: 'ارسال سریع به سراسر کشور', en: 'Fast nationwide shipping' },
        { fa: 'ضمانت اصالت کالا', en: 'Authenticity guarantee' },
        { fa: '۷ روز مهلت مرجوعی', en: '7-day returns' },
      ],
      defaultValue: [],
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'خدمات فوتر',
    },
    {
      key: 'lookbook_config',
      value: {
        enabled: true,
        pageTitle: { fa: 'لوک‌بوک', en: 'Lookbook' },
        pageSubtitle: { fa: 'الهام استایل از مجموعه نکال', en: '' },
        items: [
          { id: '1', image: '/images/products/navy-marble-tunic.png', video: '', mediaType: 'image', title: { fa: 'تونیک طرح سنگ مرمر', en: 'Marble Print Tunic' }, subtitle: { fa: 'الگوی انتزاعی آبی', en: '' }, link: '/products/navy-marble-tunic' },
          { id: '2', image: '/images/products/geometric-blazer-set.png', video: '', mediaType: 'image', title: { fa: 'ست بلیزر طرح هندسی', en: 'Geometric Blazer' }, subtitle: { fa: 'استایل مدرن و شیک', en: '' }, link: '/products/geometric-blazer-set' },
          { id: '3', image: '/images/products/mustard-lace-manteau.png', video: '', mediaType: 'image', title: { fa: 'مانتو زرد خردلی', en: 'Mustard Lace Manteau' }, subtitle: { fa: 'گلدوزی تور مشکی', en: '' }, link: '/products/mustard-lace-manteau' },
        ],
      },
      defaultValue: { enabled: true, pageTitle: { fa: 'لوک‌بوک', en: '' }, pageSubtitle: { fa: '', en: '' }, items: [] },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'لوک‌بوک',
    },
    {
      key: 'newsletter_config',
      value: { enabled: true, label: { fa: 'Newsletter', en: '' }, title: { fa: 'عضویت در خبرنامه', en: '' }, subtitle: { fa: 'از تخفیف‌ها و کالکشن‌های جدید باخبر شوید', en: '' }, placeholder: 'ایمیل شما', buttonText: { fa: 'عضویت', en: 'Subscribe' } },
      defaultValue: { enabled: true, label: { fa: 'Newsletter', en: '' }, title: { fa: 'عضویت در خبرنامه', en: '' }, subtitle: { fa: '', en: '' }, placeholder: 'email', buttonText: { fa: 'عضویت', en: '' } },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'تنظیمات خبرنامه',
    },
    {
      key: 'newsletter_subscribers',
      value: [],
      defaultValue: [],
      category: ConfigCategory.NOTIFICATION,
      layer: ConfigLayer.MODULE,
      label: 'مشترکین خبرنامه',
    },
    {
      key: 'mobile_nav_config',
      value: { enabled: true, useNavigation: true, maxItems: 5 },
      defaultValue: { enabled: true, useNavigation: true, maxItems: 5 },
      category: ConfigCategory.NAVIGATION,
      layer: ConfigLayer.COMPONENT,
      label: 'ناوبری موبایل',
    },
    {
      key: 'category_display',
      value: {
        manteau: { image: '/images/categories/manteau.png', gradient: 'linear-gradient(160deg, #E8F6FC 0%, #A8DDF2 100%)' },
        'tunic-blouse': { image: '/images/categories/tunic-blouse.png', gradient: 'linear-gradient(160deg, #D6EFF9 0%, #7EC8EB 100%)' },
        'formal-set': { image: '/images/categories/formal-set.png', gradient: 'linear-gradient(160deg, #C8EBF7 0%, #3A9FD4 55%, #A8DDF2 100%)' },
        'shawl-scarf': { image: '/images/categories/shawl-scarf.png', gradient: 'linear-gradient(160deg, #F5E6D8 0%, #E8DCC8 50%, #A8DDF2 100%)' },
      },
      defaultValue: {},
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'نمایش دسته‌بندی‌ها',
    },

    // Product fields
    {
      key: 'product_fields_active',
      value: ['size', 'color', 'fabric', 'country', 'warranty'],
      defaultValue: ['size', 'color', 'fabric', 'country', 'warranty'],
      category: ConfigCategory.PRODUCT,
      layer: ConfigLayer.MODULE,
      label: 'فیلدهای فعال محصول',
    },

    // Social
    {
      key: 'social_links',
      value: {
        telegram: 'https://t.me/necoll_shop',
        instagram: 'https://instagram.com/necoll_shop',
        whatsapp: 'https://wa.me/989123456789',
        bale: '',
        rubika: '',
      },
      defaultValue: {
        telegram: 'https://t.me/necoll_shop',
        instagram: 'https://instagram.com/necoll_shop',
        whatsapp: 'https://wa.me/989123456789',
        bale: '',
        rubika: '',
      },
      category: ConfigCategory.SOCIAL,
      layer: ConfigLayer.MODULE,
      label: 'شبکه‌های اجتماعی',
    },
    {
      key: 'social_enabled',
      value: { telegram: true, instagram: true, whatsapp: true, bale: false, rubika: false },
      defaultValue: { telegram: true, instagram: true, whatsapp: true, bale: false, rubika: false },
      category: ConfigCategory.SOCIAL,
      layer: ConfigLayer.MODULE,
      label: 'فعال‌سازی شبکه‌ها',
    },

    // Payment
    {
      key: 'payment_gateways',
      value: { zarinpal: true, idpay: false, nextpay: false },
      defaultValue: { zarinpal: true, idpay: false, nextpay: false },
      category: ConfigCategory.PAYMENT,
      layer: ConfigLayer.SYSTEM,
      label: 'درگاه‌های پرداخت',
      deletable: false,
    },
    {
      key: 'zarinpal_merchant',
      value: '',
      defaultValue: '',
      category: ConfigCategory.PAYMENT,
      layer: ConfigLayer.SYSTEM,
      label: 'مرچنت زرین‌پال',
      deletable: false,
    },
    {
      key: 'zarinpal_sandbox',
      value: true,
      defaultValue: true,
      category: ConfigCategory.PAYMENT,
      layer: ConfigLayer.MODULE,
      label: 'حالت Sandbox زرین‌پال',
    },
    {
      key: 'shipping_config',
      value: { baseCost: 50000, freeThreshold: 1000000, estimatedDays: '2-5' },
      defaultValue: { baseCost: 50000, freeThreshold: 1000000, estimatedDays: '2-5' },
      category: ConfigCategory.PAYMENT,
      layer: ConfigLayer.MODULE,
      label: 'تنظیمات ارسال',
    },
    {
      key: 'min_order_amount',
      value: 100000,
      defaultValue: 100000,
      category: ConfigCategory.PAYMENT,
      layer: ConfigLayer.MODULE,
      label: 'حداقل مبلغ سفارش',
    },

    // SEO
    {
      key: 'seo_global',
      value: {
        titleTemplate: '{page_title} | نکال',
        defaultDescription: 'فروشگاه آنلاین نکال - خرید آنلاین با بهترین قیمت',
        keywords: 'فروشگاه, آنلاین, نکال, خرید',
        ogImage: '/og-image.jpg',
      },
      defaultValue: {
        titleTemplate: '{page_title} | نکال',
        defaultDescription: 'فروشگاه آنلاین نکال',
        keywords: 'فروشگاه, آنلاین, نکال',
        ogImage: '/og-image.jpg',
      },
      category: ConfigCategory.SEO,
      layer: ConfigLayer.MODULE,
      label: 'سئو سراسری',
    },
    {
      key: 'seo_sitemap_enabled',
      value: true,
      defaultValue: true,
      category: ConfigCategory.SEO,
      layer: ConfigLayer.MODULE,
      label: 'Sitemap خودکار',
    },
    {
      key: 'seo_jsonld_enabled',
      value: { product: true, breadcrumb: true, organization: true },
      defaultValue: { product: true, breadcrumb: true, organization: true },
      category: ConfigCategory.SEO,
      layer: ConfigLayer.MODULE,
      label: 'JSON-LD',
    },
    {
      key: 'robots_txt',
      value: 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml',
      defaultValue: 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml',
      category: ConfigCategory.SEO,
      layer: ConfigLayer.MODULE,
      label: 'robots.txt',
    },

    // Notifications
    {
      key: 'notifications_enabled',
      value: { email: true, sms: false, inApp: true },
      defaultValue: { email: true, sms: false, inApp: true },
      category: ConfigCategory.NOTIFICATION,
      layer: ConfigLayer.MODULE,
      label: 'کانال‌های اعلان',
    },
    {
      key: 'email_templates',
      value: {
        welcome: 'به فروشگاه نکال خوش آمدید {name}!',
        orderConfirm: 'سفارش شما با شماره {order_number} ثبت شد.',
        shipping: 'سفارش {order_number} ارسال شد.',
        refund: 'درخواست مرجوعی شما دریافت شد.',
      },
      defaultValue: {
        welcome: 'به فروشگاه نکال خوش آمدید {name}!',
        orderConfirm: 'سفارش شما با شماره {order_number} ثبت شد.',
        shipping: 'سفارش {order_number} ارسال شد.',
        refund: 'درخواست مرجوعی شما دریافت شد.',
      },
      category: ConfigCategory.NOTIFICATION,
      layer: ConfigLayer.MODULE,
      label: 'قالب ایمیل‌ها',
    },

    // AI Chat
    {
      key: 'ai_chat_enabled',
      value: true,
      defaultValue: true,
      category: ConfigCategory.SUPPORT,
      layer: ConfigLayer.MODULE,
      label: 'چت هوش مصنوعی',
    },
    {
      key: 'ai_chat_prompt',
      value:
        'شما دستیار هوشمند فروشگاه پوشاک زنانه «نکال» هستید. نام شما «دستیار نکال» است. به زبان فارسی، گرم و حرفه‌ای پاسخ دهید. فقط از اطلاعات پایگاه دانش که در پیام سیستم آمده استفاده کنید. محصولات را با نام، قیمت و لینک معرفی کنید. درباره ارسال، مرجوعی، تخفیف و تماس اطلاعات دقیق بدهید. پاسخ‌ها کوتاه، مفید و ساختارمند باشند.',
      defaultValue:
        'شما دستیار هوشمند فروشگاه نکال هستید. فقط از اطلاعات پایگاه دانش استفاده کنید.',
      category: ConfigCategory.SUPPORT,
      layer: ConfigLayer.MODULE,
      label: 'پرامپت AI',
    },
    {
      key: 'ai_chat_welcome',
      value:
        'سلام! من دستیار هوشمند نکال هستم ✨ می‌تونم محصولات، قیمت‌ها، ارسال رایگان، کد تخفیف و مرجوعی رو براتون توضیح بدم. چطور کمکتون کنم؟',
      defaultValue: 'سلام! چطور می‌تونم کمکتون کنم؟',
      category: ConfigCategory.SUPPORT,
      layer: ConfigLayer.COMPONENT,
      label: 'پیام خوش‌آمد',
    },
    {
      key: 'openai_api_key',
      value: '',
      defaultValue: '',
      category: ConfigCategory.INTEGRATION,
      layer: ConfigLayer.SYSTEM,
      label: 'OpenAI API Key',
      deletable: false,
    },

    // Static Pages
    {
      key: 'static_pages',
      value: {
        about: {
          title: { fa: 'درباره نکال' },
          content: { fa: 'فروشگاه آنلاین نکال با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب تأسیس شده است. ما معتقدیم خرید آنلاین باید ساده، امن و لذت‌بخش باشد.' },
          sections: [
            { title: 'ماموریت ما', content: 'ارائه تجربه خرید آنلاین ساده، امن و لذت‌بخش برای همه ایرانیان' },
            { title: 'چرا نکال؟', content: 'ضمانت اصالت کالا، ارسال سریع، پشتیبانی ۲۴ ساعته و امکان مرجوعی تا ۷ روز' },
          ],
        },
        contact: {
          title: { fa: 'تماس با ما' },
          content: { fa: 'تیم پشتیبانی نکال آماده پاسخگویی به سوالات شماست.' },
        },
      },
      defaultValue: {},
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.MODULE,
      label: 'صفحات ثابت',
    },
    {
      key: 'contact_messages',
      value: [],
      defaultValue: [],
      category: ConfigCategory.NOTIFICATION,
      layer: ConfigLayer.MODULE,
      label: 'پیام‌های تماس',
    },

    // Footer
    {
      key: 'footer_config',
      value: {
        columns: [
          { title: 'درباره نکال', links: [{ label: 'درباره ما', url: '/about' }, { label: 'تماس', url: '/contact' }] },
          { title: 'خدمات', links: [{ label: 'ارسال', url: '/blog/free-shipping-guide' }, { label: 'مرجوعی', url: '/blog/return-policy' }] },
          { title: 'قوانین', links: [{ label: 'حریم خصوصی', url: '/privacy' }, { label: 'شرایط', url: '/terms' }] },
        ],
        copyright: '© ۱۴۰۴ فروشگاه نکال. تمامی حقوق محفوظ است.',
        showSocial: true,
      },
      defaultValue: {
        columns: [],
        copyright: '© ۱۴۰۴ فروشگاه نکال',
        showSocial: true,
      },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'تنظیمات فوتر',
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        defaultValue: setting.defaultValue,
        label: setting.label,
        category: setting.category,
        layer: setting.layer,
      },
      create: setting,
    });
  }

  // ═══ Modules ═══
  const modules = [
    { slug: 'shop', name: 'فروشگاه', description: 'ماژول فروشگاه و محصولات', sortOrder: 1 },
    { slug: 'blog', name: 'وبلاگ', description: 'مقالات و اخبار', sortOrder: 2 },
    { slug: 'reviews', name: 'نظرات', description: 'سیستم نظرات محصولات', sortOrder: 3 },
    { slug: 'chat', name: 'چت', description: 'چت آنلاین و AI', sortOrder: 4 },
    { slug: 'newsletter', name: 'خبرنامه', description: 'عضویت در خبرنامه', sortOrder: 5 },
    { slug: 'lookbook', name: 'لوک‌بوک', description: 'گالری استایل و لوک‌بوک', sortOrder: 6 },
    { slug: 'gallery', name: 'گالری', description: 'گالری تصاویر', sortOrder: 7 },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name, description: mod.description, sortOrder: mod.sortOrder, isActive: true },
      create: { ...mod, isActive: true },
    });
  }

  const shopModule = await prisma.module.findUnique({ where: { slug: 'shop' } });
  if (shopModule) {
    const components = [
      { slug: 'product_card', name: 'کارت محصول', type: 'card', sortOrder: 1 },
      { slug: 'product_detail', name: 'جزئیات محصول', type: 'page', sortOrder: 2 },
      { slug: 'cart_widget', name: 'سبد خرید', type: 'widget', sortOrder: 3 },
      { slug: 'filter_sidebar', name: 'فیلتر محصولات', type: 'sidebar', sortOrder: 4 },
    ];
    for (const comp of components) {
      await prisma.component.upsert({
        where: { moduleId_slug: { moduleId: shopModule.id, slug: comp.slug } },
        update: {},
        create: { ...comp, moduleId: shopModule.id, config: { isActive: true } },
      });
    }
  }

  // ═══ Product Field Definitions ═══
  const productFields = [
    { key: 'size', label: { fa: 'سایز', en: 'Size' }, type: 'select', showIn: ['detail', 'card', 'filter', 'compare'] },
    { key: 'color', label: { fa: 'رنگ', en: 'Color' }, type: 'color', showIn: ['detail', 'card', 'filter', 'compare'] },
    { key: 'fabric', label: { fa: 'جنس', en: 'Fabric' }, type: 'text', showIn: ['detail', 'filter'] },
    { key: 'country', label: { fa: 'کشور سازنده', en: 'Country' }, type: 'text', showIn: ['detail'] },
    { key: 'warranty', label: { fa: 'گارانتی', en: 'Warranty' }, type: 'text', showIn: ['detail', 'checkout'] },
  ];

  for (const [i, field] of productFields.entries()) {
    await prisma.productFieldDefinition.upsert({
      where: { key: field.key },
      update: {},
      create: { ...field, sortOrder: i },
    });
  }

  // ═══ Categories ═══
  const categories = [
    { slug: 'manteau', name: { fa: 'مانتو', en: 'Manteau' }, image: '/images/categories/manteau.png', showInHeader: true, sortOrder: 1 },
    { slug: 'tunic-blouse', name: { fa: 'تونیک و بلوز', en: 'Tunics & Blouses' }, image: '/images/categories/tunic-blouse.png', showInHeader: true, sortOrder: 2 },
    { slug: 'formal-set', name: { fa: 'ست رسمی', en: 'Formal Sets' }, image: '/images/categories/formal-set.png', showInHeader: true, sortOrder: 3 },
    { slug: 'shawl-scarf', name: { fa: 'شال و روسری', en: 'Shawls & Scarves' }, image: '/images/categories/shawl-scarf.png', showInHeader: true, sortOrder: 4 },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        image: cat.image,
        sortOrder: cat.sortOrder,
        showInHeader: cat.showInHeader,
        isActive: true,
      },
      create: { ...cat, isActive: true },
    });
    categoryIds[cat.slug] = created.id;
  }

  await prisma.category.updateMany({
    where: { slug: { in: ['home', 'electronics', 'clothing', 'accessories'] } },
    data: { isActive: false, showInHeader: false },
  });

  // ═══ Sample Products — Women's Fashion (real sample images) ═══
  const products = [
    {
      slug: 'pinstripe-suit-set',
      name: { fa: 'ست رسمی راه‌راه مشکی', en: 'Black Pinstripe Suit Set' },
      description: { fa: 'ست دو تکه بلیزر و شلوار راه‌راه مشکی با طراحی مدرن و فیت حرفه‌ای. مناسب استایل رسمی و مهمانی.' },
      price: 2850000,
      comparePrice: 3400000,
      stock: 12,
      isFeatured: true,
      categoryId: categoryIds['formal-set'],
      dynamicFields: { size: 'M-L', color: 'مشکی', fabric: 'پارچه ترکیبی', country: 'ایران', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/pinstripe-suit-set.png'],
    },
    {
      slug: 'vani-mode-black-set',
      name: { fa: 'ست دو تکه مشکی سفید Vani Mode', en: 'Vani Mode Black & White Set' },
      description: { fa: 'ست کت و شلوار مشکی با جزئیات سفید در لبه و دم‌پا. استایل مینیمال و شیک برای روزمره و محل کار.' },
      price: 2400000,
      comparePrice: 2950000,
      stock: 15,
      isFeatured: true,
      categoryId: categoryIds['formal-set'],
      dynamicFields: { size: 'S-M', color: 'مشکی', fabric: 'کرپ', country: 'ایران' },
      images: ['/images/products/vani-mode-black-set.png'],
    },
    {
      slug: 'gold-button-blazer-set',
      name: { fa: 'ست بلیزر دکمه‌دار طلایی', en: 'Gold Button Blazer Set' },
      description: { fa: 'بلیزر دو ردیف دکمه طلایی با شلوار پاچه‌گشاد مشکی. استایل رسمی و مجلسی با جزئیات درخشان.' },
      price: 3200000,
      comparePrice: 3800000,
      stock: 8,
      isFeatured: true,
      categoryId: categoryIds['formal-set'],
      dynamicFields: { size: 'M', color: 'مشکی', fabric: 'ویسکوز پشم', country: 'ترکیه', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/gold-button-blazer-set.png'],
    },
    {
      slug: 'altun-black-manteau',
      name: { fa: 'مانتو بافت‌دار مشکی Altun — کد ۷۹۰', en: 'Altun Textured Black Manteau' },
      description: { fa: 'مانتو مشکی بافت‌دار با یقه انگلیسی و جیب‌های تزئینی. کد محصول ۷۹۰ — کالکشن جدید Altun.' },
      price: 1950000,
      comparePrice: 2350000,
      stock: 20,
      isFeatured: true,
      categoryId: categoryIds.manteau,
      dynamicFields: { size: 'Free Size', color: 'مشکی', fabric: 'بافت ریز', country: 'ایران' },
      images: ['/images/products/altun-black-manteau.png'],
    },
    {
      slug: 'navy-marble-tunic',
      name: { fa: 'تونیک طرح سنگ مرمر سرمه‌ای', en: 'Navy Marble Print Tunic' },
      description: { fa: 'تونیک سه‌ربع آستین با الگوی انتزاعی سنگ مرمر در ترکیب سرمه‌ای و کرم. استایل مدرن و ظریف برای روزمره و مهمانی.' },
      price: 1680000,
      comparePrice: 2100000,
      stock: 18,
      isFeatured: true,
      categoryId: categoryIds['tunic-blouse'],
      dynamicFields: { size: 'M-L', color: 'سرمه‌ای', fabric: 'نخ پنبه', country: 'ایران' },
      images: ['/images/products/navy-marble-tunic.png'],
    },
    {
      slug: 'navy-leaf-tunic',
      name: { fa: 'تونیک گل‌برگی سرمه‌ای', en: 'Navy Leaf Print Tunic' },
      description: { fa: 'تونیک یقه‌دار با طرح برگ‌های طلایی روی زمینه سرمه‌ای. مناسب استایل مجلسی و روزمره شیک.' },
      price: 1750000,
      comparePrice: 2200000,
      stock: 14,
      isFeatured: true,
      categoryId: categoryIds['tunic-blouse'],
      dynamicFields: { size: 'S-M', color: 'سرمه‌ای', fabric: 'کرپ مخمل', country: 'ایران' },
      images: ['/images/products/navy-leaf-tunic.png'],
    },
    {
      slug: 'geometric-blazer-set',
      name: { fa: 'ست بلیزر طرح هندسی', en: 'Geometric Pattern Blazer Set' },
      description: { fa: 'بلیزر بدون دکمه با طرح هندسی مشکی و سفید همراه شلوار مشکی و کیف کلچ. استایل مدرن و جسور.' },
      price: 2650000,
      comparePrice: 3100000,
      stock: 10,
      isFeatured: true,
      categoryId: categoryIds['formal-set'],
      dynamicFields: { size: 'M', color: 'مشکی', fabric: 'پارچه ترکیبی', country: 'ترکیه' },
      images: ['/images/products/geometric-blazer-set.png'],
    },
    {
      slug: 'artistic-print-jacket',
      name: { fa: 'کت چاپ هنری چندرنگ', en: 'Artistic Multi-Color Jacket' },
      description: { fa: 'کت زیپ‌دار با طرح هنری گل و هندسه در رنگ‌های قرمز، سبز و صورتی. همراه شلوار مشکی و کیف چرمی.' },
      price: 2480000,
      comparePrice: 2950000,
      stock: 9,
      isFeatured: false,
      categoryId: categoryIds['formal-set'],
      dynamicFields: { size: 'M-L', color: 'چندرنگ', fabric: 'پلی‌استر ویسکوز', country: 'ایران' },
      images: ['/images/products/artistic-print-jacket.png'],
    },
    {
      slug: 'mustard-lace-manteau',
      name: { fa: 'مانتو زرد خردلی با تور مشکی', en: 'Mustard Lace Manteau' },
      description: { fa: 'مانتو زرد خردلی با گلدوزی تور مشکی روی یقه و آستین. طراحی مجلسی و شیک برای مهمانی و استایل رسمی.' },
      price: 2150000,
      comparePrice: 2600000,
      stock: 11,
      isFeatured: true,
      categoryId: categoryIds.manteau,
      dynamicFields: { size: 'Free Size', color: 'زرد خردلی', fabric: 'کرپ با تور', country: 'ایران', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/mustard-lace-manteau.png'],
    },
    {
      slug: 'wool-scarf',
      name: { fa: 'شال پشمی', en: 'Wool Scarf' },
      description: { fa: 'شال پشمی نرم و گرم با طرح چهارخانه کلاسیک. مناسب فصل پاییز و زمستان و ست با مانتو و پالتو.' },
      price: 480000,
      comparePrice: 590000,
      stock: 30,
      isFeatured: false,
      categoryId: categoryIds['shawl-scarf'],
      dynamicFields: { color: 'مشکی و سفید', fabric: 'پشم مرینو', country: 'ترکیه' },
      images: ['/images/products/wool-scarf.png'],
    },
    {
      slug: 'leather-bag-brown',
      name: { fa: 'کیف چرمی قهوه‌ای', en: 'Brown Leather Bag' },
      description: { fa: 'کیف دوشی چرم با بافت کروکودیل و زنجیر فلزی. طراحی شیک و مدرن — مکمل استایل رسمی و روزمره.' },
      price: 1200000,
      comparePrice: 1500000,
      stock: 8,
      isFeatured: false,
      categoryId: categoryIds['shawl-scarf'],
      dynamicFields: { color: 'طوسی تیره', fabric: 'چرم مصنوعی', country: 'ایران', warranty: '۶ ماه' },
      images: ['/images/products/leather-bag-brown.png'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        isActive: true,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
        dynamicFields: product.dynamicFields,
        images: product.images,
      },
      create: { ...product, isActive: true },
    });
  }

  const activeSlugs = products.map((p) => p.slug);
  await prisma.product.updateMany({
    where: { slug: { notIn: activeSlugs } },
    data: { isActive: false, isFeatured: false },
  });

  // ═══ Navigation ═══
  const navItems = [
    { label: { fa: 'خانه', en: 'Home' }, url: '/', sortOrder: 1 },
    { label: { fa: 'فروشگاه', en: 'Shop' }, url: '/products', sortOrder: 2 },
    { label: { fa: 'لوک‌بوک', en: 'Lookbook' }, url: '/lookbook', sortOrder: 3 },
    { label: { fa: 'وبلاگ', en: 'Blog' }, url: '/blog', sortOrder: 4 },
    { label: { fa: 'درباره ما', en: 'About' }, url: '/about', sortOrder: 5 },
    { label: { fa: 'تماس', en: 'Contact' }, url: '/contact', sortOrder: 6 },
  ];

  for (const item of navItems) {
    const existing = await prisma.navigationItem.findFirst({ where: { url: item.url } });
    if (existing) {
      await prisma.navigationItem.update({
        where: { id: existing.id },
        data: { label: item.label, sortOrder: item.sortOrder, isActive: true },
      });
    } else {
      await prisma.navigationItem.create({ data: { ...item, isActive: true } });
    }
  }

  // ═══ Route Configs ═══
  const routes = [
    { path: '/', pageType: 'home', seoConfig: { title: 'صفحه اصلی' } },
    { path: '/products', pageType: 'product-list', seoConfig: { title: 'محصولات' } },
    { path: '/products/:slug', pageType: 'product-detail', seoConfig: { titleTemplate: '{product_name} | نکال' } },
    { path: '/lookbook', pageType: 'lookbook', seoConfig: { title: 'لوک‌بوک' } },
    { path: '/blog', pageType: 'blog-list', seoConfig: { title: 'مجله مد' } },
    { path: '/about', pageType: 'static', seoConfig: { title: 'درباره ما' } },
    { path: '/contact', pageType: 'static', seoConfig: { title: 'تماس با ما' } },
    { path: '/cart', pageType: 'cart', seoConfig: { title: 'سبد خرید' } },
    { path: '/checkout', pageType: 'checkout', seoConfig: { title: 'تسویه حساب' } },
  ];

  for (const route of routes) {
    await prisma.routeConfig.upsert({
      where: { path: route.path },
      update: {},
      create: route,
    });
  }

  // ═══ Business Rules ═══
  const rules = [
    {
      name: 'موجودی کم',
      description: 'نمایش برچسب وقتی موجودی کمتر از ۵ است',
      condition: { field: 'stock', operator: 'lt', value: 5 },
      action: { type: 'show_badge', payload: { text: 'فقط چند عدد باقی مانده', color: '#F59E0B' } },
      priority: 10,
    },
    {
      name: 'ارسال رایگان',
      description: 'نمایش برچسب ارسال رایگان برای قیمت بالا',
      condition: { field: 'price', operator: 'gte', value: 1000000 },
      action: { type: 'show_badge', payload: { text: 'ارسال رایگان', color: '#10B981' } },
      priority: 5,
    },
    {
      name: 'تخفیف اولین خرید',
      description: 'کد تخفیف برای خرید اول',
      condition: { field: 'isFirstPurchase', operator: 'eq', value: true },
      action: { type: 'show_message', payload: { text: '۱۰٪ تخفیف اولین خرید!', code: 'FIRST10' } },
      priority: 8,
    },
  ];

  for (const rule of rules) {
    const existing = await prisma.businessRule.findFirst({ where: { name: rule.name } });
    if (!existing) {
      await prisma.businessRule.create({ data: rule });
    }
  }

  // ═══ Coupon ═══
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrder: 200000,
      maxUses: 1000,
    },
  });

  // ═══ Blog Posts ═══
  const blogPosts = [
    {
      slug: 'welcome-to-necoll',
      title: { fa: 'به فروشگاه نکال خوش آمدید', en: 'Welcome to necoll' },
      excerpt: { fa: 'آشنایی با فروشگاه آنلاین نکال و خدمات ما' },
      content: {
        fa: `مجموعه نکال با هدف ارائه زیباترین و باکیفیت‌ترین پوشاک بانوان با آخرین ترندهای جهانی راه‌اندازی شده است.

در اینجا با جدیدترین کلکسیون‌ها و استایل‌های روز آشنا می‌شوید — از مانتو و تونیک تا ست‌های رسمی و شال و روسری.

ضمانت اصالت کالا، ارسال سریع، پشتیبانی ۲۴ ساعته و امکان مرجوعی تا ۷ روز از خدمات ماست.`,
      },
      image: '/images/blog/welcome-to-necoll.png',
      isPublished: true,
    },
    {
      slug: 'free-shipping-guide',
      title: { fa: 'راهنمای ارسال رایگان', en: 'Free Shipping Guide' },
      excerpt: { fa: 'چگونه از ارسال رایگان بهره‌مند شویم؟' },
      content: {
        fa: `ارسال رایگان به سراسر کشور — برای تمام سفارش‌های بالای ۱ میلیون تومان، ارسال رایگان انجام می‌شود.

زمان تحویل — معمولاً ۲ تا ۵ روز کاری پس از ثبت و تأیید سفارش.

بسته‌بندی امن — تمام سفارش‌ها با دقت بسته‌بندی و ارسال می‌شوند.

پیگیری سفارش — پس از ارسال، کد رهگیری از طریق پیامک یا ایمیل برای شما ارسال می‌شود.`,
      },
      image: '/images/blog/free-shipping-guide.png',
      isPublished: true,
    },
    {
      slug: 'return-policy',
      title: { fa: 'سیاست مرجوعی کالا', en: 'Return Policy' },
      excerpt: { fa: 'شرایط بازگشت و مرجوعی محصولات' },
      content: {
        fa: `ضمانت بازگشت ۷ روزه — تا ۷ روز پس از دریافت کالا، امکان مرجوعی وجود دارد.

ارسال آسان و رایگان — فرآیند مرجوعی با راهنمایی تیم پشتیبانی انجام می‌شود.

پشتیبانی کامل مشتریان — تیم نکال در تمام مراحل بازگرداندن کالا همراه شماست.

شرایط تعویض و بازگرداندن ساده — کالا باید در بسته‌بندی اصلی، بدون استفاده و با برچسب سالم باشد.`,
      },
      image: '/images/blog/return-policy.png',
      isPublished: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        isPublished: post.isPublished,
      },
      create: post,
    });
  }

  // Clear HyperConfig Redis cache so store gets fresh data
  try {
    const Redis = (await import('ioredis')).default;
    const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
    const keys = await redis.keys('hyperconfig:*');
    if (keys.length > 0) await redis.del(...keys);
    await redis.quit();
    console.log('🗑️  Redis config cache cleared');
  } catch {
    console.log('⚠️  Redis cache clear skipped');
  }

  console.log('✅ Seed completed successfully!');
  console.log('📧 Admin: admin@necoll.ir / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
