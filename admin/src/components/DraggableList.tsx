'use client';

import { useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';

export interface DraggableItem {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  isActive?: boolean;
}

interface DraggableListProps {
  items: DraggableItem[];
  onReorder: (items: DraggableItem[]) => void;
  onToggle?: (id: string) => void;
  renderActions?: (item: DraggableItem) => React.ReactNode;
}

export default function DraggableList({ items, onReorder, onToggle, renderActions }: DraggableListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    dragNode.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    setDraggedId(null);
    setOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) setOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const fromIndex = items.findIndex((i) => i.id === draggedId);
    const toIndex = items.findIndex((i) => i.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    onReorder(newItems);
    setDraggedId(null);
    setOverId(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id)}
          className={clsx(
            'flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing',
            overId === item.id && draggedId !== item.id
              ? 'border-admin-accent bg-blue-50'
              : 'border-transparent',
            item.isActive === false && 'opacity-50'
          )}
        >
          <GripVertical size={18} className="text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm">{item.label}</span>
            {item.sublabel && (
              <span className="text-xs text-gray-400 mr-2">{item.sublabel}</span>
            )}
            {item.badge && (
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full mr-2">{item.badge}</span>
            )}
          </div>
          {onToggle && (
            <button
              onClick={() => onToggle(item.id)}
              className={clsx(
                'text-xs px-2 py-1 rounded-full',
                item.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              )}
            >
              {item.isActive !== false ? 'فعال' : 'غیرفعال'}
            </button>
          )}
          {renderActions?.(item)}
        </div>
      ))}
    </div>
  );
}
