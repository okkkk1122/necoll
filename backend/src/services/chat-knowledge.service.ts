import { prisma } from '../lib/prisma';
import { hyperConfig } from './hyperconfig.service';

type JsonRecord = Record<string, unknown>;

const CACHE_TTL_MS = 5 * 60 * 1000;

let knowledgeCache: { text: string; at: number } | null = null;

function asText(value: unknown, lang = 'fa'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const obj = value as JsonRecord;
    return String(obj[lang] || obj.en || '');
  }
  return String(value);
}

function formatToman(amount: unknown): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount ?? '');
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان';
}

function stripHtml(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export async function buildChatKnowledgeContext(): Promise<string> {
  if (knowledgeCache && Date.now() - knowledgeCache.at < CACHE_TTL_MS) {
    return knowledgeCache.text;
  }

  const [
    siteName,
    siteDesc,
    shipping,
    contact,
    minOrder,
    staticPages,
    footerServices,
    products,
    categories,
    blogPosts,
    coupons,
  ] = await Promise.all([
    hyperConfig.get('site_name'),
    hyperConfig.get('site_description'),
    hyperConfig.get('shipping_config'),
    hyperConfig.get('contact_info'),
    hyperConfig.get('min_order_amount'),
    hyperConfig.get('static_pages'),
    hyperConfig.get('footer_services'),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 40,
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.coupon.findMany({ where: { isActive: true }, take: 10 }),
  ]);

  const shippingCfg = (shipping || {}) as JsonRecord;
  const contactCfg = (contact || {}) as JsonRecord;
  const pages = (staticPages || {}) as Record<string, JsonRecord>;

  const lines: string[] = [
    '## فروشگاه',
    `نام: ${asText(siteName)}`,
    `توضیح: ${asText(siteDesc)}`,
    `آدرس سایت: /`,
    '',
    '## تماس و پشتیبانی',
    `ایمیل: ${contactCfg.email || 'info@necoll.ir'}`,
    `تلفن: ${contactCfg.phoneDisplay || contactCfg.phone || '۰۲۱-۱۲۳۴۵۶۷۸'}`,
    `آدرس: ${asText(contactCfg.address)}`,
    '',
    '## ارسال و سفارش',
    `هزینه پایه ارسال: ${formatToman(shippingCfg.baseCost || 50000)}`,
    `ارسال رایگان: سفارش‌های بالای ${formatToman(shippingCfg.freeThreshold || 1000000)}`,
    `زمان تحویل: ${shippingCfg.estimatedDays || '2-5'} روز کاری`,
    `حداقل مبلغ سفارش: ${formatToman(minOrder || 100000)}`,
    'راهنمای ارسال: /blog/free-shipping-guide',
    '',
    '## مرجوعی',
    'مهلت مرجوعی: ۷ روز پس از دریافت کالا',
    'شرایط: کالا در بسته‌بندی اصلی، بدون استفاده و با برچسب سالم',
    'راهنمای مرجوعی: /blog/return-policy',
    '',
    '## کدهای تخفیف',
  ];

  if (coupons.length === 0) {
    lines.push('کد تخفیف فعال در حال حاضر ثبت نشده است.');
  } else {
    for (const c of coupons) {
      const min = c.minOrder ? ` (حداقل سفارش ${formatToman(c.minOrder)})` : '';
      const discount =
        c.discountType === 'percentage'
          ? `${Number(c.discountValue)}٪`
          : formatToman(c.discountValue);
      lines.push(`- ${c.code}: ${discount} تخفیف${min}`);
    }
  }

  lines.push('', '## دسته‌بندی‌ها');
  for (const cat of categories) {
    lines.push(`- ${asText(cat.name)} → /products?category=${cat.slug}`);
  }

  lines.push('', '## محصولات (قیمت به تومان)');
  for (const p of products) {
    const name = asText(p.name);
    const catName = p.category ? asText(p.category.name) : 'بدون دسته';
    const stock = p.stock > 0 ? 'موجود' : 'ناموجود';
    const featured = p.isFeatured ? ' [ویژه]' : '';
    const desc = stripHtml(asText(p.description)).slice(0, 120);
    lines.push(
      `- ${name}${featured} | ${formatToman(p.price)} | ${stock} | دسته: ${catName} | لینک: /products/${p.slug}${desc ? ` | ${desc}` : ''}`
    );
  }

  lines.push('', '## مقالات و راهنماها');
  for (const post of blogPosts) {
    const excerpt = stripHtml(asText(post.excerpt) || asText(post.content)).slice(0, 200);
    lines.push(`- ${asText(post.title)} → /blog/${post.slug}`);
    if (excerpt) lines.push(`  خلاصه: ${excerpt}`);
  }

  if (pages.about) {
    lines.push('', '## درباره ما', stripHtml(asText(pages.about.content)).slice(0, 400), 'لینک: /about');
  }

  const services = footerServices as Array<JsonRecord> | undefined;
  if (Array.isArray(services) && services.length > 0) {
    lines.push('', '## خدمات');
    for (const s of services) lines.push(`- ${asText(s)}`);
  }

  const text = lines.join('\n');
  knowledgeCache = { text, at: Date.now() };
  return text;
}

export function clearChatKnowledgeCache(): void {
  knowledgeCache = null;
}

export async function findRelevantProducts(query: string, limit = 5) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 40,
  });

  const scored = products
    .map((p) => {
      const name = asText(p.name).toLowerCase();
      const slug = p.slug.toLowerCase();
      const cat = p.category ? asText(p.category.name).toLowerCase() : '';
      const desc = asText(p.description).toLowerCase();
      let score = 0;
      if (name.includes(q) || slug.includes(q)) score += 10;
      if (cat.includes(q)) score += 5;
      for (const word of q.split(/\s+/).filter((w) => w.length > 2)) {
        if (name.includes(word)) score += 4;
        if (desc.includes(word)) score += 2;
        if (cat.includes(word)) score += 3;
      }
      if (q.includes('مانتو') && (name.includes('مانتو') || cat.includes('مانتو'))) score += 6;
      if (q.includes('تونیک') && (name.includes('تونیک') || cat.includes('تونیک'))) score += 6;
      if (q.includes('شال') && (name.includes('شال') || name.includes('روسری'))) score += 6;
      if (q.includes('کیف') && name.includes('کیف')) score += 6;
      if (q.includes('ست') && name.includes('ست')) score += 4;
      return { product: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.product);
}

export async function generateKnowledgeBasedResponse(message: string): Promise<string> {
  const lower = message.toLowerCase();
  const [shipping, contact, coupons] = await Promise.all([
    hyperConfig.get('shipping_config'),
    hyperConfig.get('contact_info'),
    prisma.coupon.findMany({ where: { isActive: true }, take: 5 }),
  ]);
  const shippingCfg = (shipping || {}) as JsonRecord;
  const contactCfg = (contact || {}) as JsonRecord;

  if (lower.includes('سلام') || lower.includes('درود') || lower.includes('هی')) {
    return 'سلام! من دستیار هوشمند نکال هستم 🌸 می‌تونم درباره محصولات، قیمت‌ها، ارسال، تخفیف و مرجوعی راهنماییتون کنم. چه سوالی دارید؟';
  }

  if (lower.includes('ارسال') || lower.includes('پست') || lower.includes('تحویل')) {
    return `📦 **ارسال نکال**
• زمان تحویل: ${shippingCfg.estimatedDays || '2-5'} روز کاری
• هزینه پایه: ${formatToman(shippingCfg.baseCost || 50000)}
• ارسال رایگان برای سفارش‌های بالای ${formatToman(shippingCfg.freeThreshold || 1000000)}
• جزئیات بیشتر: /blog/free-shipping-guide`;
  }

  if (lower.includes('مرجوع') || lower.includes('بازگشت') || lower.includes('تعویض')) {
    return `↩️ **مرجوعی کالا**
• مهلت: ۷ روز پس از دریافت
• شرایط: بسته‌بندی اصلی، بدون استفاده، برچسب سالم
• راهنمای کامل: /blog/return-policy
• پشتیبانی: ${contactCfg.email || 'info@necoll.ir'}`;
  }

  if (lower.includes('تخفیف') || lower.includes('کد') || lower.includes('کوپن')) {
    if (coupons.length === 0) {
      return 'در حال حاضر کد تخفیف فعالی ثبت نشده. خبرنامه را دنبال کنید تا از تخفیف‌ها باخبر شوید.';
    }
    const list = coupons
      .map((c) => {
        const discount =
          c.discountType === 'percentage'
            ? `${Number(c.discountValue)}٪`
            : formatToman(c.discountValue);
        const min = c.minOrder ? ` (حداقل ${formatToman(c.minOrder)})` : '';
        return `• کد **${c.code}**: ${discount} تخفیف${min}`;
      })
      .join('\n');
    return `🎁 **کدهای تخفیف فعال:**\n${list}\n\nکد را در صفحه پرداخت وارد کنید.`;
  }

  if (lower.includes('تماس') || lower.includes('پشتیبانی') || lower.includes('شماره') || lower.includes('ایمیل')) {
    return `📞 **تماس با نکال**
• تلفن: ${contactCfg.phoneDisplay || contactCfg.phone || '۰۲۱-۱۲۳۴۵۶۷۸'}
• ایمیل: ${contactCfg.email || 'info@necoll.ir'}
• صفحه تماس: /contact`;
  }

  if (
    lower.includes('محصول') ||
    lower.includes('پیشنهاد') ||
    lower.includes('مانتو') ||
    lower.includes('تونیک') ||
    lower.includes('شال') ||
    lower.includes('کیف') ||
    lower.includes('ست') ||
    lower.includes('قیمت') ||
    lower.includes('خرید')
  ) {
    const matches = await findRelevantProducts(message, 4);
    if (matches.length > 0) {
      const list = matches
        .map((p) => {
          const stock = p.stock > 0 ? '✅ موجود' : '❌ ناموجود';
          return `• **${asText(p.name)}** — ${formatToman(p.price)} — ${stock}\n  /products/${p.slug}`;
        })
        .join('\n\n');
      return `بر اساس جستجوی شما این محصولات را پیشنهاد می‌کنم:\n\n${list}\n\nبرای مشاهده همه محصولات: /products`;
    }
    const featured = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 4,
    });
    if (featured.length > 0) {
      const list = featured
        .map(
          (p) =>
            `• **${asText(p.name)}** — ${formatToman(p.price)} → /products/${p.slug}`
        )
        .join('\n');
      return `محصول دقیقی پیدا نکردم، اما این پیشنهادهای ویژه را ببینید:\n\n${list}`;
    }
  }

  if (lower.includes('درباره') || lower.includes('نکال') || lower.includes('کی هست')) {
    const siteDesc = await hyperConfig.get('site_description');
    return `${asText(siteDesc) || 'نکال بوتیک آنلاین پوشاک زنانه است.'}\n\nبیشتر بدانید: /about`;
  }

  return 'ممنون از پیام شما! می‌تونم درباره **محصولات**، **ارسال**، **تخفیف**، **مرجوعی** و **تماس** راهنماییتون کنم. سوال مشخص‌تری بپرسید یا با پشتیبانی تماس بگیرید: /contact';
}
