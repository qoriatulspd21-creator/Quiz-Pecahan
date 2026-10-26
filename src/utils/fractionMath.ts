import { Fraction } from '../types/game';

/**
 * Pure integer mathematical utilities for elementary school fractions (SD Kelas IV).
 * Uses exact cross-multiplication without floating-point rounding errors.
 */

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(f: Fraction): { num: number; den: number } {
  const divisor = gcd(f.num, f.den);
  return {
    num: f.num / divisor,
    den: f.den / divisor,
  };
}

export function areEquivalent(f1: Fraction, f2: Fraction): boolean {
  if (f1.den === 0 || f2.den === 0) return false;
  return f1.num * f2.den === f2.num * f1.den;
}

export function compareFractions(f1: Fraction, f2: Fraction): number {
  // Returns > 0 if f1 > f2, 0 if equal, < 0 if f1 < f2
  const left = f1.num * f2.den;
  const right = f2.num * f1.den;
  if (left > right) return 1;
  if (left < right) return -1;
  return 0;
}

export function createFraction(num: number, den: number, idPrefix = 'f'): Fraction {
  return {
    id: `${idPrefix}-${num}_${den}-${Math.random().toString(36).substring(2, 7)}`,
    num,
    den,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Available base fractions for grade 4 curriculum
export const BASE_FRACTION_CATALOG = [
  { num: 1, den: 2, label: 'Satu Perdua' },
  { num: 1, den: 3, label: 'Satu Pertiga' },
  { num: 2, den: 3, label: 'Dua Pertiga' },
  { num: 1, den: 4, label: 'Satu Perempat' },
  { num: 3, den: 4, label: 'Tiga Perempat' },
  { num: 1, den: 5, label: 'Satu Perlima' },
  { num: 2, den: 5, label: 'Dua Perlima' },
  { num: 3, den: 5, label: 'Tiga Perlima' },
  { num: 4, den: 5, label: 'Empat Perlima' },
  { num: 1, den: 6, label: 'Satu Perenam' },
  { num: 5, den: 6, label: 'Lima Perenam' },
];

/**
 * Generates an array of equivalent fractions from a base fraction.
 */
export function generateEquivalents(base: { num: number; den: number }, count: number, startMult = 1): Fraction[] {
  const list: Fraction[] = [];
  for (let i = 0; i < count; i++) {
    const mult = startMult + i;
    list.push(createFraction(base.num * mult, base.den * mult));
  }
  return list;
}

/**
 * ROUND 1: Mystery Fraction Family (Dua Kelompok Saja)
 * Generates 2 distinct families with 4 equivalent fractions each (8 cards total).
 * On Champion difficulty, adds 1 intruder card (9 cards total).
 */
export function generateRound1Data(difficulty: 'pemula' | 'menengah' | 'champion') {
  // Pick 2 distinct base fractions
  const shuffledBases = shuffleArray([...BASE_FRACTION_CATALOG]).slice(0, 2);
  
  const families = shuffledBases.map((base, idx) => {
    const multipliers = difficulty === 'pemula' ? [1, 2, 3, 4] : shuffleArray([1, 2, 3, 4, 5]).slice(0, 4).sort((a,b)=>a-b);
    const cards = multipliers.map(m => createFraction(base.num * m, base.den * m, `fam${idx}`));
    return {
      base,
      cards,
    };
  });

  let cards = families.flatMap(f => f.cards);
  let intruders: Fraction[] = [];

  if (difficulty === 'champion') {
    // Pick 1 intruder fraction that does NOT match either of the 2 bases
    const otherBases = BASE_FRACTION_CATALOG.filter(b => 
      !families.some(f => areEquivalent(createFraction(b.num, b.den), createFraction(f.base.num, f.base.den)))
    );
    const intruderBase = shuffleArray(otherBases)[0] || { num: 5, den: 8 };
    intruders = [
      createFraction(intruderBase.num, intruderBase.den, 'intruder1'),
    ];
    cards = [...cards, ...intruders];
  }

  return {
    families,
    cards: shuffleArray(cards),
    intruders,
    expectedCardCountPerGroup: 4,
  };
}

/**
 * ROUND 2: Fraction Switch Battle (Dua Kelompok Saja)
 * 2 groups of 4 fractions with cards swapped between them.
 * Guaranteed to be solvable in known minimal moves.
 */
export function generateRound2Data(difficulty: 'pemula' | 'menengah' | 'champion') {
  const chosenBases = shuffleArray([...BASE_FRACTION_CATALOG]).slice(0, 2);
  const cardsPerGroup = 4;

  const originalGroups: Fraction[][] = chosenBases.map((base, groupIdx) => {
    return [1, 2, 3, 4].map(m => createFraction(base.num * m, base.den * m, `grp${groupIdx}`));
  });

  // Clone groups to perturb
  const currentGroups: Fraction[][] = originalGroups.map(g => [...g]);

  const swapCount = difficulty === 'pemula' ? 1 : 2;

  for (let s = 0; s < swapCount; s++) {
    const idx1 = s;
    const idx2 = (s + 1) % cardsPerGroup;
    const temp = currentGroups[0][idx1];
    currentGroups[0][idx1] = currentGroups[1][idx2];
    currentGroups[1][idx2] = temp;
  }

  return {
    targetBases: chosenBases,
    originalGroups,
    initialGroups: currentGroups,
    minMovesExpected: swapCount,
    hints: [
      `Coba sederhanakan setiap pecahan dengan membagi pembilang dan penyebut dengan FPB.`,
      `Kelompok 1 ditujukan untuk pecahan senilai ${chosenBases[0].num}/${chosenBases[0].den}.`,
      `Kelompok 2 ditujukan untuk pecahan senilai ${chosenBases[1].num}/${chosenBases[1].den}.`,
    ],
  };
}

/**
 * ROUND 2: Comparison Duel (Hanya Sama Pembilang atau Sama Penyebut)
 * 4 comparison questions strictly focusing on elementary curriculum:
 * 2 questions with same denominator, and 2 questions with same numerator.
 */
export function generateRound2ComparisonData() {
  const sameDenQuestions = [
    {
      type: 'same_den' as const,
      description: 'Penyebut Sama: Bandingkan pembilangnya langsung!',
      f1: createFraction(2, 7),
      f2: createFraction(5, 7),
      correctSymbol: '<' as const,
      explanation: 'Penyebutnya sama (7). Karena pembilang 5 lebih besar daripada 2 (5 > 2), maka 2/7 < 5/7.',
    },
    {
      type: 'same_den' as const,
      description: 'Penyebut Sama: Semakin besar pembilang, nilainya semakin besar!',
      f1: createFraction(6, 10),
      f2: createFraction(4, 10),
      correctSymbol: '>' as const,
      explanation: 'Penyebutnya sama (10). Karena pembilang 6 lebih besar daripada 4 (6 > 4), maka 6/10 > 4/10.',
    },
    {
      type: 'same_den' as const,
      description: 'Penyebut Sama: Bandingkan pembilangnya!',
      f1: createFraction(3, 8),
      f2: createFraction(7, 8),
      correctSymbol: '<' as const,
      explanation: 'Penyebutnya sama (8). Karena pembilang 3 lebih kecil daripada 7 (3 < 7), maka 3/8 < 7/8.',
    },
    {
      type: 'same_den' as const,
      description: 'Penyebut Sama: Bandingkan pembilangnya!',
      f1: createFraction(5, 6),
      f2: createFraction(2, 6),
      correctSymbol: '>' as const,
      explanation: 'Penyebutnya sama (6). Karena pembilang 5 lebih besar daripada 2 (5 > 2), maka 5/6 > 2/6.',
    },
  ];

  const sameNumQuestions = [
    {
      type: 'same_num' as const,
      description: 'Pembilang Sama: Semakin kecil penyebut, potongannya semakin besar!',
      f1: createFraction(3, 4),
      f2: createFraction(3, 8),
      correctSymbol: '>' as const,
      explanation: 'Pembilangnya sama (3). Penyebut yang lebih kecil (4 < 8) menghasilkan potongan yang lebih besar, maka 3/4 > 3/8.',
    },
    {
      type: 'same_num' as const,
      description: 'Pembilang Sama: Semakin besar penyebut, potongannya semakin kecil!',
      f1: createFraction(2, 5),
      f2: createFraction(2, 3),
      correctSymbol: '<' as const,
      explanation: 'Pembilangnya sama (2). Penyebut 5 lebih besar daripada 3 sehingga potongannya lebih kecil, maka 2/5 < 2/3.',
    },
    {
      type: 'same_num' as const,
      description: 'Pembilang Sama: Bandingkan ukuran potongan penyebut!',
      f1: createFraction(4, 5),
      f2: createFraction(4, 9),
      correctSymbol: '>' as const,
      explanation: 'Pembilangnya sama (4). Penyebut 5 lebih kecil daripada 9, maka 4/5 > 4/9.',
    },
    {
      type: 'same_num' as const,
      description: 'Pembilang Sama: Bandingkan ukuran potongan penyebut!',
      f1: createFraction(1, 6),
      f2: createFraction(1, 3),
      correctSymbol: '<' as const,
      explanation: 'Pembilangnya sama (1). Pecahan 1/6 lebih kecil daripada 1/3 karena 1 dibagi 6 bagian lebih kecil daripada 1 dibagi 3 bagian, maka 1/6 < 1/3.',
    },
  ];

  const pickedSameDen = shuffleArray(sameDenQuestions).slice(0, 2);
  const pickedSameNum = shuffleArray(sameNumQuestions).slice(0, 2);

  return {
    questions: shuffleArray([...pickedSameDen, ...pickedSameNum]),
  };
}

/**
 * ROUND 3: Ordering Showdown (Hanya Sama Pembilang atau Sama Penyebut)
 * 2 challenges:
 * Challenge 1: Mengurutkan 4 pecahan dengan PENYEBUT SAMA dari terkecil ke terbesar.
 * Challenge 2: Mengurutkan 4 pecahan dengan PEMBILANG SAMA dari terkecil ke terbesar.
 */
export function generateRound3OrderingData() {
  // Challenge 1: Penyebut Sama (Penyebut 8: 1/8 < 3/8 < 5/8 < 7/8)
  const challenge1Solved: Fraction[] = [
    createFraction(1, 8, 'den1'),
    createFraction(3, 8, 'den2'),
    createFraction(5, 8, 'den3'),
    createFraction(7, 8, 'den4'),
  ];

  // Challenge 2: Pembilang Sama (Pembilang 2: 2/9 < 2/7 < 2/5 < 2/3)
  const challenge2Solved: Fraction[] = [
    createFraction(2, 9, 'num1'),
    createFraction(2, 7, 'num2'),
    createFraction(2, 5, 'num3'),
    createFraction(2, 3, 'num4'),
  ];

  return {
    stage1: {
      title: 'Tantangan 1: Penyebut Sama (Penyebut 8)',
      hint: 'Jika penyebutnya sama, urutkan langsung dari pembilang terkecil ke terbesar (1 -> 3 -> 5 -> 7)!',
      shuffledCards: shuffleArray(challenge1Solved),
      correctOrder: challenge1Solved,
    },
    stage2: {
      title: 'Tantangan 2: Pembilang Sama (Pembilang 2)',
      hint: 'Jika pembilangnya sama, pecahan dengan penyebut paling besar memiliki nilai paling kecil (2/9 < 2/7 < 2/5 < 2/3)!',
      shuffledCards: shuffleArray(challenge2Solved),
      correctOrder: challenge2Solved,
    },
  };
}

/**
 * ROUND 4: Secret Code Breaker
 * 4 digital vault slots with distinct mathematical condition clues.
 */
export function generateRound4Data() {
  // Clues with clear mathematical truth:
  // Slot 1: Senilai dengan 1/2
  // Slot 2: Lebih besar daripada 2/3
  // Slot 3: Lebih kecil daripada 1/4
  // Slot 4: Senilai dengan 3/4
  const slots = [
    {
      id: 'slot-1',
      title: 'KODE SLOT 1',
      clue: 'Pecahan senilai dengan 1/2',
      predicate: (f: Fraction) => areEquivalent(f, { id: '', num: 1, den: 2 }),
      correctFraction: createFraction(4, 8, 'correct1'),
      explanation: '4/8 senilai dengan 1/2 karena 4/8 disederhanakan menjadi 1/2.',
    },
    {
      id: 'slot-2',
      title: 'KODE SLOT 2',
      clue: 'Pecahan yang LEBIH BESAR daripada 2/3',
      predicate: (f: Fraction) => compareFractions(f, { id: '', num: 2, den: 3 }) > 0,
      correctFraction: createFraction(5, 6, 'correct2'),
      explanation: '5/6 (0.833) lebih besar daripada 2/3 (0.667). Perkalian silang: 5 × 3 = 15 > 6 × 2 = 12.',
    },
    {
      id: 'slot-3',
      title: 'KODE SLOT 3',
      clue: 'Pecahan yang LEBIH KECIL daripada 1/4',
      predicate: (f: Fraction) => compareFractions(f, { id: '', num: 1, den: 4 }) < 0,
      correctFraction: createFraction(1, 6, 'correct3'),
      explanation: '1/6 (0.166) lebih kecil daripada 1/4 (0.250). Perkalian silang: 1 × 4 = 4 < 6 × 1 = 6.',
    },
    {
      id: 'slot-4',
      title: 'KODE SLOT 4',
      clue: 'Pecahan senilai dengan 3/4',
      predicate: (f: Fraction) => areEquivalent(f, { id: '', num: 3, den: 4 }),
      correctFraction: createFraction(9, 12, 'correct4'),
      explanation: '9/12 senilai dengan 3/4 karena pembilang dan penyebut sama-sama dibagi 3 menghasilkan 3/4.',
    },
  ];

  // Distractors that don't satisfy all or confuse if carelessly chosen
  const distractors: Fraction[] = [
    createFraction(2, 5, 'dist1'), // 0.40 (neither < 1/4 nor > 2/3 nor = 1/2 nor = 3/4)
    createFraction(3, 8, 'dist2'), // 0.375
    createFraction(3, 5, 'dist3'), // 0.60
    createFraction(7, 10, 'dist4'), // 0.70
  ];

  const pool = shuffleArray([...slots.map(s => s.correctFraction), ...distractors]);

  return {
    slots,
    pool,
  };
}

/**
 * ROUND 5: Ultimate Fraction Matrix
 * 4x4 matrix of 16 fraction cards.
 * 4 rows, each row must contain 4 equivalent fractions.
 * Rows must be strictly ordered from smallest value (row 1) to largest value (row 4).
 */
export function generateRound5Data() {
  // 4 ordered base fractions:
  // Row 1: 1/4 (0.25)
  // Row 2: 1/3 (0.333)
  // Row 3: 1/2 (0.5)
  // Row 4: 3/4 (0.75)
  const orderedBases = [
    { num: 1, den: 4, name: 'Keluarga 1/4' },
    { num: 1, den: 3, name: 'Keluarga 1/3' },
    { num: 1, den: 2, name: 'Keluarga 1/2' },
    { num: 3, den: 4, name: 'Keluarga 3/4' },
  ];

  const rows = orderedBases.map((base, rIdx) => {
    return [1, 2, 3, 4].map(m => createFraction(base.num * m, base.den * m, `mRow${rIdx}`));
  });

  const allCards = rows.flat();

  return {
    orderedBases,
    solutionRows: rows,
    shuffledCards: shuffleArray(allCards),
  };
}

/**
 * Validates whether 4 fractions in a group are all mutually equivalent.
 */
export function areAllEquivalent(fractions: Fraction[]): boolean {
  if (fractions.length === 0) return false;
  const first = fractions[0];
  return fractions.every(f => areEquivalent(first, f));
}
