import React, { useState } from 'react';
import { Fraction, RoundResultSummary } from '../../types/game';
import { FractionCard } from '../FractionCard';
import { VisualFractionProof } from '../VisualFractionProof';
import { generateRound3OrderingData, compareFractions } from '../../utils/fractionMath';
import { sounds } from '../../utils/soundEffects';
import { ArrowDownUp, Check, ArrowRight, Sparkles, BarChart2, PieChart, GitCommit } from 'lucide-react';

interface OrderingRoundProps {
  teamId: string;
  teamName: string;
  onFinishRound: (result: RoundResultSummary) => void;
  isPracticeMode?: boolean;
}

export const OrderingRound: React.FC<OrderingRoundProps> = ({
  teamId,
  teamName,
  onFinishRound,
  isPracticeMode = false,
}) => {
  const [data] = useState(() => generateRound3OrderingData());
  const [currentStage, setCurrentStage] = useState<1 | 2>(1);

  // Cards state for Stage 1 (Penyebut Sama) and Stage 2 (Pembilang Sama)
  const [stage1Cards, setStage1Cards] = useState<Fraction[]>(() => [...data.stage1.shuffledCards]);
  const [stage2Cards, setStage2Cards] = useState<Fraction[]>(() => [...data.stage2.shuffledCards]);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [stage1Completed, setStage1Completed] = useState<boolean | null>(null);
  const [stage2Completed, setStage2Completed] = useState<boolean | null>(null);
  const [activeProofType, setActiveProofType] = useState<'bar' | 'circle' | 'numberline'>('bar');

  const activeCards = currentStage === 1 ? stage1Cards : stage2Cards;
  const currentStageData = currentStage === 1 ? data.stage1 : data.stage2;
  const isCurrentStageChecked = currentStage === 1 ? stage1Completed !== null : stage2Completed !== null;

  // Swap cards
  const handleCardClick = (idx: number) => {
    if (isCurrentStageChecked) return;

    if (selectedIdx === null) {
      sounds.playCardSelect();
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }

      sounds.playSwap();
      if (currentStage === 1) {
        setStage1Cards(prev => {
          const next = [...prev];
          const temp = next[selectedIdx];
          next[selectedIdx] = next[idx];
          next[idx] = temp;
          return next;
        });
      } else {
        setStage2Cards(prev => {
          const next = [...prev];
          const temp = next[selectedIdx];
          next[selectedIdx] = next[idx];
          next[idx] = temp;
          return next;
        });
      }
      setSelectedIdx(null);
    }
  };

  // Check stage order
  const handleCheckStage = () => {
    sounds.playSuccess();
    const cardsToCheck = currentStage === 1 ? stage1Cards : stage2Cards;

    let isAscending = true;
    for (let i = 0; i < cardsToCheck.length - 1; i++) {
      if (compareFractions(cardsToCheck[i], cardsToCheck[i + 1]) > 0) {
        isAscending = false;
        break;
      }
    }

    if (currentStage === 1) {
      setStage1Completed(isAscending);
    } else {
      setStage2Completed(isAscending);
    }
  };

  // Move to next stage or finish
  const handleNextStage = () => {
    sounds.playClick();
    if (currentStage === 1) {
      setCurrentStage(2);
      setSelectedIdx(null);
    } else {
      handleFinishAll();
    }
  };

  const handleFinishAll = () => {
    sounds.playSuccess();
    const s1Score = stage1Completed ? 50 : 25;
    const s2Score = stage2Completed ? 50 : 25;
    const totalScore = s1Score + s2Score;

    const explanation = `Tim menyelesaikan tantangan mengurutkan pecahan penyebut sama (${stage1Completed ? 'Tepat' : 'Kurang tepat'}) dan pembilang sama (${stage2Completed ? 'Tepat' : 'Kurang tepat'}).`;

    onFinishRound({
      teamId,
      teamName,
      roundId: 3,
      scoreEarned: totalScore,
      timeRemaining: 0,
      explanation,
      breakdown: [
        {
          label: 'Tantangan 1: Mengurutkan Pecahan Penyebut Sama',
          score: s1Score,
          maxScore: 50,
        },
        {
          label: 'Tantangan 2: Mengurutkan Pecahan Pembilang Sama',
          score: s2Score,
          maxScore: 50,
        },
      ],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Round Header */}
      <div className="bg-stone-900/90 border border-teal-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400 shrink-0">
            <ArrowDownUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-white">
              BABAK 3 RIMBA: Mengurutkan Pecahan (Sama Pembilang / Sama Penyebut)
            </h3>
            <p className="text-xs text-slate-300">
              {currentStageData.title}: {currentStageData.hint}
            </p>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              currentStage === 1
                ? 'bg-purple-600 text-white border-purple-400'
                : stage1Completed !== null
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Tantangan 1 (Penyebut Sama) {stage1Completed ? '✓' : ''}
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              currentStage === 2
                ? 'bg-purple-600 text-white border-purple-400'
                : stage2Completed !== null
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Tantangan 2 (Pembilang Sama) {stage2Completed ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Main Ordering Canvas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {currentStage === 1 ? 'Penyebut Sama: Bandingkan Pembilang' : 'Pembilang Sama: Semakin Besar Penyebut, Nilai Makin Kecil'}
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Urutkan 4 Pecahan dari Nilai Terkecil ke Terbesar
          </h3>
          <p className="text-xs text-slate-400">
            {selectedIdx !== null
              ? '👉 Kartu dipilih! Sentuh kartu lain untuk menukar posisi.'
              : 'Sentuh 2 kartu untuk saling bertukar posisi.'}
          </p>
        </div>

        {/* 4 Cards Row in Ordering Slot */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-6">
          {activeCards.map((card, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div key={card.id} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono font-bold text-slate-400 mb-2">
                    Posisi {idx + 1}
                  </span>
                  <FractionCard
                    fraction={card}
                    size="lg"
                    isSelected={isSelected}
                    onClick={() => handleCardClick(idx)}
                    variant={isSelected ? 'orange' : currentStage === 1 ? 'blue' : 'purple'}
                  />
                </div>
                {idx < activeCards.length - 1 && (
                  <span className="text-xl font-mono text-purple-400 font-bold hidden sm:inline">
                    &lt;
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div>
            {isCurrentStageChecked && (
              <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                {(currentStage === 1 ? stage1Completed : stage2Completed) ? (
                  <span className="text-emerald-400">✓ Hebat! Susunan urutan pecahan sudah tepat dari terkecil ke terbesar! (+50 Poin)</span>
                ) : (
                  <span className="text-rose-400">✗ Urutan belum sepenuhnya tepat. Silakan pelajari bukti gambar di bawah.</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isCurrentStageChecked ? (
              <button
                onClick={handleCheckStage}
                className="px-8 py-3 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-5 h-5" />
                <span>PERIKSA URUTAN</span>
              </button>
            ) : (
              <button
                onClick={handleNextStage}
                className="px-8 py-3 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:brightness-110 shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{currentStage === 1 ? 'Lanjut ke Tantangan 2 (Pembilang Sama)' : 'Selesaikan Babak 3'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Proof Deck */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                BUKTIKAN URUTAN DENGAN GAMBAR
              </h4>
              <p className="text-[11px] text-slate-400">
                Membandingkan pecahan pertama dan pecahan terakhir dalam urutan Anda
              </p>
            </div>
          </div>

          {/* Model selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveProofType('bar');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeProofType === 'bar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Batang</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveProofType('circle');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeProofType === 'circle' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Lingkaran</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveProofType('numberline');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeProofType === 'numberline' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Garis Bilangan</span>
            </button>
          </div>
        </div>

        <VisualFractionProof
          f1={activeCards[0]}
          f2={activeCards[activeCards.length - 1]}
          type={activeProofType}
          label1={`Pecahan Terkecil Urutan Anda: ${activeCards[0].num}/${activeCards[0].den}`}
          label2={`Pecahan Terbesar Urutan Anda: ${activeCards[activeCards.length - 1].num}/${activeCards[activeCards.length - 1].den}`}
        />
      </div>
    </div>
  );
};
