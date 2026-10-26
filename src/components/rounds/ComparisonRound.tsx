import React, { useState } from 'react';
import { Fraction, RoundResultSummary } from '../../types/game';
import { FractionCard } from '../FractionCard';
import { VisualFractionProof } from '../VisualFractionProof';
import { generateRound2ComparisonData } from '../../utils/fractionMath';
import { sounds } from '../../utils/soundEffects';
import { Scale, Check, ArrowRight, BarChart2, PieChart, GitCommit, Sparkles, CheckCircle2 } from 'lucide-react';

interface ComparisonRoundProps {
  teamId: string;
  teamName: string;
  onFinishRound: (result: RoundResultSummary) => void;
  isPracticeMode?: boolean;
}

export const ComparisonRound: React.FC<ComparisonRoundProps> = ({
  teamId,
  teamName,
  onFinishRound,
  isPracticeMode = false,
}) => {
  const [data] = useState(() => generateRound2ComparisonData());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qIndex: number]: '>' | '<' | '=' | null }>({});
  const [activeProofType, setActiveProofType] = useState<'bar' | 'circle' | 'numberline'>('bar');
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = data.questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;

  // Comparison selection
  const handleSelectSymbol = (symbol: '>' | '<' | '=') => {
    if (isAnswered) return;
    const isCorrect = symbol === currentQuestion.correctSymbol;
    if (isCorrect) sounds.playSuccess();
    else sounds.playError();

    setAnswers(prev => ({ ...prev, [currentIndex]: symbol }));
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex < data.questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      handleFinishComparison();
    }
  };

  const handleFinishComparison = () => {
    sounds.playSuccess();
    setIsFinished(true);

    let correctCount = 0;
    data.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctSymbol) {
        correctCount++;
      }
    });

    const totalScore = correctCount * 25; // 4 soal x 25 = 100 poin

    const explanation = `Tim menjawab ${correctCount} dari 4 soal perbandingan pecahan (sama pembilang & sama penyebut) dengan tepat!`;

    onFinishRound({
      teamId,
      teamName,
      roundId: 2,
      scoreEarned: totalScore,
      timeRemaining: 0,
      explanation,
      breakdown: data.questions.map((q, idx) => ({
        label: `Soal ${idx + 1}: ${q.f1.num}/${q.f1.den} ${q.correctSymbol} ${q.f2.num}/${q.f2.den} (${q.type === 'same_den' ? 'Penyebut Sama' : 'Pembilang Sama'})`,
        score: answers[idx] === q.correctSymbol ? 25 : 0,
        maxScore: 25,
      })),
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Round Header */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-white">
              BABAK 2: Duel Perbandingan Pecahan (Sama Pembilang / Sama Penyebut)
            </h3>
            <p className="text-xs text-slate-300">
              Soal {currentIndex + 1} dari {data.questions.length}: {currentQuestion.description}
            </p>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-1.5">
          {data.questions.map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-purple-400 ring-2 ring-purple-400/40 scale-110'
                  : answers[i] !== undefined
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Holographic Duel Arena */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 my-2">
          {/* Left Fraction Podium */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
              Pecahan Kiri
            </span>
            <FractionCard fraction={currentQuestion.f1} size="xl" variant="blue" />
          </div>

          {/* Center Comparison Symbol Selector with Clear Indonesian Sub-labels */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Simbol yang Tepat:
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {[
                { symbol: '>' as const, label: 'Lebih Besar' },
                { symbol: '<' as const, label: 'Lebih Kecil' },
                { symbol: '=' as const, label: 'Senilai (Sama)' },
              ].map(({ symbol, label }) => {
                const isSelected = currentAnswer === symbol;
                const isCorrect = isAnswered && currentQuestion.correctSymbol === symbol;
                const isWrong = isSelected && !isCorrect;

                let btnStyle = 'bg-slate-950 border-slate-700 text-slate-200 hover:border-purple-400';
                if (isAnswered) {
                  if (isCorrect) btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 scale-105';
                  else if (isWrong) btnStyle = 'bg-rose-700 border-rose-400 text-white';
                }

                return (
                  <button
                    key={symbol}
                    onClick={() => handleSelectSymbol(symbol)}
                    disabled={isAnswered}
                    className={`w-20 h-20 sm:w-24 sm:h-22 rounded-2xl border-2 transition-all flex flex-col items-center justify-center active:scale-95 cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono font-black text-3xl leading-none">{symbol}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold mt-1 opacity-90">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Fraction Podium */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-wider">
              Pecahan Kanan
            </span>
            <FractionCard fraction={currentQuestion.f2} size="xl" variant="orange" />
          </div>
        </div>

        {/* Answer Explanation & Next Button */}
        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-emerald-400 mr-1">Penjelasan:</span>
              {currentQuestion.explanation}
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:brightness-110 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <span>{currentIndex < data.questions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Babak 2'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Visual Proof Deck */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                BUKTIKAN DENGAN GAMBAR (PILIH MODEL)
              </h4>
              <p className="text-[11px] text-slate-400">
                Lihat langsung apakah luas arsiran atau posisi titiknya lebih besar atau lebih kecil
              </p>
            </div>
          </div>

          {/* Proof Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveProofType('bar');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeProofType === 'bar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
                activeProofType === 'circle' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
                activeProofType === 'numberline' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Garis Bilangan</span>
            </button>
          </div>
        </div>

        <VisualFractionProof
          f1={currentQuestion.f1}
          f2={currentQuestion.f2}
          type={activeProofType}
          label1={`Kiri: ${currentQuestion.f1.num}/${currentQuestion.f1.den}`}
          label2={`Kanan: ${currentQuestion.f2.num}/${currentQuestion.f2.den}`}
        />
      </div>
    </div>
  );
};
