/**
 * FRACTION CHAMPIONS: SECRET FRACTION CODE
 * The Battle of Fraction Minds — Standalone Educational Tournament Game for Elementary Grade 4
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  GameView,
  MatchState,
  Team,
  GameSettings,
  RoundResultSummary,
  RoundId,
} from './types/game';
import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { TeamSetupModal } from './components/TeamSetupModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameArenaHeader } from './components/GameArenaHeader';
import { MysteryFamilyRound } from './components/rounds/MysteryFamilyRound';
import { ComparisonRound } from './components/rounds/ComparisonRound';
import { OrderingRound } from './components/rounds/OrderingRound';
import { TurnEndModal } from './components/TurnEndModal';
import { RoundScoreboard } from './components/RoundScoreboard';
import { ChampionshipCeremony } from './components/ChampionshipCeremony';
import { PracticeMode } from './components/PracticeMode';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY = 'fraction_champions_match_v1';

const DEFAULT_SETTINGS: GameSettings = {
  turnDuration: 90,
  difficulty: 'menengah',
  soundEnabled: true,
  bgmEnabled: false,
};

const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Tim Alpha Falcon',
    color: 'from-sky-500 to-blue-600',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-400',
    avatar: '🦅',
    members: 'Ahmad, Siti, Doni',
    scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  },
  {
    id: 'team-2',
    name: 'Tim Cyber Tiger',
    color: 'from-orange-500 to-amber-600',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-400',
    avatar: '🐯',
    members: 'Budi, Rina, Farhan',
    scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  },
  {
    id: 'team-3',
    name: 'Tim Quantum Vortex',
    color: 'from-purple-500 to-violet-600',
    accentColor: '#9333ea',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    avatar: '⚡',
    members: 'Citra, Kevin, Dewi',
    scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  },
  {
    id: 'team-4',
    name: 'Tim Emerald Titan',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    avatar: '🐉',
    members: 'Eko, Nisa, Gilang',
    scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  },
  {
    id: 'team-5',
    name: 'Tim Solar Phoenix',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#e11d48',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-400',
    avatar: '🌟',
    members: 'Rizky, Maya, Tari',
    scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('MAIN_MENU');
  const [matchState, setMatchState] = useState<MatchState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.teams)) {
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return {
      currentRound: 1,
      currentTeamIndex: 0,
      teams: DEFAULT_TEAMS,
      isMatchActive: false,
      isMatchFinished: false,
      settings: DEFAULT_SETTINGS,
    };
  });

  // Current Turn Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(matchState.settings.turnDuration);
  const [turnSummary, setTurnSummary] = useState<RoundResultSummary | null>(null);
  const [roundSessionKey, setRoundSessionKey] = useState<number>(0);

  // Sync sound settings with SoundManager
  useEffect(() => {
    sounds.isSoundEnabled = matchState.settings.soundEnabled;
    sounds.isBgmEnabled = matchState.settings.bgmEnabled;
  }, [matchState.settings]);

  // Persist match state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
    } catch {
      // Ignore quota error
    }
  }, [matchState]);

  // Timer interval effect
  useEffect(() => {
    if (
      currentView !== 'IN_ROUND' ||
      turnSummary !== null ||
      !matchState.isMatchActive ||
      matchState.settings.turnDuration <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, turnSummary, matchState.isMatchActive, matchState.settings.turnDuration]);

  // Handle Turn Expiration
  const handleTimeExpired = () => {
    if (turnSummary !== null) return;
    sounds.playError();
    const currentTeam = matchState.teams[matchState.currentTeamIndex];
    handleTeamFinishRound({
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      roundId: matchState.currentRound,
      scoreEarned: 25, // partial consolation points
      timeRemaining: 0,
      explanation: 'Waktu giliran telah habis! Wasit Robot mengunci poin yang telah berhasil dikumpulkan tim.',
      breakdown: [
        { label: 'Poin Hasil Waktu Habis', score: 25, maxScore: 100 },
      ],
    });
  };

  // Start fresh tournament match
  const handleStartNewMatch = () => {
    setCurrentView('TEAM_SETUP');
  };

  // Confirm teams and start Round 1
  const handleConfirmTeamsAndStart = (teams: Team[], settings: GameSettings) => {
    // Reset scores for fresh match
    const resetTeams = teams.map(t => ({
      ...t,
      scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
      timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    }));

    setMatchState({
      currentRound: 1,
      currentTeamIndex: 0,
      teams: resetTeams,
      isMatchActive: true,
      isMatchFinished: false,
      settings,
    });

    setTimeRemaining(settings.turnDuration);
    setTurnSummary(null);
    setRoundSessionKey(k => k + 1);
    setCurrentView('IN_ROUND');
  };

  // Continue active match
  const handleContinueMatch = () => {
    if (matchState.isMatchFinished) {
      setCurrentView('CHAMPIONSHIP');
    } else {
      setCurrentView('IN_ROUND');
    }
  };

  // Reset match completely
  const handleResetMatch = () => {
    const resetTeams = matchState.teams.map(t => ({
      ...t,
      scores: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
      timeUsedSeconds: { round1: 0, round2: 0, round3: 0, round4: 0, round5: 0, total: 0 },
    }));

    setMatchState(prev => ({
      ...prev,
      currentRound: 1,
      currentTeamIndex: 0,
      teams: resetTeams,
      isMatchActive: false,
      isMatchFinished: false,
    }));

    setTimeRemaining(matchState.settings.turnDuration);
    setTurnSummary(null);
    setCurrentView('MAIN_MENU');
  };

  // When a team finishes their turn in the active round
  const handleTeamFinishRound = (summary: RoundResultSummary) => {
    const roundKey = `round${matchState.currentRound}` as keyof Team['scores'];
    const timeUsed = Math.max(0, matchState.settings.turnDuration - timeRemaining);

    // Update active team scores
    setMatchState(prev => {
      const copy = [...prev.teams];
      const teamIdx = prev.currentTeamIndex;
      const t = copy[teamIdx];
      const newRoundScore = summary.scoreEarned;

      // Ensure points aren't duplicated
      const updatedScores = {
        ...t.scores,
        [roundKey]: newRoundScore,
      };
      updatedScores.total =
        updatedScores.round1 +
        updatedScores.round2 +
        updatedScores.round3;

      const updatedTime = {
        ...t.timeUsedSeconds,
        [roundKey]: timeUsed,
      };
      updatedTime.total =
        updatedTime.round1 +
        updatedTime.round2 +
        updatedTime.round3;

      copy[teamIdx] = {
        ...t,
        scores: updatedScores,
        timeUsedSeconds: updatedTime,
      };

      return {
        ...prev,
        teams: copy,
      };
    });

    setTurnSummary({
      ...summary,
      timeRemaining,
    });
  };

  // Proceed after viewing turn summary
  const handleProceedAfterTurn = () => {
    setTurnSummary(null);

    const hasNextTeam = matchState.currentTeamIndex < matchState.teams.length - 1;

    if (hasNextTeam) {
      // Advance to next team for same round
      setMatchState(prev => ({
        ...prev,
        currentTeamIndex: prev.currentTeamIndex + 1,
      }));
      setTimeRemaining(matchState.settings.turnDuration);
      setRoundSessionKey(k => k + 1);
    } else {
      // All teams finished current round -> show round scoreboard
      setCurrentView('ROUND_SCOREBOARD');
    }
  };

  // Proceed to next round from RoundScoreboard
  const handleProceedToNextRound = () => {
    if (matchState.currentRound >= 3) {
      // Final round completed!
      setMatchState(prev => ({
        ...prev,
        isMatchActive: false,
        isMatchFinished: true,
      }));
      setCurrentView('CHAMPIONSHIP');
    } else {
      // Advance to next round
      const nextRound = (matchState.currentRound + 1) as RoundId;
      setMatchState(prev => ({
        ...prev,
        currentRound: nextRound,
        currentTeamIndex: 0,
      }));
      setTimeRemaining(matchState.settings.turnDuration);
      setRoundSessionKey(k => k + 1);
      setCurrentView('IN_ROUND');
    }
  };

  // Sound toggles
  const handleToggleSound = () => {
    const next = !matchState.settings.soundEnabled;
    sounds.isSoundEnabled = next;
    if (next) sounds.playClick();
    setMatchState(prev => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: next },
    }));
  };

  const handleToggleBgm = () => {
    const next = !matchState.settings.bgmEnabled;
    sounds.toggleBgm(next);
    setMatchState(prev => ({
      ...prev,
      settings: { ...prev.settings, bgmEnabled: next },
    }));
  };

  const activeTeam = matchState.teams[matchState.currentTeamIndex] || matchState.teams[0];
  const nextTeam = matchState.teams[matchState.currentTeamIndex + 1];

  const roundNames: { [key in RoundId]: string } = {
    1: 'Mystery Family (2 Kelompok Senilai)',
    2: 'Perbandingan Pecahan (Sama Pembilang / Penyebut)',
    3: 'Mengurutkan Pecahan (Sama Pembilang / Penyebut)',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={view => {
          sounds.playClick();
          setCurrentView(view);
        }}
        soundEnabled={matchState.settings.soundEnabled}
        bgmEnabled={matchState.settings.bgmEnabled}
        onToggleSound={handleToggleSound}
        onToggleBgm={handleToggleBgm}
        isMatchActive={matchState.isMatchActive}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col">
        {/* VIEW: MAIN MENU */}
        {currentView === 'MAIN_MENU' && (
          <MainMenu
            onNavigate={setCurrentView}
            isMatchActive={matchState.isMatchActive}
            onContinueMatch={handleContinueMatch}
            onStartNewMatch={handleStartNewMatch}
          />
        )}

        {/* VIEW: TEAM SETUP */}
        {currentView === 'TEAM_SETUP' && (
          <TeamSetupModal
            initialTeams={matchState.teams}
            initialSettings={matchState.settings}
            onConfirmTeams={handleConfirmTeamsAndStart}
            onBack={() => setCurrentView('MAIN_MENU')}
          />
        )}

        {/* VIEW: TEACHER SETTINGS */}
        {currentView === 'TEACHER_SETTINGS' && (
          <TeacherSettingsModal
            settings={matchState.settings}
            onUpdateSettings={newSettings => {
              setMatchState(prev => ({ ...prev, settings: newSettings }));
            }}
            onResetMatch={handleResetMatch}
            onBack={() => setCurrentView('MAIN_MENU')}
            isMatchActive={matchState.isMatchActive}
          />
        )}

        {/* VIEW: HOW TO PLAY */}
        {currentView === 'HOW_TO_PLAY' && (
          <HowToPlayModal onBack={() => setCurrentView('MAIN_MENU')} />
        )}

        {/* VIEW: PRACTICE MODE */}
        {currentView === 'PRACTICE' && (
          <PracticeMode onBack={() => setCurrentView('MAIN_MENU')} />
        )}

        {/* VIEW: ACTIVE TOURNAMENT ROUND */}
        {currentView === 'IN_ROUND' && (
          <div className="flex-1 flex flex-col">
            <GameArenaHeader
              roundId={matchState.currentRound}
              roundName={roundNames[matchState.currentRound]}
              activeTeam={activeTeam}
              allTeams={matchState.teams}
              currentTeamIndex={matchState.currentTeamIndex}
              timeRemaining={timeRemaining}
              totalDuration={matchState.settings.turnDuration}
              onTimeExpired={handleTimeExpired}
            />

            <div className="flex-1 py-4" key={`round-session-${roundSessionKey}`}>
              {matchState.currentRound === 1 && (
                <MysteryFamilyRound
                  difficulty={matchState.settings.difficulty}
                  teamId={activeTeam.id}
                  teamName={activeTeam.name}
                  onFinishRound={handleTeamFinishRound}
                />
              )}
              {matchState.currentRound === 2 && (
                <ComparisonRound
                  teamId={activeTeam.id}
                  teamName={activeTeam.name}
                  onFinishRound={handleTeamFinishRound}
                />
              )}
              {matchState.currentRound === 3 && (
                <OrderingRound
                  teamId={activeTeam.id}
                  teamName={activeTeam.name}
                  onFinishRound={handleTeamFinishRound}
                />
              )}
            </div>

            {/* Turn End Modal */}
            {turnSummary && (
              <TurnEndModal
                summary={turnSummary}
                hasNextTeam={matchState.currentTeamIndex < matchState.teams.length - 1}
                nextTeamName={nextTeam?.name}
                onProceed={handleProceedAfterTurn}
              />
            )}
          </div>
        )}

        {/* VIEW: ROUND SCOREBOARD */}
        {currentView === 'ROUND_SCOREBOARD' && (
          <RoundScoreboard
            roundId={matchState.currentRound}
            teams={matchState.teams}
            onProceedToNextRound={handleProceedToNextRound}
          />
        )}

        {/* VIEW: GRAND CHAMPIONSHIP CEREMONY */}
        {currentView === 'CHAMPIONSHIP' && (
          <ChampionshipCeremony
            teams={matchState.teams}
            onPlayAgain={handleStartNewMatch}
            onGoHome={() => setCurrentView('MAIN_MENU')}
          />
        )}
      </main>
    </div>
  );
}
