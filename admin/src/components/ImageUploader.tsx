'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Upload, Check, X } from 'lucide-react';

interface Props {
  folder?: string;
  onUploaded: (url: string) => void;
}

export default function ImageUploader({ folder = 'products', onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const token = localStorage.getItem('admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploaded(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="preview" className="max-h-32 rounded-lg mx-auto" />
          {uploading && <p className="text-sm text-gray-500 mt-2">در حال آپلود...</p>}
          {!uploading && !error && (
            <Check size={20} className="text-green-500 mx-auto mt-2" />
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
              <X size={14} /> {error}
            </p>
          )}
        </div>
      ) : (
        <label className="cursor-pointer">
          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">کلیک کنید یا فایل را بکشید</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — حداکثر ۱۰MB</p>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      )}
    </div>
  );
}
