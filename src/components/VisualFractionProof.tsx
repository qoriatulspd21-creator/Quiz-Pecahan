import React from 'react';
import { Fraction } from '../types/game';

interface VisualFractionProofProps {
  f1: Fraction;
  f2?: Fraction;
  type?: 'bar' | 'circle' | 'numberline';
  label1?: string;
  label2?: string;
}

export const VisualFractionProof: React.FC<VisualFractionProofProps> = ({
  f1,
  f2,
  type = 'bar',
  label1,
  label2,
}) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col gap-5">
        {/* First Fraction Visual */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="text-cyan-400 font-bold text-sm">
              {label1 || `Pecahan 1: ${f1.num}/${f1.den}`}
            </span>
            <span className="text-slate-400">
              {f1.num} dari {f1.den} bagian terisi
            </span>
          </div>

          {type === 'bar' && <FractionBar fraction={f1} color="from-cyan-500 to-blue-600" />}
          {type === 'circle' && <FractionPie fraction={f1} color="#06b6d4" />}
          {type === 'numberline' && <FractionNumberLine fraction={f1} dotColor="#06b6d4" />}
        </div>

        {/* Second Fraction Visual (if provided) */}
        {f2 && (
          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="text-orange-400 font-bold text-sm">
                {label2 || `Pecahan 2: ${f2.num}/${f2.den}`}
              </span>
              <span className="text-slate-400">
                {f2.num} dari {f2.den} bagian terisi
              </span>
            </div>

            {type === 'bar' && <FractionBar fraction={f2} color="from-orange-500 to-amber-600" />}
            {type === 'circle' && <FractionPie fraction={f2} color="#f97316" />}
            {type === 'numberline' && <FractionNumberLine fraction={f2} dotColor="#f97316" />}
          </div>
        )}
      </div>
    </div>
  );
};

// Fraction Bar Component
const FractionBar: React.FC<{ fraction: Fraction; color: string }> = ({ fraction, color }) => {
  const parts = Math.max(1, fraction.den);
  const filled = Math.min(fraction.num, parts);

  return (
    <div className="w-full h-8 bg-slate-950 border border-slate-700 rounded-lg overflow-hidden flex shadow-inner">
      {Array.from({ length: parts }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full border-r border-slate-800 last:border-r-0 transition-all duration-300 flex items-center justify-center text-[10px] font-mono ${
            i < filled
              ? `bg-gradient-to-r ${color} text-white font-bold shadow-sm`
              : 'bg-slate-900/60 text-slate-600'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

// Fraction Pie Component (SVG Circle)
const FractionPie: React.FC<{ fraction: Fraction; color: string }> = ({ fraction, color }) => {
  const parts = Math.max(1, fraction.den);
  const filled = Math.min(fraction.num, parts);
  const radius = 45;
  const center = 50;

  // Generate pie slices
  const slices = Array.from({ length: parts }).map((_, i) => {
    const startAngle = (i * 2 * Math.PI) / parts - Math.PI / 2;
    const endAngle = ((i + 1) * 2 * Math.PI) / parts - Math.PI / 2;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const isFilled = i < filled;

    return (
      <path
        key={i}
        d={pathData}
        fill={isFilled ? color : '#1e293b'}
        stroke="#0f172a"
        strokeWidth="1.5"
        className="transition-colors duration-300"
      />
    );
  });

  return (
    <div className="flex items-center justify-center py-1">
      <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
        <circle cx={center} cy={center} r={radius} fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {slices}
      </svg>
    </div>
  );
};

// Fraction Number Line Component
const FractionNumberLine: React.FC<{ fraction: Fraction; dotColor: string }> = ({ fraction, dotColor }) => {
  const parts = Math.max(1, fraction.den);
  const valueRatio = Math.min(1, Math.max(0, fraction.num / parts));

  return (
    <div className="w-full px-2 py-3">
      <div className="relative w-full h-8 flex items-center">
        {/* Main horizontal line */}
        <div className="absolute left-0 right-0 h-1.5 bg-slate-700 rounded-full" />
        
        {/* Shaded progress line from 0 to fraction value */}
        <div
          className="absolute left-0 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${valueRatio * 100}%`, backgroundColor: dotColor }}
        />

        {/* Division tick marks */}
        {Array.from({ length: parts + 1 }).map((_, i) => {
          const tickPercent = (i / parts) * 100;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center -translate-x-1/2"
              style={{ left: `${tickPercent}%` }}
            >
              <div className="w-0.5 h-3 bg-slate-400" />
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                {i === 0 ? '0' : i === parts ? '1' : `${i}/${parts}`}
              </span>
            </div>
          );
        })}

        {/* Value indicator marker */}
        <div
          className="absolute -translate-x-1/2 -top-1 transition-all duration-300 flex flex-col items-center z-10"
          style={{ left: `${valueRatio * 100}%` }}
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce"
            style={{ backgroundColor: dotColor }}
          />
        </div>
      </div>
    </div>
  );
};
