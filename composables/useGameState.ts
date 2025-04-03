import type { WordPair } from '~/utils/wordPairs';

// Structure for player assignments including their role
export interface PlayerAssignment {
  name: string;
  word: string;
  isUndercover: boolean;
}

// Represents the current stage of the game on the play page
export type GamePhase = 'showing_words' | 'discussing' | 'voting' | 'elimination' | 'game_over_undercover_wins' | 'game_over_civilians_win' | 'error';

// --- Core Game Setup State ---
// Initial list of player names entered during setup
export const usePlayers = () => useState<string[]>('players', () => []);
// The word pair selected for the current game
export const useGameWordPair = () => useState<WordPair | null>('gameWordPair', () => null);
// Original assignments (name, word, isUndercover) for ALL players, ordered by input
export const useAssignments = () => useState<PlayerAssignment[]>('assignments', () => []);
// Stores the number of Undercover players selected during setup
export const useNumberOfUndercovers = () => useState<number>('numberOfUndercovers', () => 1);

// --- Round and Active Player Management State ---
// Players currently still in the game (shrinks each round)
export const useActivePlayers = () => useState<PlayerAssignment[]>('activePlayers', () => []);
// Current round number
export const useCurrentRound = () => useState<number>('currentRound', () => 1);
// Index within activePlayers for the current player revealing their word
export const useWordShowingPlayerIndex = () => useState<number>('wordShowingPlayerIndex', () => 0);

// --- Game Flow Control State ---
export const useGamePhase = () => useState<GamePhase>('gamePhase', () => 'showing_words');

// --- Voting State ---
// Tracks votes cast in the current round: { playerName: voteCount }
export const useCurrentVotes = () => useState<Record<string, number>>('currentVotes', () => ({}));
// Index of the player (within activePlayers array) whose turn it is to vote
export const useVotingPlayerIndex = () => useState<number>('votingPlayerIndex', () => 0);
// Flag indicating if the most recent vote resulted in a tie (no elimination)
export const useWasVoteTied = () => useState<boolean>('wasVoteTied', () => false);

// --- Elimination and Game End State ---
// Stores the player eliminated in the *most recent* round (if any) for display
export const useLastEliminated = () => useState<PlayerAssignment | null>('lastEliminated', () => null);
// Stores the history of players eliminated throughout the game
export const useEliminatedPlayersHistory = () => useState<PlayerAssignment[]>('eliminatedHistory', () => []);
// The final outcome message displayed on the game over screen
export const useGameOverMessage = () => useState<string>('gameOverMessage', () => '');
// Stores the final, ordered list of all players and their roles for the end screen
export const useFinalRoleReveal = () => useState<PlayerAssignment[]>('finalRoleReveal', () => []);