'use client';

import React, { useState } from 'react';
import { Check, X, Edit2, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InlineEditProps {
  value: string | number;
  onSave: (newValue: string | number) => Promise<void>;
  type?: 'text' | 'number' | 'textarea';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  canEdit?: boolean;
  label?: string;
  icon?: React.ReactNode;
}

export function InlineEdit({
  value,
  onSave,
  type = 'text',
  placeholder,
  className,
  disabled = false,
  canEdit = true,
  label,
  icon
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (editValue === String(value)) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const finalValue = type === 'number' ? Number(editValue) : editValue;
      await onSave(finalValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!canEdit || disabled) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {icon && <div className="text-slate-500">{icon}</div>}
        <div>
          {label && <p className="text-sm text-slate-500">{label}</p>}
          <p className="font-medium text-slate-900">{value}</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <p className="text-sm text-slate-500">{label}</p>}
        <div className="flex items-center space-x-2">
          {icon && <div className="text-slate-500">{icon}</div>}
          <div className="flex-1">
            {type === 'textarea' ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            )}
            {error && (
              <p className="text-sm text-danger mt-1">{error}</p>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2 group", className)}>
      {icon && <div className="text-slate-500">{icon}</div>}
      <div className="flex-1">
        {label && <p className="text-sm text-slate-500">{label}</p>}
        <p className="font-medium text-slate-900">{value}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );
}

