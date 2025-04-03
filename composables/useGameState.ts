import type { WordPair } from '~/utils/wordPairs';

export interface PlayerAssignment {
  name: string;
  word: string;
  isUndercover: boolean;
}

// --- Core Game Setup ---
export const usePlayers = () => useState<string[]>('players', () => []);
export const useGameWordPair = () => useState<WordPair | null>('gameWordPair', () => null);
export const useAssignments = () => useState<PlayerAssignment[]>('assignments', () => []);
// --- New ---
// Stores the number of Undercover players selected during setup
export const useNumberOfUndercovers = () => useState<number>('numberOfUndercovers', () => 1);

// --- Round and Active Player Management ---
export const useActivePlayers = () => useState<PlayerAssignment[]>('activePlayers', () => []);
export const useCurrentRound = () => useState<number>('currentRound', () => 1);

// --- Game Flow Control ---
export type GamePhase = 'showing_words' | 'discussing' | 'voting' | 'elimination' | 'game_over_undercover_wins' | 'game_over_civilians_win' | 'error';
export const useGamePhase = () => useState<GamePhase>('gamePhase', () => 'showing_words');

// --- Voting State ---
export const useCurrentVotes = () => useState<Record<string, number>>('currentVotes', () => ({}));
export const useVotingPlayerIndex = () => useState<number>('votingPlayerIndex', () => 0);
export const useWasVoteTied = () => useState<boolean>('wasVoteTied', () => false);

// --- Elimination and Game End State ---
export const useLastEliminated = () => useState<PlayerAssignment | null>('lastEliminated', () => null);
export const useEliminatedPlayersHistory = () => useState<PlayerAssignment[]>('eliminatedHistory', () => []);
export const useGameOverMessage = () => useState<string>('gameOverMessage', () => '');
export const useFinalRoleReveal = () => useState<PlayerAssignment[]>('finalRoleReveal', () => []);