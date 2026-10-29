import React from 'react';
import { Trophy, Play, BookOpen, Settings, HelpCircle, Shield, Sparkles, Award } from 'lucide-react';
import { GameView } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface MainMenuProps {
  onNavigate: (view: GameView) => void;
  isMatchActive: boolean;
  onContinueMatch: () => void;
  onStartNewMatch: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  isMatchActive,
  onContinueMatch,
  onStartNewMatch,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden bg-stone-950 text-stone-100">
      {/* Background Arena Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/borneo_rainforest_arena_bg_1793010185668.jpg"
          alt="Arena Rimba Hutan Tropis Borneo Fraction Champions"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col items-center justify-center flex-grow">
        {/* Championship Header & Mascot Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full my-auto">
          {/* Left Column: Mascot Host with Speech bubble */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-slate-900 shadow-2xl">
                <img
                  src="/src/assets/images/fracterra_dayak_forest_referee_1793010185625.jpg"
                  alt="Fracterra Robot Dayak Wasit Fraction Champions"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-cyan-400 text-cyan-300 px-3 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-lg whitespace-nowrap">
                FRACTERRA · WASIT RIMBA DAYAK
              </div>
            </div>

            {/* Mascot Dialogue */}
            <div className="mt-5 bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 text-xs sm:text-sm text-slate-200 max-w-xs shadow-lg">
              <p className="leading-relaxed">
                "Tabe Salam! Selamat datang di Arena Hutan Pecahan Borneo! Mari pecahkan rahasia kode pecahan bersama Fracterra di pedalaman rimba Kalimantan!"
              </p>
            </div>
          </div>

          {/* Right Column: Title Lockup & Action Buttons */}
          <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Tournament Pill-free Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Turnamen Intelektual SD · Arena Rimba Borneo</span>
              <span aria-hidden="true">·</span>
              <span>3 Babak Tantangan</span>
            </div>

            {/* Grand Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight uppercase leading-none">
              <span className="text-white">FRACTION </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                CHAMPIONS
              </span>
            </h1>

            {/* Subtitle / Edition */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-400 tracking-wide mt-2 font-display">
              SECRET FRACTION CODE · RAUNG RIMBA BORNEO
            </h2>

            {/* Official Tagline */}
            <p className="text-base sm:text-lg text-slate-300 font-medium mt-3 max-w-xl italic">
              "Jelajahi Rimba, Temukan Polanya, Buktikan Nilainya, Rebut Piala Emas Enggang!"
            </p>

            {/* Curriculum Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full my-6 text-xs text-slate-300">
              <div className="bg-slate-900/80 border border-emerald-500/40 bg-emerald-950/40 rounded-xl p-3 text-center shadow-md">
                <span className="text-emerald-400 font-bold block mb-1">Babak 1</span>
                2 Kelompok Senilai
              </div>
              <div className="bg-slate-900/80 border border-amber-500/40 bg-amber-950/40 rounded-xl p-3 text-center shadow-md">
                <span className="text-amber-400 font-bold block mb-1">Babak 2</span>
                Membandingkan Pecahan
              </div>
              <div className="bg-slate-900/80 border border-teal-500/40 bg-teal-950/40 rounded-xl p-3 text-center shadow-md">
                <span className="text-teal-400 font-bold block mb-1">Babak 3</span>
                Mengurutkan Pecahan
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 w-full justify-center lg:justify-start">
              {isMatchActive ? (
                <>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onContinueMatch();
                    }}
                    className="flex-1 min-w-[200px] px-6 py-4 rounded-xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    LANJUTKAN KOMPETISI
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onStartNewMatch();
                    }}
                    className="px-5 py-4 rounded-xl font-bold text-sm text-cyan-300 bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Mulai Pertandingan Baru
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onStartNewMatch();
                  }}
                  className="flex-1 min-w-[220px] px-8 py-4 rounded-xl font-black text-lg text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-xl shadow-emerald-500/30 text-stone-950 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <Play className="w-6 h-6 fill-current" />
                  MULAI KOMPETISI
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('PRACTICE');
                }}
                className="px-6 py-4 rounded-xl font-bold text-base text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/40 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                LATIHAN BEBAS
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('HOW_TO_PLAY');
                }}
                className="px-5 py-4 rounded-xl font-bold text-base text-purple-300 bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/40 transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                CARA BERMAIN
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('TEACHER_SETTINGS');
                }}
                className="px-5 py-4 rounded-xl font-bold text-base text-slate-300 bg-slate-900/80 border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                PENGATURAN GURU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Tournament Footer */}
      <footer className="relative z-10 w-full py-3 px-6 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-500">
        Fraction Champions: Secret Fraction Code · Edisi Rimba Belantara Borneo · Matematika SD Kelas IV
      </footer>
    </div>
  );
};
