import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Settings, Home, BookOpen } from 'lucide-react';
import { GameView } from '../types/game';

interface NavbarProps {
  currentView: GameView;
  onNavigate: (view: GameView) => void;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  isMatchActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  soundEnabled,
  bgmEnabled,
  onToggleSound,
  onToggleBgm,
  isMatchActive = false,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 text-slate-100">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onNavigate('MAIN_MENU')}
        className="flex items-center gap-2 text-base sm:text-lg font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
        FRACTION CHAMPIONS
      </button>

      {/* Zone 2: 4-5 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wide text-slate-300">
        <button
          onClick={() => onNavigate('MAIN_MENU')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 ${
            currentView === 'MAIN_MENU' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('PRACTICE')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 ${
            currentView === 'PRACTICE' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Latihan Bebas</span>
        </button>

        <button
          onClick={() => onNavigate('HOW_TO_PLAY')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 ${
            currentView === 'HOW_TO_PLAY' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Cara Bermain</span>
        </button>

        <button
          onClick={() => onNavigate('TEACHER_SETTINGS')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 ${
            currentView === 'TEACHER_SETTINGS' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Guru</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action area */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Efek Suara Aktif' : 'Efek Suara Senyap'}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-800 border-cyan-500/40 text-cyan-300 hover:bg-slate-700'
              : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Music Synth Toggle */}
        <button
          onClick={onToggleBgm}
          title={bgmEnabled ? 'BGM Musik Aktif' : 'BGM Musik Senyap'}
          className={`p-2 rounded-lg border transition-colors ${
            bgmEnabled
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 animate-pulse'
              : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-400'
          }`}
        >
          <Music className="w-4 h-4" />
        </button>

        {/* Active Game Shortcut */}
        {isMatchActive && currentView !== 'IN_ROUND' && (
          <button
            onClick={() => onNavigate('IN_ROUND')}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:brightness-110 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0"
          >
            Lanjut Tanding
          </button>
        )}
      </div>
    </header>
  );
};
