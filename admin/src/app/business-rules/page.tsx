import { redirect } from 'next/navigation';

export default function BusinessRulesRedirect() {
  redirect('/settings?tab=rules');
}
