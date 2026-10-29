import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';

interface FracterraMascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  altText?: string;
}

export const FracterraMascot: React.FC<FracterraMascotProps> = ({
  className = '',
  size = 'lg',
  showBadge = true,
  altText = 'Wasit Fracterra Robot Dayak Rimba Borneo',
}) => {
  const [imgErrorStage, setImgErrorStage] = useState<number>(0);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-60 h-60 sm:w-72 sm:h-72',
  };

  const getSource = () => {
    switch (imgErrorStage) {
      case 0:
        return ASSETS.fracterraReferee;
      case 1:
        return ASSETS.fracterraAlt;
      case 2:
        return ASSETS.publicFallbacks.fracterraReferee;
      case 3:
        return ASSETS.publicFallbacks.fracterraAlt;
      default:
        return null;
    }
  };

  const currentSrc = getSource();

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Glow highlight */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

      {/* Main Container */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-950 shadow-2xl flex items-center justify-center`}
      >
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={altText}
            className="w-full h-full object-cover object-top"
            onError={() => {
              // Advance to next fallback stage
              setImgErrorStage((prev) => prev + 1);
            }}
          />
        ) : (
          /* High-Fidelity Dayak Robot Mascot SVG Fallback */
          <div className="w-full h-full bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 flex flex-col items-center justify-center p-3 text-emerald-400">
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hornbill Feathers Headdress (Bulu Burung Enggang Dayak) */}
              <path
                d="M60 12 C52 2 40 8 46 26"
                stroke="#F59E0B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M60 12 C60 0 60 0 60 25"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M60 12 C68 2 80 8 74 26"
                stroke="#F59E0B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Dayak Headband / Ikat Kepala Motif Dayak */}
              <rect
                x="32"
                y="26"
                width="56"
                height="10"
                rx="3"
                fill="#B45309"
                stroke="#FCD34D"
                strokeWidth="1.5"
              />
              <circle cx="42" cy="31" r="2" fill="#FEF08A" />
              <circle cx="51" cy="31" r="2" fill="#FEF08A" />
              <circle cx="60" cy="31" r="2.5" fill="#EF4444" />
              <circle cx="69" cy="31" r="2" fill="#FEF08A" />
              <circle cx="78" cy="31" r="2" fill="#FEF08A" />

              {/* Robot Cyber-Chassis Head */}
              <rect
                x="36"
                y="36"
                width="48"
                height="42"
                rx="10"
                fill="#0F172A"
                stroke="#10B981"
                strokeWidth="2.5"
              />
              {/* Cyber Antenna Ears with beads */}
              <rect x="30" y="48" width="6" height="16" rx="2" fill="#047857" stroke="#34D399" />
              <rect x="84" y="48" width="6" height="16" rx="2" fill="#047857" stroke="#34D399" />

              {/* Dayak Face Warpaint Neon Tattoo (Motif Ukir Dayak) */}
              <path
                d="M40 50 Q46 54 44 60"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M80 50 Q74 54 76 60"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Robot Visor / Mata Hologram */}
              <rect
                x="44"
                y="46"
                width="32"
                height="14"
                rx="4"
                fill="#0284C7"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <circle cx="52" cy="53" r="3" fill="#E0F2FE" />
              <circle cx="68" cy="53" r="3" fill="#E0F2FE" />
              {/* Fractional Heart Grid in visor */}
              <line x1="60" y1="46" x2="60" y2="60" stroke="#0369A1" strokeWidth="1" />

              {/* Speaker / Mouth Grille */}
              <line x1="52" y1="68" x2="68" y2="68" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
              <line x1="55" y1="72" x2="65" y2="72" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />

              {/* Dayak Vest (Rompi Kulit Kayu & Manik-manik) */}
              <path
                d="M30 84 L90 84 L84 115 L36 115 Z"
                fill="#78350F"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Talawang Dayak Shield Medallion on chest */}
              <polygon
                points="60,88 68,98 65,110 60,113 55,110 52,98"
                fill="#1E293B"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              <text
                x="60"
                y="104"
                fontSize="7"
                fill="#FBBF24"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                1/2
              </text>
            </svg>
            <span className="text-[9px] font-black tracking-widest text-emerald-300 mt-1 uppercase">
              Fracterra
            </span>
          </div>
        )}
      </div>

      {/* Mascot Title Badge */}
      {showBadge && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-emerald-400 text-emerald-300 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider shadow-lg whitespace-nowrap z-20">
          FRACTERRA · WASIT RIMBA DAYAK
        </div>
      )}
    </div>
  );
};
