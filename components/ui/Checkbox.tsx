import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Checkbox({ className, label, error, ...props }: CheckboxProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-2',
            error && 'border-danger',
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
