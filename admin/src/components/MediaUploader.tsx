'use client';

import { useState } from 'react';
import { Upload, Check, X, Film } from 'lucide-react';

interface Props {
  folder?: string;
  accept?: 'image' | 'video' | 'both';
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export default function MediaUploader({ folder = 'general', accept = 'image', currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState('');

  const acceptTypes =
    accept === 'video' ? 'video/mp4,video/webm,video/quicktime' :
    accept === 'both' ? 'image/*,video/mp4,video/webm' : 'image/*';

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
      setPreview(data.publicUrl || data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = preview?.includes('/uploads/') && accept !== 'image';

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
      {preview ? (
        <div className="relative inline-block">
          {preview.match(/\.(mp4|webm|mov)/i) || accept === 'video' ? (
            <video src={preview} className="max-h-32 rounded-lg mx-auto" muted />
          ) : (
            <img src={preview.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${preview}` : preview} alt="preview" className="max-h-32 rounded-lg mx-auto" />
          )}
          {uploading && <p className="text-sm text-gray-500 mt-2">در حال آپلود...</p>}
          {!uploading && !error && <Check size={20} className="text-green-500 mx-auto mt-2" />}
          {error && <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1"><X size={14} />{error}</p>}
        </div>
      ) : (
        <label className="cursor-pointer">
          {accept === 'video' ? <Film size={28} className="mx-auto text-gray-400 mb-2" /> : <Upload size={28} className="mx-auto text-gray-400 mb-2" />}
          <p className="text-sm text-gray-500">آپلود {accept === 'video' ? 'ویدیو' : accept === 'both' ? 'تصویر/ویدیو' : 'تصویر'}</p>
          <input type="file" accept={acceptTypes} onChange={handleFile} className="hidden" />
        </label>
      )}
    </div>
  );
}
