import React from 'react';
import { Fraction } from '../types/game';

interface FractionCardProps {
  fraction: Fraction;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'blue' | 'orange' | 'purple' | 'green' | 'success' | 'error' | 'intruder';
  showBadge?: string;
  className?: string;
}

export const FractionCard: React.FC<FractionCardProps> = ({
  fraction,
  isSelected = false,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  showBadge,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-18 text-base',
    md: 'w-18 h-24 text-xl sm:w-20 sm:h-26 sm:text-2xl',
    lg: 'w-24 h-32 text-2xl sm:w-28 sm:h-36 sm:text-3xl',
    xl: 'w-32 h-44 text-3xl sm:w-36 sm:h-48 sm:text-4xl',
  };

  const barClasses = {
    sm: 'w-6 h-0.5 my-0.5',
    md: 'w-8 h-1 my-1',
    lg: 'w-12 h-1 my-1.5',
    xl: 'w-16 h-1.5 my-2',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'bg-gradient-to-b from-sky-950/80 to-blue-900/90 border-sky-400 text-sky-100 shadow-sky-500/20';
      case 'orange':
        return 'bg-gradient-to-b from-amber-950/80 to-orange-900/90 border-orange-400 text-orange-100 shadow-orange-500/20';
      case 'purple':
        return 'bg-gradient-to-b from-purple-950/80 to-violet-900/90 border-purple-400 text-purple-100 shadow-purple-500/20';
      case 'green':
        return 'bg-gradient-to-b from-emerald-950/80 to-teal-900/90 border-emerald-400 text-emerald-100 shadow-emerald-500/20';
      case 'success':
        return 'bg-gradient-to-b from-emerald-900/90 to-teal-950 border-emerald-400 text-emerald-200 shadow-emerald-500/30';
      case 'error':
        return 'bg-gradient-to-b from-red-950 to-rose-900/90 border-rose-500 text-rose-200 shadow-rose-500/30';
      case 'intruder':
        return 'bg-gradient-to-b from-amber-950 to-red-950 border-amber-500 text-amber-200 shadow-amber-500/30';
      default:
        return 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-cyan-500/50 text-cyan-50 hover:border-cyan-400 shadow-cyan-500/10';
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      draggable={!disabled && !!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        relative select-none rounded-xl border-2 flex flex-col items-center justify-center
        transition-all duration-150 cursor-pointer shadow-lg active:scale-95
        ${sizeClasses[size]}
        ${getVariantStyles()}
        ${isSelected ? 'ring-4 ring-cyan-300 ring-offset-2 ring-offset-slate-950 scale-105 border-white shadow-cyan-400/50' : ''}
        ${isDragging ? 'opacity-40 scale-95' : 'hover:scale-102'}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Subtle Holographic Glare Corner */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-current opacity-40 rounded-tl pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-current opacity-40 rounded-br pointer-events-none" />

      {showBadge && (
        <span className="absolute -top-2.5 px-1.5 py-0.5 text-[10px] font-bold bg-slate-900 text-cyan-300 border border-cyan-400 rounded">
          {showBadge}
        </span>
      )}

      {/* Vertical Fraction Display */}
      <div className="flex flex-col items-center justify-center leading-none font-bold font-mono tracking-tight">
        <span className="tabular-nums">{fraction.num}</span>
        <span className={`bg-current ${barClasses[size]}`} />
        <span className="tabular-nums">{fraction.den}</span>
      </div>
    </div>
  );
};
