import { redirect } from 'next/navigation';

export default function ThemeRedirect() {
  redirect('/content?tab=theme');
}
