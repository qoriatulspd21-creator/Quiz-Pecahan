import React from 'react';
import { Trophy, ArrowRight, Award, Shield, Sparkles } from 'lucide-react';
import { Team, RoundId } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface RoundScoreboardProps {
  roundId: RoundId;
  teams: Team[];
  onProceedToNextRound: () => void;
}

export const RoundScoreboard: React.FC<RoundScoreboardProps> = ({
  roundId,
  teams,
  onProceedToNextRound,
}) => {
  // Sort teams descending by total score, then by time used as tiebreaker
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.scores.total !== a.scores.total) {
      return b.scores.total - a.scores.total;
    }
    return a.timeUsedSeconds.total - b.timeUsedSeconds.total;
  });

  const isFinalRound = roundId === 3;

  const getRoundScore = (team: Team, r: RoundId) => {
    switch (r) {
      case 1: return team.scores.round1;
      case 2: return team.scores.round2;
      case 3: return team.scores.round3;
      
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>KLASEMEN SEMENTARA SETELAH BABAK {roundId}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-wide">
          PAPAN SKOR ARENA JUARA
        </h2>
        <p className="text-xs text-slate-400">
          Seluruh tim telah menuntaskan Babak {roundId}. Berikut adalah perolehan poin sementara.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        {sortedTeams.map((team, rankIdx) => {
          const rank = rankIdx + 1;
          const currentRoundScore = getRoundScore(team, roundId);

          let medalBg = 'bg-slate-800 text-slate-300';
          let borderGlow = 'border-slate-800';
          if (rank === 1) {
            medalBg = 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30';
            borderGlow = 'border-amber-400/60 bg-gradient-to-r from-amber-950/20 to-slate-900';
          } else if (rank === 2) {
            medalBg = 'bg-slate-300 text-slate-950 font-black';
            borderGlow = 'border-slate-400/60';
          } else if (rank === 3) {
            medalBg = 'bg-amber-700 text-white font-black';
            borderGlow = 'border-amber-700/60';
          }

          return (
            <div
              key={team.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${borderGlow}`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-sm font-bold ${medalBg}`}>
                  #{rank}
                </div>

                {/* Team Avatar & Info */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{team.avatar}</span>
                  <div>
                    <div className="text-base font-black text-white">{team.name}</div>
                    {team.members && (
                      <div className="text-xs text-slate-400">Anggota: {team.members}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scores Info */}
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Babak {roundId}</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">+{currentRoundScore} Poin</div>
                </div>

                <div className="text-right min-w-[80px]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Poin</div>
                  <div className="text-2xl font-black font-mono text-amber-300">
                    {team.scores.total}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action to proceed */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => {
            sounds.playClick();
            onProceedToNextRound();
          }}
          className="px-8 py-4 rounded-xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center gap-3 active:scale-95 transition-all"
        >
          <span>
            {isFinalRound ? 'MENUJU UPACARA JUARA BESAR' : `LANJUT KE BABAK ${roundId + 1}`}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
