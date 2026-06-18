import { redirect } from 'next/navigation';

export default function ModulesRedirect() {
  redirect('/settings?tab=modules');
}
