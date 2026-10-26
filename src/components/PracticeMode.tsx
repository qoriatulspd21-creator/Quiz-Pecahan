import React, { useState } from 'react';
import { BookOpen, RotateCcw, ArrowLeft, Layers, Shuffle, Scale, ShieldCheck, Grid, Sparkles } from 'lucide-react';
import { RoundId, DifficultyLevel, Team, RoundResultSummary } from '../types/game';
import { MysteryFamilyRound } from './rounds/MysteryFamilyRound';
import { ComparisonRound } from './rounds/ComparisonRound';
import { OrderingRound } from './rounds/OrderingRound';
import { sounds } from '../utils/soundEffects';

interface PracticeModeProps {
  onBack: () => void;
}

const DUMMY_PRACTICE_TEAM: Team = {
  id: 'practice-trainee',
  name: 'Siswa Peneliti',
  color: 'from-cyan-500 to-blue-600',
  accentColor: '#0ea5e9',
  badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400',
  borderColor: 'border-cyan-500',
  textColor: 'text-cyan-400',
  avatar: '🔬',
  scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
};

export const PracticeMode: React.FC<PracticeModeProps> = ({ onBack }) => {
  const [selectedRound, setSelectedRound] = useState<RoundId>(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('menengah');
  const [practiceKey, setPracticeKey] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const rounds = [
    { id: 1 as RoundId, name: 'Family (2 Kelompok)', icon: <Layers className="w-4 h-4" /> },
    { id: 2 as RoundId, name: 'Membandingkan Pecahan', icon: <Scale className="w-4 h-4" /> },
    { id: 3 as RoundId, name: 'Mengurutkan Pecahan', icon: <RotateCcw className="w-4 h-4" /> },
    
    
  ];

  const handleRestartRound = () => {
    sounds.playClick();
    setPracticeKey(k => k + 1);
    setLastFeedback(null);
  };

  const handleFinishPractice = (res: RoundResultSummary) => {
    sounds.playSuccess();
    setLastFeedback(res.explanation);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['pemula', 'menengah', 'champion'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playClick();
                  setDifficulty(lvl);
                  setPracticeKey(k => k + 1);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                  difficulty === lvl
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleRestartRound}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Soal Baru</span>
          </button>
        </div>
      </div>

      {/* Round Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {rounds.map(r => (
          <button
            key={r.id}
            onClick={() => {
              sounds.playClick();
              setSelectedRound(r.id);
              setPracticeKey(k => k + 1);
              setLastFeedback(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedRound === r.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {r.icon}
            <span>Babak {r.id}: {r.name}</span>
          </button>
        ))}
      </div>

      {/* Feedback banner if solved in practice */}
      {lastFeedback && (
        <div className="bg-emerald-950/60 border border-emerald-400 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold text-white block">Umpan Balik Latihan:</span>
              {lastFeedback}
            </div>
          </div>
          <button
            onClick={handleRestartRound}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 whitespace-nowrap shrink-0"
          >
            Coba Soal Lain
          </button>
        </div>
      )}

      {/* Render Active Round in Practice Mode */}
      <div key={practiceKey}>
        {selectedRound === 1 && (
          <MysteryFamilyRound
            difficulty={difficulty}
            teamId="practice"
            teamName="Latihan Bebas"
            onFinishRound={handleFinishPractice}
            isPracticeMode={true}
          />
        )}
        {selectedRound === 2 && (
          <ComparisonRound
            teamId="practice"
            teamName="Latihan Bebas"
            onFinishRound={handleFinishPractice}
            isPracticeMode={true}
          />
        )}
        {selectedRound === 3 && (
          <OrderingRound
            teamId="practice"
            teamName="Latihan Bebas"
            onFinishRound={handleFinishPractice}
            isPracticeMode={true}
          />
        )}
        
        
      </div>
    </div>
  );
};
