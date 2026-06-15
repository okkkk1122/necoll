'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { RotateCcw, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: unknown;
  defaultValue: unknown;
  category: string;
  layer: string;
  label: string | null;
  description: string | null;
  isActive: boolean;
  editableByAdmin: boolean;
}

export default function SettingEditor({
  setting,
  onUpdate,
  sandboxId,
}: {
  setting: Setting;
  onUpdate: () => void;
  sandboxId?: string;
}) {
  const [value, setValue] = useState(JSON.stringify(setting.value, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const parsed = JSON.parse(value);
      await api(`/config/settings/${setting.key}`, {
        method: 'PUT',
        body: JSON.stringify({ value: parsed, sandboxId }),
      });
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await api(`/config/settings/${setting.key}/reset`, {
        method: 'POST',
        body: JSON.stringify({ sandboxId }),
      });
      setValue(JSON.stringify(setting.defaultValue, null, 2));
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بازگشت');
    }
  };

  const handleToggle = async () => {
    try {
      await api(`/config/settings/${setting.key}/toggle`, { method: 'POST' });
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا');
    }
  };

  const isBoolean = typeof setting.value === 'boolean';

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{setting.label || setting.key}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {setting.key} • {setting.layer} • {setting.category}
          </p>
          {setting.description && (
            <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleToggle} className="text-gray-400 hover:text-gray-600">
            {setting.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
          </button>
        </div>
      </div>

      {isBoolean ? (
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const newVal = !setting.value;
              await api(`/config/settings/${setting.key}`, {
                method: 'PUT',
                body: JSON.stringify({ value: newVal, sandboxId }),
              });
              onUpdate();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              setting.value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {setting.value ? 'فعال' : 'غیرفعال'}
          </button>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="admin-input font-mono text-xs h-32 resize-y"
          dir="ltr"
          disabled={!setting.editableByAdmin}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {setting.editableByAdmin && !isBoolean && (
        <div className="flex gap-2 mt-3">
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary text-sm flex items-center gap-1">
            <Save size={14} />
            {saving ? 'ذخیره...' : 'ذخیره'}
          </button>
          <button onClick={handleReset} className="admin-btn-secondary text-sm flex items-center gap-1">
            <RotateCcw size={14} />
            بازگشت به پیش‌فرض
          </button>
        </div>
      )}
    </div>
  );
}
