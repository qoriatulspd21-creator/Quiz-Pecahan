import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Home, Sparkles, Star, Medal } from 'lucide-react';
import { Team } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface ChampionshipCeremonyProps {
  teams: Team[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ChampionshipCeremony: React.FC<ChampionshipCeremonyProps> = ({
  teams,
  onPlayAgain,
  onGoHome,
}) => {
  // Sort teams descending
  const sorted = [...teams].sort((a, b) => {
    if (b.scores.total !== a.scores.total) {
      return b.scores.total - a.scores.total;
    }
    return a.timeUsedSeconds.total - b.timeUsedSeconds.total;
  });

  const winner = sorted[0];

  useEffect(() => {
    sounds.playFanfare();

    // Trigger confetti bursts
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 text-slate-100">
      {/* Grand Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-widest animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>CHAMPIONSHIP GRAND CEREMONY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
          PENETAPAN JUARA BESAR
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto">
          Selamat kepada seluruh tim yang telah membuktikan ketangkasan logika matematika pecahan!
        </p>
      </div>

      {/* Grand Trophy & Winner Spotlight */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-amber-500/20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Trophy Image */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
            <div className="relative group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-2xl">
                <img
                  src="/src/assets/images/robot_dayak_fracterra_1792997026451.jpg"
                  alt="Wasit Robot Dayak Fracterra"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-400 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow whitespace-nowrap">
                FRACTERRA
              </div>
            </div>
            <div className="relative group">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 shadow-2xl">
                <img
                  src="/src/assets/images/championship_trophy_1792627418090.jpg"
                  alt="Trofi Grand Champion Fraction Champions"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-400 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow whitespace-nowrap">
                PIALA EMAS
              </div>
            </div>
          </div>
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl px-4 py-2 text-xs text-amber-200 max-w-md mx-auto mb-4 italic">
            "Tabe Salam! Selamat kepada para Juara Sejati! Kalian telah menuntaskan 3 babak pecahan dengan luar biasa!" — Wasit Fracterra
          </div>

          <span className="text-xs font-black tracking-widest text-amber-400 uppercase mb-1">
            GRAND CHAMPION FRACTION CHAMPIONS 2026
          </span>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{winner.avatar}</span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              {winner.name}
            </h2>
          </div>
          {winner.members && (
            <p className="text-xs text-slate-400 mt-1">Anggota: {winner.members}</p>
          )}

          <div className="mt-4 px-6 py-2 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono font-black text-2xl sm:text-3xl">
            {winner.scores.total} <span className="text-sm font-normal text-slate-300">/ 300 Poin Maksimal</span>
          </div>
        </div>
      </div>

      {/* Podium Visualization for 2 or 3+ Teams */}
      <div className="space-y-4">
        <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          PODIUM KELAS JUARA ({sorted.length} KELOMPOK)
        </div>

        {sorted.length === 2 ? (
          /* 2 Teams Duel Podium */
          <div className="grid grid-cols-2 gap-4 sm:gap-8 items-end max-w-lg mx-auto pt-6">
            {/* 1st Place */}
            <div className="flex flex-col items-center order-1">
              <span className="text-3xl mb-1 animate-bounce">{sorted[0].avatar}</span>
              <div className="text-xs font-black text-amber-300 text-center truncate max-w-[140px] mb-2">
                {sorted[0].name}
              </div>
              <div className="text-xs font-mono font-black text-amber-400 mb-2">
                {sorted[0].scores.total} Pts
              </div>
              <div className="w-full h-36 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl border-t-2 border-amber-300 flex flex-col items-center justify-center font-black text-3xl text-slate-950 shadow-2xl">
                <Trophy className="w-6 h-6 mb-1 text-slate-950" />
                1
              </div>
            </div>

            {/* 2nd Place */}
            <div className="flex flex-col items-center order-2">
              <span className="text-2xl mb-1">{sorted[1].avatar}</span>
              <div className="text-xs font-bold text-white text-center truncate max-w-[140px] mb-2">
                {sorted[1].name}
              </div>
              <div className="text-xs font-mono font-black text-slate-300 mb-2">
                {sorted[1].scores.total} Pts
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl border-t-2 border-slate-400 flex flex-col items-center justify-center font-black text-2xl text-slate-300 shadow-lg">
                2
              </div>
            </div>
          </div>
        ) : (
          /* 3+ Teams Podium */
          <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center order-1">
              <span className="text-2xl mb-1">{sorted[1].avatar}</span>
              <div className="text-xs font-bold text-white text-center truncate max-w-[120px] mb-2">
                {sorted[1].name}
              </div>
              <div className="text-xs font-mono font-black text-slate-300 mb-2">
                {sorted[1].scores.total} Pts
              </div>
              <div className="w-full h-28 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl border-t-2 border-slate-400 flex flex-col items-center justify-center font-black text-2xl text-slate-300 shadow-lg">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center order-2">
              <span className="text-3xl mb-1 animate-bounce">{sorted[0].avatar}</span>
              <div className="text-xs font-black text-amber-300 text-center truncate max-w-[120px] mb-2">
                {sorted[0].name}
              </div>
              <div className="text-xs font-mono font-black text-amber-400 mb-2">
                {sorted[0].scores.total} Pts
              </div>
              <div className="w-full h-40 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl border-t-2 border-amber-300 flex flex-col items-center justify-center font-black text-3xl text-slate-950 shadow-2xl">
                <Trophy className="w-6 h-6 mb-1 text-slate-950" />
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center order-3">
              <span className="text-2xl mb-1">{sorted[2].avatar}</span>
              <div className="text-xs font-bold text-white text-center truncate max-w-[120px] mb-2">
                {sorted[2].name}
              </div>
              <div className="text-xs font-mono font-black text-amber-600 mb-2">
                {sorted[2].scores.total} Pts
              </div>
              <div className="w-full h-20 bg-gradient-to-t from-amber-950 to-amber-900 rounded-t-2xl border-t-2 border-amber-700 flex flex-col items-center justify-center font-black text-2xl text-amber-400 shadow-lg">
                3
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complete Matrix Leaderboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-amber-400" />
          <span>REKAPITULASI RESMI SETIAP BABAK</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-3">Peringkat</th>
                <th className="py-3 px-3">Tim</th>
                <th className="py-3 px-3 text-center">B1: Senilai</th>
                <th className="py-3 px-3 text-center">B2: Bandingkan</th>
                <th className="py-3 px-3 text-center">B3: Urutkan</th>
                
                <th className="py-3 px-3 text-right">Total Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sorted.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-black text-amber-400">#{idx + 1}</td>
                  <td className="py-3 px-3 flex items-center gap-2 font-bold text-white">
                    <span>{t.avatar}</span>
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{t.scores.round1}</td>
                  <td className="py-3 px-3 text-center font-mono">{t.scores.round2}</td>
                  <td className="py-3 px-3 text-center font-mono">{t.scores.round3}</td>
                  
                  <td className="py-3 px-3 text-right font-mono font-black text-amber-300 text-sm">
                    {t.scores.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            sounds.playClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <RotateCcw className="w-5 h-5" />
          <span>MAIN LAGI</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-cyan-300 bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Home className="w-5 h-5" />
          <span>KEMBALI KE MENU UTAMA</span>
        </button>
      </div>
    </div>
  );
};
