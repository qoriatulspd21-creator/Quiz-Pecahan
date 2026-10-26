export interface Fraction {
  id: string;
  num: number; // numerator (pembilang)
  den: number; // denominator (penyebut)
}

export type DifficultyLevel = 'pemula' | 'menengah' | 'champion';

export interface Team {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  avatar: string;
  members?: string;
  scores: {
    round1: number;
    round2: number;
    round3: number;
    round4: number;
    round5: number;
    total: number;
  };
  timeUsedSeconds: {
    round1: number;
    round2: number;
    round3: number;
    round4: number;
    round5: number;
    total: number;
  };
}

export type GameView = 
  | 'MAIN_MENU'
  | 'TEAM_SETUP'
  | 'IN_ROUND'
  | 'TURN_SUMMARY'
  | 'ROUND_SCOREBOARD'
  | 'CHAMPIONSHIP'
  | 'PRACTICE'
  | 'HOW_TO_PLAY'
  | 'TEACHER_SETTINGS';

export type RoundId = 1 | 2 | 3;

export interface GameSettings {
  turnDuration: number; // 30, 60, 90, 120, or 0 (no timer)
  difficulty: DifficultyLevel;
  soundEnabled: boolean;
  bgmEnabled: boolean;
}

export interface MatchState {
  currentRound: RoundId;
  currentTeamIndex: number;
  teams: Team[];
  isMatchActive: boolean;
  isMatchFinished: boolean;
  settings: GameSettings;
}

export interface RoundResultSummary {
  teamId: string;
  teamName: string;
  roundId: RoundId;
  scoreEarned: number;
  timeRemaining: number;
  explanation: string;
  breakdown: {
    label: string;
    score: number;
    maxScore: number;
  }[];
}
