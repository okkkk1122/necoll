import { redirect } from 'next/navigation';

export default function NewsletterRedirect() {
  redirect('/messages?tab=newsletter');
}
