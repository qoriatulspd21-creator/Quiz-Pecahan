import React from 'react';
import { Trophy, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { RoundResultSummary } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { FracterraMascot } from './FracterraMascot';

interface TurnEndModalProps {
  summary: RoundResultSummary;
  hasNextTeam: boolean;
  nextTeamName?: string;
  onProceed: () => void;
}

export const TurnEndModal: React.FC<TurnEndModalProps> = ({
  summary,
  hasNextTeam,
  nextTeamName,
  onProceed,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Hasil Giliran Babak {summary.roundId}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            {summary.teamName}
          </h3>
          <p className="text-xs text-slate-400">
            Giliran bertanding telah selesai dan hasil telah dinilai oleh Wasit Rimba Borneo.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Skor Diperoleh</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                +{summary.scoreEarned} <span className="text-xs font-normal text-slate-400">/ 100 Poin</span>
              </div>
            </div>
          </div>
          {summary.timeRemaining > 0 && (
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">Sisa Waktu</div>
              <div className="text-sm font-mono font-bold text-emerald-300">{summary.timeRemaining}s</div>
            </div>
          )}
        </div>

        {/* Breakdown Items */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Rincian Nilai
          </div>
          {summary.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-b-0">
              <span className="text-slate-300">{item.label}</span>
              <span className="font-mono font-bold text-emerald-400">
                {item.score} / {item.maxScore}
              </span>
            </div>
          ))}
        </div>

        {/* Host Robot Comment */}
        <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-100 leading-relaxed flex items-start gap-3 shadow-inner">
          <div className="shrink-0">
            <FracterraMascot size="sm" showBadge={false} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Wasit Fracterra (Penjaga Rimba Dayak):</span>
            </div>
            <p className="text-slate-200">{summary.explanation}</p>
          </div>
        </div>

        {/* Proceed Action Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onProceed();
          }}
          className="w-full py-4 rounded-xl font-black text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 hover:brightness-110 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
        >
          <span>
            {hasNextTeam ? `GILIRAN TIM BERIKUTNYA (${nextTeamName || 'Tim Selanjutnya'})` : 'LIHAT PAPAN SKOR BABAK INI'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
