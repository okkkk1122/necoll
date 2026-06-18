import { redirect } from 'next/navigation';

export default function ProductFieldsRedirect() {
  redirect('/products?tab=fields');
}
