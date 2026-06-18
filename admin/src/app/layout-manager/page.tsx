import { redirect } from 'next/navigation';

export default function LayoutRedirect() {
  redirect('/content?tab=layout');
}
