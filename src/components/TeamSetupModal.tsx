import React, { useState } from 'react';
import { Users, Clock, Flame, Play, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Team, DifficultyLevel, GameSettings } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface TeamSetupModalProps {
  initialTeams: Team[];
  initialSettings: GameSettings;
  onConfirmTeams: (teams: Team[], settings: GameSettings) => void;
  onBack: () => void;
}

const AVATAR_OPTIONS = ['🦅', '🐯', '⚡', '🐉', '🌟', '🐬', '🦁', '🤖'];

const PRESET_TEAMS: Omit<Team, 'id' | 'scores' | 'timeUsedSeconds'>[] = [
  {
    name: 'Kelompok 1 (Enggang Borneo)',
    color: 'from-sky-500 to-blue-600',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-400',
    avatar: '🦅',
    members: 'Ahmad, Siti, Doni',
  },
  {
    name: 'Kelompok 2 (Macan Dahan)',
    color: 'from-orange-500 to-amber-600',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-400',
    avatar: '🐯',
    members: 'Budi, Rina, Farhan',
  },
  {
    name: 'Kelompok 3 (Orangutan Rimba)',
    color: 'from-purple-500 to-violet-600',
    accentColor: '#9333ea',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    avatar: '🦧',
    members: 'Citra, Kevin, Dewi',
  },
  {
    name: 'Kelompok 4 (Buaya Mahakam)',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    avatar: '🐊',
    members: 'Eko, Nisa, Gilang',
  },
  {
    name: 'Kelompok 5 (Bekantan Cerdik)',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#e11d48',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    avatar: '🐒',
    members: 'Rizky, Maya, Tari',
  },
];

export const TeamSetupModal: React.FC<TeamSetupModalProps> = ({
  initialTeams,
  initialSettings,
  onConfirmTeams,
  onBack,
}) => {
  const [teamCount, setTeamCount] = useState<number>(() => {
    const len = initialTeams.length;
    return len >= 2 && len <= 5 ? len : 4;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const preset = PRESET_TEAMS[i];
      const existing = initialTeams[i];
      return {
        id: `team-${i + 1}`,
        name: existing?.name || preset.name,
        color: preset.color,
        accentColor: preset.accentColor,
        badgeBg: preset.badgeBg,
        borderColor: preset.borderColor,
        textColor: preset.textColor,
        avatar: existing?.avatar || preset.avatar,
        members: existing?.members || preset.members,
        scores: existing?.scores || {
          round1: 0,
          round2: 0,
          round3: 0,
          round4: 0,
          round5: 0,
          total: 0,
        },
        timeUsedSeconds: existing?.timeUsedSeconds || {
          round1: 0,
          round2: 0,
          round3: 0,
          round4: 0,
          round5: 0,
          total: 0,
        },
      };
    });
  });

  const [turnDuration, setTurnDuration] = useState<number>(initialSettings.turnDuration);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialSettings.difficulty);

  const handleUpdateTeam = (index: number, updates: Partial<Team>) => {
    setTeams(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    const finalTeams = teams.slice(0, teamCount);
    onConfirmTeams(finalTeams, {
      ...initialSettings,
      turnDuration,
      difficulty,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Sederhana & Ramah */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-right">
          <h2 className="text-2xl font-black font-display text-white tracking-wide">
            PENGATURAN KELOMPOK
          </h2>
          <p className="text-xs text-slate-400">
            Pilih jumlah pemain / kelompok (2 - 5 Tim)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* LANGKAH 1: PILIH JUMLAH PEMAIN / KELOMPOK (2 - 5) */}
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-black text-cyan-400 uppercase tracking-wider">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Jumlah Pemain / Kelompok (Pilihan 2 - 5)</span>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {teamCount} Kelompok Aktif
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[2, 3, 4, 5].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setTeamCount(count);
                }}
                className={`py-3.5 px-3 rounded-xl font-bold text-center border-2 transition-all cursor-pointer ${
                  teamCount === count
                    ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 scale-102 ring-2 ring-cyan-400/40'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-2xl sm:text-3xl font-black font-mono">{count}</div>
                <div className="text-xs font-bold uppercase tracking-wide mt-0.5">
                  {count === 2 ? '2 Kelompok (Duel)' : `${count} Kelompok`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* LANGKAH 2: DAFTAR KELOMPOK YANG BERTANDING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Daftar {teamCount} Kelompok (Bisa diubah nama & avatarnya)</span>
            <span className="text-slate-500">Klik huruf/nama untuk mengganti</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {teams.slice(0, teamCount).map((team, idx) => (
              <div
                key={team.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-md hover:border-slate-700 transition-colors"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${team.color}`} />

                <div className="flex items-start gap-3">
                  {/* Avatar Picker Singkat */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-2xl shadow-inner mb-1.5">
                      {team.avatar}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {AVATAR_OPTIONS.slice(0, 8).map(av => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            handleUpdateTeam(idx, { avatar: av });
                          }}
                          className={`w-5 h-5 text-[11px] flex items-center justify-center rounded hover:bg-slate-800 ${
                            team.avatar === av ? 'bg-cyan-900/80 ring-1 ring-cyan-400' : ''
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nama Kelompok */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Kelompok {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={team.name}
                        onChange={e => handleUpdateTeam(idx, { name: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={team.members || ''}
                        onChange={e => handleUpdateTeam(idx, { members: e.target.value })}
                        placeholder="Nama anggota (opsional)"
                        className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LANGKAH 3: PENGATURAN CEPAT (WAKTU & KESULITAN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          {/* Durasi Waktu */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
              <Clock className="w-4 h-4" />
              <span>Waktu Berpikir Tiap Giliran</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { sec: 60, label: '60 Detik', sub: 'Cepat' },
                { sec: 90, label: '90 Detik', sub: 'Standar' },
                { sec: 120, label: '120 Detik', sub: 'Santai' },
                { sec: 0, label: 'Bebas', sub: 'Tanpa Timer' },
              ].map(opt => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setTurnDuration(opt.sec);
                  }}
                  className={`py-2 px-1 text-center rounded-xl border transition-all ${
                    turnDuration === opt.sec
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-75">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tingkat Kesulitan */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
              <Flame className="w-4 h-4" />
              <span>Tingkat Soal</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pemula', label: 'Mudah', desc: 'Pecahan Dasar' },
                { id: 'menengah', label: 'Sedang', desc: 'Kelas IV Standar' },
                { id: 'champion', label: 'Tantangan', desc: '+Penyusup' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDifficulty(lvl.id as DifficultyLevel);
                  }}
                  className={`py-2 px-1.5 text-center rounded-xl border transition-all ${
                    difficulty === lvl.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] opacity-75">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tombol Mulai yang Besar & Jelas */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-8 py-4 rounded-xl font-black text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 hover:brightness-110 shadow-xl shadow-cyan-500/25 flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI KOMPETISI ({teamCount} KELOMPOK)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
