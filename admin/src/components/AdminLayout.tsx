'use client';

import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 mr-64 p-8">{children}</main>
    </div>
  );
}
