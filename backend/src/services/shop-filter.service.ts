import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

/** Category slugs grouped by top-level shop menu section */
export const MENU_SECTION_CATEGORIES: Record<string, string[]> = {
  clothing: ['manteau', 'tunic-blouse', 'formal-set'],
  scarves: ['shawl-scarf'],
};

export interface ShopQueryParams {
  category?: string;
  featured?: string;
  search?: string;
  section?: string;
  item?: string;
  sale?: string;
}

function jsonEquals(path: string[], value: string): Prisma.ProductWhereInput {
  return {
    dynamicFields: {
      path,
      equals: value,
    },
  };
}

export async function buildShopProductWhere(
  query: ShopQueryParams
): Promise<Prisma.ProductWhereInput> {
  const where: Prisma.ProductWhereInput = { isActive: true };
  const and: Prisma.ProductWhereInput[] = [];

  if (query.search) {
    and.push({
      slug: { contains: query.search, mode: 'insensitive' },
    });
  }

  if (query.featured === 'true') {
    and.push({ isFeatured: true });
    return and.length ? { ...where, AND: and } : where;
  }

  if (query.sale === 'true') {
    and.push({ comparePrice: { not: null } });
    return and.length ? { ...where, AND: and } : where;
  }

  if (query.category) {
    and.push({ categoryId: query.category });
  }

  if (query.section) {
    const section = query.section;
    const sectionCategories = MENU_SECTION_CATEGORIES[section];

    if (query.item) {
      and.push(jsonEquals(['menuSection'], section));
      and.push(jsonEquals(['menuItem'], query.item));
    } else if (query.category) {
      and.push(jsonEquals(['menuSection'], section));
    } else if (sectionCategories?.length) {
      const categories = await prisma.category.findMany({
        where: { slug: { in: sectionCategories }, isActive: true },
        select: { id: true },
      });
      if (categories.length) {
        and.push({ categoryId: { in: categories.map((cat) => cat.id) } });
      } else {
        and.push({ categoryId: { in: [] } });
      }
    } else {
      and.push(jsonEquals(['menuSection'], section));
    }
  }

  if (and.length) {
    where.AND = and;
  }

  return where;
}

export function applySaleFilter<T extends { price: unknown; comparePrice: unknown | null }>(
  products: T[]
): T[] {
  return products.filter((product) => {
    if (product.comparePrice == null) return false;
    return Number(product.comparePrice) > Number(product.price);
  });
}
