import type { PlayerAssignment, GamePhase } from "~/composables/useGameState";
import type { WordPair } from "~/types/wordPairs";

// Define the structure of the saved state
interface SavedGameState {
  timestamp: number;
  players: string[];
  gameWordPair: WordPair | null;
  assignments: PlayerAssignment[];
  numberOfUndercovers: number;
  numberOfMrWhites?: number;
  activePlayers: PlayerAssignment[];
  currentRound: number;
  wordShowingPlayerIndex: number;
  gamePhase: GamePhase;
  currentVotes: Record<string, number>;
  votingPlayerIndex: number;
  wasVoteTied: boolean;
  lastEliminated: PlayerAssignment | null;
  eliminatedHistory: PlayerAssignment[];
  gameOverMessage: string;
  finalRoleReveal: PlayerAssignment[];
  pendingMrWhiteGuess: boolean;
  mrWhiteWinners: PlayerAssignment[];
}

const STORAGE_KEY = "undercoverGameState";

/**
 * Saves the current game state to localStorage.
 */
export function saveGameStateToLocalStorage(
  state: Omit<SavedGameState, "timestamp">
): void {
  try {
    // Ensure essential parts are not null before saving
    if (
      !state.players ||
      !state.gameWordPair ||
      !state.assignments ||
      !state.activePlayers
    ) {
      return;
    }
    const stateToSave: SavedGameState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch {
    console.error("Failed to save game state to localStorage");
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

    // Add default value for wordShowingPlayerIndex if loading old state
    if (savedState.wordShowingPlayerIndex === undefined) {
      savedState.wordShowingPlayerIndex = 0;
    }
    // Add default value for numberOfMrWhites if loading old state
    if (savedState.numberOfMrWhites === undefined) {
      savedState.numberOfMrWhites = 0;
    }

    // Basic validation (check if essential keys exist)
    if (
      !savedState.players ||
      !savedState.assignments ||
      !savedState.activePlayers ||
      savedState.numberOfUndercovers === undefined ||
      savedState.currentRound === undefined ||
      !savedState.gamePhase
    ) {
      clearSavedGameState();
      return null;
    }

    return savedState;
  } catch {
    clearSavedGameState(); // Clear potentially corrupted data
    return null;
  }
}

/**
 * Clears the saved game state from localStorage.
 */
export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("Failed to clear game state from localStorage");
  }
}
