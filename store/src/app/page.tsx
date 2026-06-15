import { fetchAPI } from '@/lib/api';

import HomeBlocks from '@/components/HomeBlocks';



interface Product {

  id: string;

  slug: string;

  name: { fa: string };

  price: number;

  comparePrice?: number;

  images: string[];

  stock: number;

  badges?: Array<{ type: string; payload: Record<string, unknown> }>;

}



async function getProducts(featured?: boolean) {

  try {

    const params = featured ? '?featured=true&limit=8' : '?limit=8';

    const data = await fetchAPI<{ products: Product[] }>(`/products${params}`);

    return data.products;

  } catch {

    return [];

  }

}



async function getCategories() {

  try {

    return await fetchAPI<Array<{ id: string; slug: string; name: { fa: string } }>>('/categories');

  } catch {

    return [];

  }

}



export default async function HomePage() {

  let blogPosts: Array<{ id: string; slug: string; title: { fa: string }; excerpt?: { fa: string }; image?: string | null }> = [];

  try {

    blogPosts = await fetchAPI('/blog');

  } catch { /* empty */ }



  const [featuredProducts, categories, newProducts] = await Promise.all([

    getProducts(true),

    getCategories(),

    getProducts(false),

  ]);



  return (

    <HomeBlocks

      featuredProducts={featuredProducts}

      newProducts={newProducts}

      categories={categories}

      blogPosts={blogPosts}

    />

  );

}


