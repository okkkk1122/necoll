import type { Metadata } from 'next';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'پنل مدیریت نکال | HyperConfig',
  description: 'سیستم مدیریت فوق‌العاده قدرتمند نکال',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
