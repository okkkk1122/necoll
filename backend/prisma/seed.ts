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
        primary: '#111111',
        secondary: '#f5f5f5',
        accent: '#111111',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#111111',
        textMuted: '#666666',
        header: '#ffffff',
        footer: '#fafafa',
        button: '#111111',
        buttonText: '#ffffff',
        link: '#111111',
        card: '#ffffff',
        border: '#e5e5e5',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF6B6B',
      },
      defaultValue: {
        primary: '#111111',
        secondary: '#f5f5f5',
        accent: '#111111',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#111111',
        textMuted: '#666666',
        header: '#ffffff',
        footer: '#fafafa',
        button: '#111111',
        buttonText: '#ffffff',
        link: '#111111',
        card: '#ffffff',
        border: '#e5e5e5',
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
        fontFamily: 'IranianSans, Tahoma, sans-serif',
        fontBody: 'IranianSans, Tahoma, sans-serif',
        fontHeading: 'Yekan, IranianSans, sans-serif',
        fontDisplay: 'Yekan, IranianSans, sans-serif',
        fontProduct: 'Yekan, IranianSans, sans-serif',
        fontNav: 'Yekan, IranianSans, sans-serif',
        fontPrice: 'IranianSans, Yekan, sans-serif',
        fontEditorial: 'IranianSans, Tahoma, sans-serif',
        fontCta: 'Farhang, Yekan, IranianSans, sans-serif',
        fontSizeBase: '17px',
        fontSizeH1: '2.75rem',
        fontSizeH2: '2.125rem',
        fontSizeH3: '1.625rem',
        lineHeight: '1.75',
      },
      defaultValue: {
        fontFamily: 'IranianSans, Tahoma, sans-serif',
        fontBody: 'IranianSans, Tahoma, sans-serif',
        fontHeading: 'Yekan, IranianSans, sans-serif',
        fontDisplay: 'Yekan, IranianSans, sans-serif',
        fontProduct: 'Yekan, IranianSans, sans-serif',
        fontNav: 'Yekan, IranianSans, sans-serif',
        fontPrice: 'IranianSans, Yekan, sans-serif',
        fontEditorial: 'IranianSans, Tahoma, sans-serif',
        fontCta: 'Farhang, Yekan, IranianSans, sans-serif',
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
      value: ['categories'],
      defaultValue: ['categories'],
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.MODULE,
      label: 'بلوک‌های صفحه اصلی',
    },
    {
      key: 'hero_slider',
      value: {
        enabled: false,
        slides: [],
        autoplay: false,
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
      value: { enabled: false, text: { fa: '', en: '' }, link: '' },
      defaultValue: { enabled: false, text: { fa: '', en: '' }, link: '' },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'نوار اعلان هدر',
    },
    {
      key: 'banner_config',
      value: { enabled: false, label: { fa: '', en: '' }, title: { fa: '', en: '' }, subtitle: { fa: '', en: '' }, buttonText: { fa: '', en: '' }, buttonLink: '/products' },
      defaultValue: { enabled: false, label: { fa: '', en: '' }, title: { fa: '', en: '' }, subtitle: { fa: '', en: '' }, buttonText: { fa: '', en: '' }, buttonLink: '/products' },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'بنر تبلیغاتی صفحه اصلی',
    },
    {
      key: 'section_labels',
      value: {
        featured_products: { label: { fa: 'Featured', en: 'Featured' }, title: { fa: 'منتخب ویژه', en: '' }, subtitle: { fa: 'برگزیده‌های فصل', en: '' }, linkText: { fa: 'همه محصولات', en: '' } },
        categories: { label: { fa: 'Shop by Category', en: '' }, title: { fa: 'کالکشن‌های زنانه', en: '' }, subtitle: { fa: 'مانتو، تونیک، ست رسمی و شال و روسری', en: '' }, linkText: { fa: 'مشاهده همه', en: '' } },
        new_arrivals: { label: { fa: 'New In', en: 'New In' }, title: { fa: 'جدیدترین‌ها', en: 'New In' }, subtitle: { fa: 'New In', en: 'New In' }, linkText: { fa: 'مشاهده همه', en: 'View All' } },
        blog_posts: { label: { fa: 'Editorial', en: '' }, title: { fa: 'مجله مد', en: '' }, subtitle: { fa: 'ترندها و الهام استایل', en: '' }, linkText: { fa: 'همه مقالات', en: '' } },
        lookbook: { label: { fa: 'Lookbook', en: '' }, title: { fa: 'لوک‌بوک', en: '' }, subtitle: { fa: 'الهام استایل از مجموعه نکال', en: '' }, linkText: { fa: 'مشاهده همه', en: '' } },
        products_page: { label: { fa: '', en: '' }, title: { fa: 'فروشگاه', en: '' }, subtitle: { fa: '', en: '' } },
        blog_page: { label: { fa: 'Magazine', en: '' }, title: { fa: 'مجله مد نکال', en: '' }, subtitle: { fa: 'ترندها و راهنمای استایل', en: '' } },
      },
      defaultValue: {},
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'عناوین بخش‌های سایت',
    },
    {
      key: 'contact_info',
      value: {
        email: 'info@necoll.ir',
        phone: '',
        phoneDisplay: '',
        address: { fa: 'شیراز، مجتمع اهورا، طبقه همکف، پلاک ۹', en: 'Shiraz, Ahura Complex' },
        tagline: { fa: 'Be Your Best', en: 'Be Your Best' },
        brandSince: '2024',
        instagramHandle: 'necoll____',
        telegramHandle: 'necoll1234',
        branches: [],
      },
      defaultValue: { email: 'info@necoll.ir', phone: '', phoneDisplay: '', address: { fa: '', en: '' } },
      category: ConfigCategory.GENERAL,
      layer: ConfigLayer.MODULE,
      label: 'اطلاعات تماس',
    },
    {
      key: 'footer_services',
      value: [],
      defaultValue: [],
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'خدمات فوتر',
    },
    {
      key: 'lookbook_config',
      value: {
        enabled: false,
        pageTitle: { fa: 'لوک‌بوک', en: 'Lookbook' },
        pageSubtitle: { fa: '', en: '' },
        items: [],
      },
      defaultValue: { enabled: false, pageTitle: { fa: 'لوک‌بوک', en: '' }, pageSubtitle: { fa: '', en: '' }, items: [] },
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'لوک‌بوک',
    },
    {
      key: 'newsletter_config',
      value: { enabled: false, label: { fa: '', en: '' }, title: { fa: '', en: '' }, subtitle: { fa: '', en: '' }, placeholder: '', buttonText: { fa: '', en: '' } },
      defaultValue: { enabled: false, label: { fa: '', en: '' }, title: { fa: '', en: '' }, subtitle: { fa: '', en: '' }, placeholder: 'email', buttonText: { fa: '', en: '' } },
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
      value: { enabled: false, useNavigation: true, maxItems: 4 },
      defaultValue: { enabled: false, useNavigation: true, maxItems: 4 },
      category: ConfigCategory.NAVIGATION,
      layer: ConfigLayer.COMPONENT,
      label: 'ناوبری موبایل',
    },
    {
      key: 'category_display',
      value: {
        manteau: { image: '/images/categories/manteau.png' },
        'tunic-blouse': { image: '/images/categories/tunic-blouse.png' },
        'formal-set': { image: '/images/categories/formal-set.png' },
        'shawl-scarf': { image: '/images/categories/shawl-scarf.png' },
        clothing: { image: '/images/home/clothing.png' },
        scarves: { image: '/images/home/scarves.png' },
        accessories: { image: '/images/home/accessories.png' },
        sports: { image: '/images/home/sports.png' },
        'shoes-bags': { image: '/images/home/shoes-bags.png' },
        featured: { image: '/images/home/limited.png' },
        outlet: { image: '/images/home/outlet.png' },
        rosari: { image: '/images/categories/shawl-scarf.png' },
        shal: { image: '/images/categories/shawl-scarf.png' },
        socks: { image: '/images/home/accessories.png' },
        tote: { image: '/images/products/leather-bag-brown.png' },
      },
      defaultValue: {},
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'نمایش دسته‌بندی‌ها',
    },
    {
      key: 'home_categories',
      value: [
        { fa: 'جدید', en: 'New In', image: '/images/home/new-in.png', link: '/products' },
        { fa: 'لیمیتد کالکشن', en: 'Limited Collection', image: '/images/home/limited.png', link: '/products?featured=true' },
        { fa: 'پوشاک', en: 'Clothing', image: '/images/home/clothing.png', link: '/products?section=clothing' },
        { fa: 'روسری و شال', en: 'Scarves & Shawls', image: '/images/home/scarves.png', link: '/products?section=scarves' },
        { fa: 'کیف و کفش', en: 'Shoes & Bags', image: '/images/home/shoes-bags.png', link: '/products?section=shoes-bags' },
        { fa: 'ورزشی', en: 'Sports', image: '/images/home/sports.png', link: '/products?section=sports' },
        { fa: 'اکسسوری', en: 'Accessories', image: '/images/home/accessories.png', link: '/products?section=accessories' },
        { fa: 'اوت لت', en: 'Outlet', image: '/images/home/outlet.png', link: '/products?sale=true' },
      ],
      defaultValue: [],
      category: ConfigCategory.LAYOUT,
      layer: ConfigLayer.COMPONENT,
      label: 'دسته‌های صفحه اصلی',
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
        telegram: 'https://t.me/necoll1234',
        instagram: 'https://instagram.com/necoll____',
        whatsapp: '',
        bale: '',
        rubika: '',
      },
      defaultValue: {
        telegram: 'https://t.me/necoll1234',
        instagram: 'https://instagram.com/necoll____',
        whatsapp: '',
        bale: '',
        rubika: '',
      },
      category: ConfigCategory.SOCIAL,
      layer: ConfigLayer.MODULE,
      label: 'شبکه‌های اجتماعی',
    },
    {
      key: 'social_enabled',
      value: { telegram: true, instagram: true, whatsapp: false, bale: false, rubika: false },
      defaultValue: { telegram: true, instagram: true, whatsapp: false, bale: false, rubika: false },
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
      value: false,
      defaultValue: false,
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
        columns: [],
        links: [
          { label: 'همکاری با ما', url: '/partnership' },
          { label: 'شرایط و قوانین', url: '/terms' },
        ],
        trustBadgeImage: '/enamad.png',
        copyright: '© ۱۴۰۴ Necoll. تمامی حقوق محفوظ است.',
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

  const activeModules = new Set(['shop']);

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name, description: mod.description, sortOrder: mod.sortOrder, isActive: activeModules.has(mod.slug) },
      create: { ...mod, isActive: activeModules.has(mod.slug) },
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
    { slug: 'bags', name: { fa: 'کیف', en: 'Bags' }, image: '/images/products/leather-bag-brown.png', showInHeader: false, sortOrder: 5 },
    { slug: 'socks', name: { fa: 'جوراب', en: 'Socks' }, image: '/images/home/accessories.png', showInHeader: false, sortOrder: 6 },
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
      dynamicFields: { menuSection: 'clothing', size: 'M-L', color: 'مشکی', fabric: 'پارچه ترکیبی', country: 'ایران', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/pinstripe-suit-set.jpg'],
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
      dynamicFields: { menuSection: 'clothing', size: 'S-M', color: 'مشکی', fabric: 'کرپ', country: 'ایران' },
      images: ['/images/products/vani-mode-black-set.jpg'],
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
      dynamicFields: { menuSection: 'clothing', size: 'M', color: 'مشکی', fabric: 'ویسکوز پشم', country: 'ترکیه', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/gold-button-blazer-set.jpg'],
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
      dynamicFields: { menuSection: 'sports', menuItem: 'sport-set', size: 'M', color: 'مشکی', fabric: 'پارچه ترکیبی', country: 'ترکیه' },
      images: ['/images/products/geometric-blazer-set.jpg'],
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
      dynamicFields: { menuSection: 'sports', menuItem: 'sport-set', size: 'M-L', color: 'چندرنگ', fabric: 'پلی‌استر ویسکوز', country: 'ایران' },
      images: ['/images/products/artistic-print-jacket.jpg'],
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
      dynamicFields: { menuSection: 'sports', size: 'Free Size', color: 'مشکی', fabric: 'بافت ریز', country: 'ایران' },
      images: ['/images/products/altun-black-manteau.jpg'],
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
      dynamicFields: { menuSection: 'clothing', size: 'M-L', color: 'سرمه‌ای', fabric: 'نخ پنبه', country: 'ایران' },
      images: ['/images/products/navy-marble-tunic.jpg'],
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
      dynamicFields: { menuSection: 'clothing', size: 'S-M', color: 'سرمه‌ای', fabric: 'کرپ مخمل', country: 'ایران' },
      images: ['/images/products/navy-leaf-tunic.jpg'],
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
      dynamicFields: { menuSection: 'clothing', size: 'Free Size', color: 'زرد خردلی', fabric: 'کرپ با تور', country: 'ایران', warranty: '۷ روز مهلت تست' },
      images: ['/images/products/mustard-lace-manteau.jpg'],
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
      dynamicFields: { menuSection: 'scarves', menuItem: 'shal', color: 'مشکی و سفید', fabric: 'پشم مرینو', country: 'ترکیه' },
      images: ['/images/products/wool-scarf.jpg'],
    },
    {
      slug: 'silk-rosari',
      name: { fa: 'روسری ابریشمی گل‌دار', en: 'Floral Silk Scarf' },
      description: { fa: 'روسری ابریشمی سبک با طرح گل‌های ظریف. مناسب استایل روزمره و مهمانی.' },
      price: 390000,
      comparePrice: 490000,
      stock: 25,
      isFeatured: false,
      categoryId: categoryIds['shawl-scarf'],
      dynamicFields: { menuSection: 'scarves', menuItem: 'rosari', color: 'کرم و صورتی', fabric: 'ابریشم', country: 'ایران' },
      images: ['/images/products/silk-rosari.jpg'],
    },
    {
      slug: 'leather-bag-brown',
      name: { fa: 'کیف چرمی قهوه‌ای', en: 'Brown Leather Bag' },
      description: { fa: 'کیف دوشی چرم با بافت کروکودیل و زنجیر فلزی. طراحی شیک و مدرن — مکمل استایل رسمی و روزمره.' },
      price: 1200000,
      comparePrice: 1500000,
      stock: 8,
      isFeatured: false,
      categoryId: categoryIds.bags,
      dynamicFields: { menuSection: 'shoes-bags', menuItem: 'bags', color: 'قهوه‌ای', fabric: 'چرم مصنوعی', country: 'ایران', warranty: '۶ ماه' },
      images: ['/images/products/leather-bag-brown.jpg'],
    },
    {
      slug: 'cotton-socks-set',
      name: { fa: 'جوراب نخی سه‌تایی', en: 'Cotton Socks 3-Pack' },
      description: { fa: 'ست سه‌تایی جوراب نخی نرم و راحت در رنگ‌های خنثی. مناسب استفاده روزمره.' },
      price: 180000,
      comparePrice: 240000,
      stock: 40,
      isFeatured: false,
      categoryId: categoryIds.socks,
      dynamicFields: { menuSection: 'accessories', menuItem: 'socks', color: 'سفید و مشکی', fabric: 'نخ پنبه', country: 'ایران' },
      images: ['/images/products/cotton-socks-set.jpg'],
    },
    {
      slug: 'canvas-tote-bag',
      name: { fa: 'توت‌بگ کتان', en: 'Canvas Tote Bag' },
      description: { fa: 'توت‌بگ کتان سبک با بند دوشی. مناسب خرید روزانه و استایل کژوال.' },
      price: 420000,
      comparePrice: 520000,
      stock: 18,
      isFeatured: false,
      categoryId: categoryIds.bags,
      dynamicFields: { menuSection: 'accessories', menuItem: 'tote', color: 'بژ', fabric: 'کتان', country: 'ایران' },
      images: ['/images/products/canvas-tote-bag.jpg'],
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

  // ═══ Navigation (Monaie-style) ═══
  await prisma.navigationItem.updateMany({ data: { isActive: false } });

  async function upsertNavItem(
    item: { label: { fa: string; en: string }; url: string; sortOrder: number; isActive?: boolean },
    parentId?: string
  ) {
    const existing = await prisma.navigationItem.findFirst({
      where: { url: item.url, parentId: parentId ?? null },
    });
    const data = {
      label: item.label,
      url: item.url,
      sortOrder: item.sortOrder,
      isActive: item.isActive ?? true,
      parentId: parentId ?? null,
    };
    if (existing) {
      return prisma.navigationItem.update({ where: { id: existing.id }, data });
    }
    return prisma.navigationItem.create({ data });
  }

  const clothingParent = await upsertNavItem(
    { label: { fa: 'پوشاک', en: 'Clothing' }, url: '/products?section=clothing', sortOrder: 4 },
  );
  const scarvesParent = await upsertNavItem(
    { label: { fa: 'روسری و شال', en: 'Scarves & Shawls' }, url: '/products?section=scarves', sortOrder: 5 },
  );
  const accessoryParent = await upsertNavItem(
    { label: { fa: 'اکسسوری', en: 'Accessories' }, url: '/products?section=accessories', sortOrder: 6 },
  );
  const sportsParent = await upsertNavItem(
    { label: { fa: 'پوشاک ورزشی', en: 'Sports' }, url: '/products?section=sports', sortOrder: 7 },
  );
  const shoesParent = await upsertNavItem(
    { label: { fa: 'کیف و کفش', en: 'Shoes & Bags' }, url: '/products?section=shoes-bags', sortOrder: 8 },
  );

  const topNav = [
    { label: { fa: 'خانه', en: 'Home' }, url: '/', sortOrder: 1 },
    { label: { fa: 'فروشگاه', en: 'Shop' }, url: '/products', sortOrder: 2 },
    { label: { fa: 'لیمیتد کالکشن', en: 'Limited Collection' }, url: '/products?featured=true', sortOrder: 3 },
    { label: { fa: 'پشتیبانی', en: 'Support' }, url: '/contact', sortOrder: 9 },
    { label: { fa: 'درباره ما', en: 'About' }, url: '/about', sortOrder: 10 },
    { label: { fa: 'نکال کلاب', en: 'Necoll Club' }, url: '/club', sortOrder: 11 },
    { label: { fa: 'ورود / عضویت', en: 'Login' }, url: '/account', sortOrder: 12 },
  ];

  for (const item of topNav) {
    await upsertNavItem(item);
  }

  const clothingChildren = [
    { label: { fa: 'مانتو', en: 'Manteau' }, slug: 'manteau' },
    { label: { fa: 'تونیک و بلوز', en: 'Tunics & Blouses' }, slug: 'tunic-blouse' },
    { label: { fa: 'ست رسمی', en: 'Formal Sets' }, slug: 'formal-set' },
  ];
  for (const [i, child] of clothingChildren.entries()) {
    await upsertNavItem(
      {
        label: child.label,
        url: `/products?section=clothing&category=${categoryIds[child.slug]}`,
        sortOrder: i + 1,
      },
      clothingParent.id
    );
  }

  const scarvesChildren = [
    { label: { fa: 'روسری', en: 'Scarves' }, item: 'rosari' },
    { label: { fa: 'شال', en: 'Shawls' }, item: 'shal' },
  ];
  for (const [i, child] of scarvesChildren.entries()) {
    await upsertNavItem(
      {
        label: child.label,
        url: `/products?section=scarves&item=${child.item}&category=${categoryIds['shawl-scarf']}`,
        sortOrder: i + 1,
      },
      scarvesParent.id
    );
  }

  const accessoryChildren = [
    { label: { fa: 'جوراب', en: 'Socks' }, item: 'socks' },
    { label: { fa: 'توت‌بگ', en: 'Tote Bags' }, item: 'tote' },
  ];
  for (const [i, child] of accessoryChildren.entries()) {
    await upsertNavItem(
      {
        label: child.label,
        url: `/products?section=accessories&item=${child.item}`,
        sortOrder: i + 1,
      },
      accessoryParent.id
    );
  }

  const sportsChildren = [
    { label: { fa: 'ست ورزشی', en: 'Sport Sets' }, item: 'sport-set' },
    { label: { fa: 'مانتو', en: 'Manteau' }, slug: 'manteau' },
  ];
  for (const [i, child] of sportsChildren.entries()) {
    const url = child.item
      ? `/products?section=sports&item=${child.item}`
      : `/products?section=sports&category=${categoryIds[child.slug!]}`;
    await upsertNavItem(
      {
        label: child.label,
        url,
        sortOrder: i + 1,
      },
      sportsParent.id
    );
  }

  const shoesChildren = [
    { label: { fa: 'کیف', en: 'Bags' }, item: 'bags' },
    { label: { fa: 'کفش', en: 'Shoes' }, item: 'shoes' },
  ];
  for (const [i, child] of shoesChildren.entries()) {
    await upsertNavItem(
      {
        label: child.label,
        url: `/products?section=shoes-bags&item=${child.item}`,
        sortOrder: i + 1,
      },
      shoesParent.id
    );
  }

  const shopParentIds = [clothingParent.id, scarvesParent.id, accessoryParent.id, sportsParent.id, shoesParent.id];
  const legacyChildren = await prisma.navigationItem.findMany({
    where: { parentId: { in: shopParentIds } },
  });
  for (const child of legacyChildren) {
    const sectionMatch = child.url.match(/section=([^&]+)/);
    const parent = [clothingParent, scarvesParent, accessoryParent, sportsParent, shoesParent].find(
      (p) => p.id === child.parentId
    );
    const parentSection = parent?.url.match(/section=([^&]+)/)?.[1];
    const isLegacyCategoryOnly = child.url.startsWith('/products?category=') && !child.url.includes('section=');
    const isWrongSection = parentSection && sectionMatch && sectionMatch[1] !== parentSection;
    const isAccessoryRosari = parent?.id === accessoryParent.id && !child.url.includes('section=accessories');

    if (isLegacyCategoryOnly || isWrongSection || isAccessoryRosari) {
      await prisma.navigationItem.update({ where: { id: child.id }, data: { isActive: false } });
    }
  }

  await prisma.navigationItem.updateMany({
    where: {
      id: {
        in: [clothingParent.id, scarvesParent.id, accessoryParent.id, sportsParent.id, shoesParent.id],
      },
    },
    data: { isActive: true },
  });

  // ═══ Route Configs ═══
  const routes = [
    { path: '/', pageType: 'home', seoConfig: { title: 'صفحه اصلی' } },
    { path: '/products', pageType: 'product-list', seoConfig: { title: 'محصولات' } },
    { path: '/products/:slug', pageType: 'product-detail', seoConfig: { titleTemplate: '{product_name} | نکال' } },
    { path: '/lookbook', pageType: 'lookbook', seoConfig: { title: 'لوک‌بوک' } },
    { path: '/blog', pageType: 'blog-list', seoConfig: { title: 'مجله مد' } },
    { path: '/about', pageType: 'static', seoConfig: { title: 'درباره ما' } },
    { path: '/contact', pageType: 'static', seoConfig: { title: 'تماس با ما' } },
    { path: '/branches', pageType: 'static', seoConfig: { title: 'لیست شعب' } },
    { path: '/careers', pageType: 'static', seoConfig: { title: 'استخدام' } },
    { path: '/partnership', pageType: 'static', seoConfig: { title: 'همکاری با ما' } },
    { path: '/terms', pageType: 'static', seoConfig: { title: 'شرایط و قوانین' } },
    { path: '/club', pageType: 'static', seoConfig: { title: 'نکال کلاب' } },
    { path: '/account', pageType: 'static', seoConfig: { title: 'ورود / عضویت' } },
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
      name: 'تخفیف اولین خرید',
      description: 'کد تخفیف برای خرید اول',
      condition: { field: 'isFirstPurchase', operator: 'eq', value: true },
      action: { type: 'show_message', payload: { text: '۱۰٪ تخفیف اولین خرید!', code: 'FIRST10' } },
      priority: 8,
    },
  ];

  await prisma.businessRule.updateMany({
    where: { name: 'ارسال رایگان' },
    data: { isActive: false },
  });

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
