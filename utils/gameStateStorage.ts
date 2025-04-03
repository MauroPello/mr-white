import type { PlayerAssignment, GamePhase } from '~/composables/useGameState';
import type { WordPair } from '~/utils/wordPairs';

// Define the structure of the saved state
interface SavedGameState {
  timestamp: number; // To know how old the save is (optional but good)
  // --- Replicate state from useGameState ---
  players: string[];
  gameWordPair: WordPair | null;
  assignments: PlayerAssignment[];
  numberOfUndercovers: number;
  activePlayers: PlayerAssignment[];
  currentRound: number;
  gamePhase: GamePhase;
  currentVotes: Record<string, number>;
  votingPlayerIndex: number;
  wasVoteTied: boolean;
  lastEliminated: PlayerAssignment | null;
  eliminatedHistory: PlayerAssignment[];
  gameOverMessage: string;
  finalRoleReveal: PlayerAssignment[];
}

const STORAGE_KEY = 'undercoverGameState';

/**
 * Saves the current game state to localStorage.
 */
export function saveGameStateToLocalStorage(state: Omit<SavedGameState, 'timestamp'>): void {
  try {
    const stateToSave: SavedGameState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    // console.log('Game state saved:', stateToSave); // For debugging
  } catch (error) {
    console.error("Error saving game state to localStorage:", error);
  }
}

/**
 * Loads the game state from localStorage.
 * Returns the saved state object or null if none exists or if parsing fails.
 */
export function loadGameStateFromLocalStorage(): SavedGameState | null {
  try {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (!savedStateJSON) {
      return null;
    }
    const savedState = JSON.parse(savedStateJSON) as SavedGameState;
     // Optional: Could add validation here to check if structure is correct
    // console.log('Game state loaded:', savedState); // For debugging
    return savedState;
  } catch (error) {
    console.error("Error loading game state from localStorage:", error);
    // Clear potentially corrupted data
    clearSavedGameState();
    return null;
  }
}

/**
 * Clears the saved game state from localStorage.
 */
export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // console.log('Saved game state cleared.'); // For debugging
  } catch (error) {
     console.error("Error clearing saved game state:", error);
  }
}