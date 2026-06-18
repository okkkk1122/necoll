'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import Link from 'next/link';
import { routes } from '@/lib/paths';
import { Plus, ToggleLeft, ToggleRight, Trash2, Pencil } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: { fa: string };
  isPublished: boolean;
  createdAt: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api<BlogPost[]>('/blog?published=false').then(setPosts);
  }, []);

  const togglePublish = async (id: string, isPublished: boolean) => {
    await api(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: !isPublished } : p)));
  };

  const remove = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await api(`/blog/${id}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">مدیریت وبلاگ</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} مقاله</p>
        </div>
        <Link href={routes.blogEdit} className="admin-btn-primary flex items-center gap-1">
          <Plus size={16} /> مقاله جدید
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="admin-card flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{post.title.fa}</h3>
              <p className="text-xs text-gray-400">{post.slug} • {new Date(post.createdAt).toLocaleDateString('fa-IR')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`${routes.blogEdit}?slug=${post.slug}`} className="text-gray-500 hover:text-admin-primary">
                <Pencil size={18} />
              </Link>
              <button onClick={() => togglePublish(post.id, post.isPublished)}>
                {post.isPublished ? (
                  <ToggleRight size={24} className="text-green-500" />
                ) : (
                  <ToggleLeft size={24} className="text-gray-400" />
                )}
              </button>
              <button onClick={() => remove(post.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
