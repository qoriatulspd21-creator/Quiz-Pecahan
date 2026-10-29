import React, { useEffect } from 'react';
import { Clock, Trophy, Award, AlertCircle } from 'lucide-react';
import { Team, RoundId } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface GameArenaHeaderProps {
  roundId: RoundId;
  roundName: string;
  activeTeam: Team;
  allTeams: Team[];
  currentTeamIndex: number;
  timeRemaining: number;
  totalDuration: number;
  onTimeExpired: () => void;
  isPracticeMode?: boolean;
}

export const GameArenaHeader: React.FC<GameArenaHeaderProps> = ({
  roundId,
  roundName,
  activeTeam,
  allTeams,
  currentTeamIndex,
  timeRemaining,
  totalDuration,
  onTimeExpired,
  isPracticeMode = false,
}) => {
  // Timer sound cues
  useEffect(() => {
    if (totalDuration > 0 && timeRemaining <= 10 && timeRemaining > 0) {
      sounds.playTimerTick();
    }
    if (totalDuration > 0 && timeRemaining === 0) {
      onTimeExpired();
    }
  }, [timeRemaining, totalDuration, onTimeExpired]);

  const timerRatio = totalDuration > 0 ? Math.max(0, timeRemaining / totalDuration) : 1;
  const isTimeCritical = totalDuration > 0 && timeRemaining <= 15;

  return (
    <div className="w-full bg-stone-950/95 border-b border-emerald-900/40 px-4 sm:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Round & Active Team Banner */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Active Team Avatar with glowing ring */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 shadow-lg ${activeTeam.badgeBg} ${activeTeam.borderColor} animate-pulse`}
            >
              {activeTeam.avatar}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase">
                  {isPracticeMode ? 'MODE LATIHAN BEBAS' : `GILIRAN BERTANDING: ${activeTeam.name}`}
                </span>
                {!isPracticeMode && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Tim {currentTeamIndex + 1}/{allTeams.length}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                Babak {roundId}: {roundName}
              </h2>
            </div>
          </div>

          {/* Quick Round Score Tracker for Active Team */}
          {!isPracticeMode && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs md:hidden">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-bold font-mono text-amber-300">{activeTeam.scores.total} Poin</span>
            </div>
          )}
        </div>

        {/* Center: Team Turn Dots (Competitors in this round) */}
        {!isPracticeMode && (
          <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 px-4 py-2 rounded-xl">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Giliran:
            </span>
            {allTeams.map((t, idx) => {
              const isCurrent = idx === currentTeamIndex;
              const isDone = idx < currentTeamIndex;
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? `${t.badgeBg} ring-1 ${t.borderColor} scale-105 shadow-md`
                      : isDone
                      ? 'bg-slate-950 text-slate-500'
                      : 'bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <span>{t.avatar}</span>
                  <span className="hidden xl:inline">{t.name.split(' ')[0]}</span>
                  {isDone && <span className="text-[10px] text-emerald-400">✓</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Right: Timer & Score */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Total Accumulated Score */}
          {!isPracticeMode && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Poin</div>
                <div className="text-sm font-black font-mono text-amber-300">{activeTeam.scores.total}</div>
              </div>
            </div>
          )}

          {/* Turn Countdown Timer */}
          {totalDuration > 0 ? (
            <div
              className={`flex items-center gap-3 px-4 py-1.5 rounded-xl border transition-all ${
                isTimeCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
                  : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            >
              <Clock className={`w-5 h-5 ${isTimeCritical ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
              <div className="text-right min-w-[70px]">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Waktu Giliran</div>
                <div className="font-mono font-black text-lg sm:text-xl leading-none">
                  {timeRemaining} <span className="text-xs font-normal text-slate-400">dtk</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-400">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Tanpa Timer</span>
            </div>
          )}
        </div>
      </div>

      {/* Linear Timer Bar */}
      {totalDuration > 0 && (
        <div className="w-full bg-slate-900 h-1.5 mt-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isTimeCritical ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            }`}
            style={{ width: `${timerRatio * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
