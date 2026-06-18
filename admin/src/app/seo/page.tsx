import { redirect } from 'next/navigation';

export default function SeoRedirect() {
  redirect('/settings?tab=seo');
}
