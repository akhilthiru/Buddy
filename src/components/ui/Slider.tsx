import React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueFormatter = (v) => `${v}`,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn('w-full flex flex-col gap-2 select-none', className)}>
      <div className="flex items-center justify-between text-sm">
        {label && <span className="font-semibold text-slate-700">{label}</span>}
        <span className="font-bold text-teal-700">{valueFormatter(value)}</span>
      </div>

      <div className="relative flex items-center h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label || 'Slider control'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          style={{
            background: `linear-gradient(to right, #0D9488 0%, #0D9488 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>{valueFormatter(min)}</span>
        <span>{valueFormatter(max)}</span>
      </div>
    </div>
  );
};
