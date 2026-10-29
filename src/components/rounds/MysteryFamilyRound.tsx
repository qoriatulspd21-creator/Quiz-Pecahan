import React, { useState, useEffect } from 'react';
import { Fraction, DifficultyLevel, RoundResultSummary } from '../../types/game';
import { FractionCard } from '../FractionCard';
import { VisualFractionProof } from '../VisualFractionProof';
import { generateRound1Data, areAllEquivalent, simplifyFraction } from '../../utils/fractionMath';
import { sounds } from '../../utils/soundEffects';
import { Check, ShieldAlert, Sparkles, Layers } from 'lucide-react';

interface MysteryFamilyRoundProps {
  difficulty: DifficultyLevel;
  teamId: string;
  teamName: string;
  onFinishRound: (result: RoundResultSummary) => void;
  isPracticeMode?: boolean;
}

export const MysteryFamilyRound: React.FC<MysteryFamilyRoundProps> = ({
  difficulty,
  teamId,
  teamName,
  onFinishRound,
  isPracticeMode = false,
}) => {
  const [data, setData] = useState(() => generateRound1Data(difficulty));
  const [poolCards, setPoolCards] = useState<Fraction[]>([]);
  const [groups, setGroups] = useState<{ [key: string]: Fraction[] }>({
    A: [],
    B: [],
  });
  const [intruderZone, setIntruderZone] = useState<Fraction[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [groupFeedback, setGroupFeedback] = useState<{ [key: string]: boolean | null }>({
    A: null,
    B: null,
  });

  // Initialize pool on mount or data reset
  useEffect(() => {
    const roundData = generateRound1Data(difficulty);
    setData(roundData);
    setPoolCards(roundData.cards);
    setGroups({ A: [], B: [] });
    setIntruderZone([]);
    setSelectedCardId(null);
    setIsLocked(false);
    setGroupFeedback({ A: null, B: null });
  }, [difficulty]);

  // Handle card selection (click-to-move for touch/IFP screens)
  const handleCardClick = (card: Fraction) => {
    if (isLocked) return;
    sounds.playCardSelect();
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(card.id);
    }
  };

  // Place selected card into target container
  const placeCardInGroup = (targetKey: 'A' | 'B' | 'INTRUDER' | 'POOL') => {
    if (isLocked || !selectedCardId) return;

    // Find card in pool, groups, or intruder zone
    let foundCard: Fraction | null = null;
    let fromSource: 'pool' | 'A' | 'B' | 'intruder' | null = null;

    const inPool = poolCards.find(c => c.id === selectedCardId);
    if (inPool) {
      foundCard = inPool;
      fromSource = 'pool';
    } else {
      for (const key of ['A', 'B'] as const) {
        const inGrp = groups[key].find(c => c.id === selectedCardId);
        if (inGrp) {
          foundCard = inGrp;
          fromSource = key;
          break;
        }
      }
      if (!foundCard) {
        const inIntruder = intruderZone.find(c => c.id === selectedCardId);
        if (inIntruder) {
          foundCard = inIntruder;
          fromSource = 'intruder';
        }
      }
    }

    if (!foundCard || !fromSource) return;

    // Capacity checks (4 cards max per group)
    if (targetKey !== 'POOL' && targetKey !== 'INTRUDER') {
      if (groups[targetKey].length >= 4 && fromSource !== targetKey) {
        sounds.playError();
        return; // Group full
      }
    }

    sounds.playSwap();

    // Remove from source
    if (fromSource === 'pool') {
      setPoolCards(prev => prev.filter(c => c.id !== foundCard!.id));
    } else if (fromSource === 'intruder') {
      setIntruderZone(prev => prev.filter(c => c.id !== foundCard!.id));
    } else {
      setGroups(prev => ({
        ...prev,
        [fromSource as string]: prev[fromSource as string].filter(c => c.id !== foundCard!.id),
      }));
    }

    // Add to target
    if (targetKey === 'POOL') {
      setPoolCards(prev => [...prev, foundCard!]);
    } else if (targetKey === 'INTRUDER') {
      setIntruderZone(prev => [...prev, foundCard!]);
    } else {
      setGroups(prev => ({
        ...prev,
        [targetKey]: [...prev[targetKey], foundCard!],
      }));
    }

    setSelectedCardId(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (isLocked) return;
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDropOnTarget = (e: React.DragEvent, targetKey: 'A' | 'B' | 'INTRUDER' | 'POOL') => {
    e.preventDefault();
    if (isLocked) return;
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      setSelectedCardId(cardId);
      setTimeout(() => {
        let found: Fraction | null = null;
        let source: string | null = null;
        if (poolCards.some(c => c.id === cardId)) {
          found = poolCards.find(c => c.id === cardId)!;
          source = 'pool';
        } else if (intruderZone.some(c => c.id === cardId)) {
          found = intruderZone.find(c => c.id === cardId)!;
          source = 'intruder';
        } else {
          for (const k of ['A', 'B'] as const) {
            if (groups[k].some(c => c.id === cardId)) {
              found = groups[k].find(c => c.id === cardId)!;
              source = k;
              break;
            }
          }
        }

        if (found && source) {
          if (targetKey !== 'POOL' && targetKey !== 'INTRUDER' && groups[targetKey].length >= 4 && source !== targetKey) {
            sounds.playError();
            return;
          }
          sounds.playSwap();
          if (source === 'pool') setPoolCards(prev => prev.filter(c => c.id !== cardId));
          else if (source === 'intruder') setIntruderZone(prev => prev.filter(c => c.id !== cardId));
          else setGroups(prev => ({ ...prev, [source!]: prev[source!].filter(c => c.id !== cardId) }));

          if (targetKey === 'POOL') setPoolCards(prev => [...prev, found!]);
          else if (targetKey === 'INTRUDER') setIntruderZone(prev => [...prev, found!]);
          else setGroups(prev => ({ ...prev, [targetKey]: [...prev[targetKey], found!] }));
          setSelectedCardId(null);
        }
      }, 0);
    }
  };

  // Submit and lock answers
  const handleLockIn = () => {
    sounds.playSuccess();
    setIsLocked(true);

    const isChampion = difficulty === 'champion';
    const groupKeys: ('A' | 'B')[] = ['A', 'B'];
    const feedback: { [key: string]: boolean } = {};
    let correctGroupsCount = 0;
    const recognizedFamilyBases: string[] = [];

    groupKeys.forEach(k => {
      const gCards = groups[k];
      if (gCards.length === 4 && areAllEquivalent(gCards)) {
        const base = simplifyFraction(gCards[0]);
        const key = `${base.num}/${base.den}`;
        if (!recognizedFamilyBases.includes(key)) {
          recognizedFamilyBases.push(key);
          feedback[k] = true;
          correctGroupsCount++;
        } else {
          feedback[k] = false;
        }
      } else {
        feedback[k] = false;
      }
    });

    setGroupFeedback(feedback);

    // Validate intruder card on champion level
    let intruderScore = 0;
    if (isChampion) {
      const expectedIntruderIds = data.intruders.map(i => i.id);
      const placedIntruderIds = intruderZone.map(i => i.id);
      const allIntrudersFound =
        expectedIntruderIds.length > 0 &&
        expectedIntruderIds.every(id => placedIntruderIds.includes(id)) &&
        placedIntruderIds.length === expectedIntruderIds.length;
      if (allIntrudersFound) {
        intruderScore = 20;
      }
    }

    const pointsPerGroup = isChampion ? 40 : 50;
    const totalScore = correctGroupsCount * pointsPerGroup + intruderScore;

    const breakdown = [
      {
        label: `Ketepatan 2 Kelompok Senilai (${correctGroupsCount}/2 Benar)`,
        score: correctGroupsCount * pointsPerGroup,
        maxScore: isChampion ? 80 : 100,
      },
    ];

    if (isChampion) {
      breakdown.push({
        label: 'Deteksi & Isolasi Kartu Penyusup',
        score: intruderScore,
        maxScore: 20,
      });
    }

    const explanation = `Tim berhasil mengelompokkan ${correctGroupsCount} dari 2 kelompok pecahan senilai dengan tepat! ${
      isChampion ? (intruderScore > 0 ? 'Kartu penyusup berhasil diisolasi sempurna!' : 'Kartu penyusup belum terisolasi.') : ''
    }`;

    onFinishRound({
      teamId,
      teamName,
      roundId: 1,
      scoreEarned: totalScore,
      timeRemaining: 0,
      explanation,
      breakdown,
    });
  };

  const totalCardsAssigned = Object.values(groups).reduce((acc, curr) => acc + curr.length, 0) + intruderZone.length;
  const isChampion = difficulty === 'champion';
  const totalTargetCards = isChampion ? 9 : 8;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Round Briefing Banner */}
      <div className="bg-stone-900/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-white">
              MISI RIMBA 1: Kelompokkan 2 Keluarga Pecahan Senilai
            </h3>
            <p className="text-xs text-slate-300">
              Pilih kartu pecahan di kolam bawah, lalu klik <strong>Kelompok A</strong> atau <strong>Kelompok B</strong>. Tiap kelompok berisi 4 kartu senilai.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLockIn}
          disabled={isLocked || totalCardsAssigned < 2}
          className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center gap-2 shrink-0 ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-sky-500/25 active:scale-95 cursor-pointer'
          }`}
        >
          <Check className="w-5 h-5" />
          <span>KUNCI JAWABAN ({totalCardsAssigned}/{totalTargetCards})</span>
        </button>
      </div>

      {/* 2 GROUP ZONES GRID (KELOMPOK A & KELOMPOK B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            key: 'A' as const,
            name: 'KELOMPOK A',
            color: 'border-sky-500/60 bg-sky-950/25 text-sky-400',
            badge: 'bg-sky-500/20 text-sky-300 border-sky-400',
            cardVariant: 'blue' as const,
          },
          {
            key: 'B' as const,
            name: 'KELOMPOK B',
            color: 'border-orange-500/60 bg-orange-950/25 text-orange-400',
            badge: 'bg-orange-500/20 text-orange-300 border-orange-400',
            cardVariant: 'orange' as const,
          },
        ].map(({ key, name, color, badge, cardVariant }) => {
          const groupCards = groups[key];
          const isFull = groupCards.length >= 4;
          const status = groupFeedback[key];

          const borderStyle =
            status === true
              ? 'border-emerald-400 bg-emerald-950/40'
              : status === false
              ? 'border-rose-500 bg-rose-950/40'
              : selectedCardId
              ? `${color} ring-2 ring-cyan-400/40`
              : `${color}`;

          return (
            <div
              key={key}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDropOnTarget(e, key)}
              onClick={() => {
                if (selectedCardId) placeCardInGroup(key);
              }}
              className={`rounded-2xl border-2 p-5 min-h-[240px] flex flex-col justify-between transition-all relative ${borderStyle} ${
                selectedCardId && !isFull ? 'cursor-pointer hover:scale-101 hover:border-cyan-300' : ''
              }`}
            >
              {/* Group Title Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center font-mono border ${badge}`}>
                    {key}
                  </span>
                  <div>
                    <span className="text-sm font-black text-white uppercase tracking-wider block">
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-400">Pecahan Senilai Bagian {key}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-slate-200 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  {groupCards.length} / 4 Kartu
                </span>
              </div>

              {/* Card Slots */}
              <div className="grid grid-cols-4 gap-2.5 my-auto py-4 justify-items-center">
                {groupCards.map(c => (
                  <FractionCard
                    key={c.id}
                    fraction={c}
                    size="md"
                    isSelected={selectedCardId === c.id}
                    onClick={() => handleCardClick(c)}
                    onDragStart={e => handleDragStart(e, c.id)}
                    variant={cardVariant}
                  />
                ))}
                {Array.from({ length: Math.max(0, 4 - groupCards.length) }).map((_, slotIdx) => (
                  <div
                    key={slotIdx}
                    className="w-18 h-24 sm:w-20 sm:h-26 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/40 flex flex-col items-center justify-center text-[11px] text-slate-400 font-bold"
                  >
                    <span>+ Masukkan</span>
                    <span className="text-[9px] opacity-70">Slot {groupCards.length + slotIdx + 1}</span>
                  </div>
                ))}
              </div>

              {/* Feedback indicator if locked */}
              {status !== null && (
                <div
                  className={`mt-2 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 ${
                    status ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {status ? '✓ Senilai & Tepat (+50 Poin)' : '✗ Belum Semua Senilai'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Champion Mode Intruder Zone */}
      {isChampion && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDropOnTarget(e, 'INTRUDER')}
          onClick={() => {
            if (selectedCardId) placeCardInGroup('INTRUDER');
          }}
          className={`bg-slate-900/90 border-2 rounded-2xl p-4 transition-all ${
            selectedCardId ? 'border-amber-400 hover:bg-slate-900 cursor-pointer' : 'border-amber-600/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>ZONA KARANTINA PENYUSUP (Level Champion)</span>
            </div>
            <span className="text-xs text-slate-400">
              Tempatkan 1 kartu yang tidak cocok dengan Kelompok A maupun B
            </span>
          </div>

          <div className="flex flex-wrap gap-3 min-h-[85px] items-center p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            {intruderZone.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Sentuh atau seret kartu yang tidak senilai ke zona karantina ini...
              </span>
            ) : (
              intruderZone.map(c => (
                <FractionCard
                  key={c.id}
                  fraction={c}
                  size="md"
                  isSelected={selectedCardId === c.id}
                  onClick={() => handleCardClick(c)}
                  onDragStart={e => handleDragStart(e, c.id)}
                  variant="intruder"
                  showBadge="Penyusup"
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Kolam Kartu Pecahan (8 Kartu) */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => handleDropOnTarget(e, 'POOL')}
        onClick={() => {
          if (selectedCardId) placeCardInGroup('POOL');
        }}
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              KOLAM KARTU PECAHAN
            </span>
            <span className="text-xs text-slate-400">
              ({poolCards.length} kartu tersisa)
            </span>
          </div>

          {selectedCardId ? (
            <span className="text-xs text-amber-300 font-bold animate-pulse">
              👉 Kartu dipilih! Sentuh kotak Kelompok A atau B di atas.
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Sentuh kartu di bawah, lalu sentuh kotak kelompok tujuan.
            </span>
          )}
        </div>

        {poolCards.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-400">
            Semua kartu telah ditempatkan! Silakan tekan tombol <strong>KUNCI JAWABAN</strong> di atas.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3.5 justify-center py-2">
            {poolCards.map(c => (
              <FractionCard
                key={c.id}
                fraction={c}
                size="lg"
                isSelected={selectedCardId === c.id}
                onClick={() => handleCardClick(c)}
                onDragStart={e => handleDragStart(e, c.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pembahasan Visual Setelah Dikunci */}
      {isLocked && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 animate-in fade-in">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>PEMBAHASAN & BUKTI VISUAL 2 KELOMPOK PECAHAN</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.families.map((f, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-300">
                  Keluarga {f.base.num}/{f.base.den} ({f.cards.map(c => `${c.num}/${c.den}`).join(' = ')})
                </div>
                <VisualFractionProof
                  f1={f.cards[0]}
                  f2={f.cards[1]}
                  type="bar"
                  label1={`Bentuk Dasar: ${f.cards[0].num}/${f.cards[0].den}`}
                  label2={`Bentuk Senilai: ${f.cards[1].num}/${f.cards[1].den}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
