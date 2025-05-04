import { computed, watchEffect } from "vue";
import type { WordPair } from "~/types/wordPairs";
import {
  saveGameStateToLocalStorage,
  clearSavedGameState as clearStorage,
  loadGameStateFromLocalStorage,
} from "~/utils/gameStateStorage";

// Types remain exported at the top level
export type PlayerRole = "Civilian" | "Undercover" | "MrWhite";
export interface PlayerAssignment {
  name: string;
  word: string | null;
  role: PlayerRole;
}
export type GamePhase =
  | "loading"
  | "showing_words"
  | "discussing"
  | "voting"
  | "elimination"
  | "game_over_undercovers_win"
  | "game_over_civilians_win"
  | "game_over_mr_white_wins"
  | "game_over_undercovers_mr_white_win"
  | "mr_white_guessing"
  | "error";

// The main composable function
export function useGameState() {
  // --- State Definitions (moved inside) ---
  const players = useState<string[]>("players", () => []);
  const gameWordPair = useState<WordPair | null>("gameWordPair", () => null);
  const assignments = useState<PlayerAssignment[]>("assignments", () => []);
  const numberOfUndercovers = useState<number>("numberOfUndercovers", () => 1);
  const numberOfMrWhites = useState<number>("numberOfMrWhites", () => 0);
  const activePlayers = useState<PlayerAssignment[]>("activePlayers", () => []);
  const currentRound = useState<number>("currentRound", () => 1);
  const wordShowingPlayerIndex = useState<number>(
    "wordShowingPlayerIndex",
    () => 0
  );
  const gamePhase = useState<GamePhase>("gamePhase", () => "loading");
  const showingWord = useState<boolean>("showingWord", () => false);
  const currentVotes = useState<Record<string, number>>(
    "currentVotes",
    () => ({})
  );
  const votingPlayerIndex = useState<number>("votingPlayerIndex", () => 0);
  const wasVoteTied = useState<boolean>("wasVoteTied", () => false);
  const lastEliminated = useState<PlayerAssignment | null>(
    "lastEliminated",
    () => null
  );
  const eliminatedHistory = useState<PlayerAssignment[]>(
    "eliminatedHistory",
    () => []
  );
  const gameOverMessage = useState<string>("gameOverMessage", () => "");
  const finalRoleReveal = useState<PlayerAssignment[]>(
    "finalRoleReveal",
    () => []
  );

  // Track Mr. White winners (by name or full assignment)
  const mrWhiteWinners = useState<PlayerAssignment[]>(
    "mrWhiteWinners",
    () => []
  );

  // --- Mr White Guessing State ---
  const mrWhiteGuessResult = useState<{ correct: boolean } | null>(
    "mrWhiteGuessResult",
    () => null
  );
  const pendingMrWhiteGuess = useState<boolean>(
    "pendingMrWhiteGuess",
    () => false
  );
  const mrWhiteGuessingPlayer = computed(() => {
    // The last eliminated player with role MrWhite
    if (lastEliminated.value && lastEliminated.value.role === "MrWhite") {
      return lastEliminated.value;
    }
    // Fallback: find in eliminatedHistory
    return (eliminatedHistory.value || []).find((p) => p.role === "MrWhite");
  });

  function mrWhiteGuess(guess: string) {
    if (!gameWordPair.value || !mrWhiteGuessingPlayer.value) return;
    // Normalize for comparison (case-insensitive, trim)
    const civilianWord = (gameWordPair.value.civilian || "")
      .trim()
      .toLowerCase();
    const userGuess = guess.trim().toLowerCase();
    const correct = civilianWord === userGuess;
    mrWhiteGuessResult.value = { correct };
    pendingMrWhiteGuess.value = false;

    // Remove the guessing Mr. White from activePlayers
    if (mrWhiteGuessingPlayer.value) {
      activePlayers.value = activePlayers.value.filter(
        (p) => p.name !== mrWhiteGuessingPlayer.value?.name
      );
    }

    // Track Mr. White winner if guessed correctly
    if (correct) {
      // Avoid duplicates
      if (
        !mrWhiteWinners.value.some(
          (w) => w.name === mrWhiteGuessingPlayer.value?.name
        )
      ) {
        mrWhiteWinners.value.push({ ...mrWhiteGuessingPlayer.value });
      }
    }

    // Always check if the game should end after a guess
    if (!checkAndDetermineWinner()) {
      // If the game is not over, continue to elimination phase for the next round
      gamePhase.value = "elimination";
    }
  }

  // Reset Mr White guess state when phase changes
  watchEffect(() => {
    if (gamePhase.value !== "mr_white_guessing") {
      mrWhiteGuessResult.value = null;
      pendingMrWhiteGuess.value = false;
    }
  });

  // --- Computed Properties (moved inside) ---
  const currentPlayerForWord = computed<PlayerAssignment | undefined>(() => {
    const phase = gamePhase.value;
    const playersArr = activePlayers.value;
    const index = wordShowingPlayerIndex.value;
    if (
      phase === "showing_words" &&
      playersArr &&
      playersArr.length > index &&
      index >= 0
    ) {
      return playersArr[index];
    }
    return undefined;
  });

  const isLastWordToShow = computed(() => {
    if (!activePlayers.value) return false;
    const index = wordShowingPlayerIndex.value;
    return index >= 0 && index >= activePlayers.value.length - 1;
  });

  const currentPlayerForVote = computed<PlayerAssignment | undefined>(() => {
    const phase = gamePhase.value;
    const playersArr = activePlayers.value;
    const index = votingPlayerIndex.value;
    if (
      phase === "voting" &&
      playersArr &&
      playersArr.length > index &&
      index >= 0
    ) {
      return playersArr[index];
    }
    return undefined;
  });

  const votingOptions = computed(() => activePlayers.value || []);

  const isLastVoter = computed(() => {
    if (!activePlayers.value) return false;
    return (
      votingPlayerIndex.value >= 0 &&
      votingPlayerIndex.value >= activePlayers.value.length - 1
    );
  });

  const eliminatedPlayerNames = computed(
    () => new Set((eliminatedHistory.value || []).map((p) => p.name))
  );

  const isPlayerEliminated = (playerName: string): boolean =>
    eliminatedPlayerNames.value.has(playerName);

  // --- Methods (moved inside) ---

  function getOriginalAssignmentsInOrder(): PlayerAssignment[] {
    const originalPlayerNames = players.value || [];
    const assignmentMap = new Map(
      (assignments.value || []).map((a) => [a.name, a])
    );
    return originalPlayerNames.map((name) => {
      const assignment = assignmentMap.get(name);
      return (
        assignment || {
          name: name,
          word: "Errore",
          role: "Civilian",
        }
      );
    });
  }

  function checkAndDetermineWinner(): boolean {
    // If a Mr. White guess is pending, do not check for winner yet
    if (pendingMrWhiteGuess.value) return false;
    if (gamePhase.value.startsWith("game_over") || !activePlayers.value) {
      return gamePhase.value.startsWith("game_over");
    }
    const currentActivePlayers = activePlayers.value;
    const numActivePlayers = currentActivePlayers.length;
    if (numActivePlayers === 0 && !gamePhase.value.startsWith("game_over")) {
      return false;
    }
    const numActiveUndercovers = currentActivePlayers.filter(
      (p) => p.role === "Undercover"
    ).length;
    const numActiveMrWhites = currentActivePlayers.filter(
      (p) => p.role === "MrWhite"
    ).length;
    const numActiveCivilians =
      numActivePlayers - numActiveUndercovers - numActiveMrWhites;
    const numMrWhiteWinners = mrWhiteWinners.value.length;

    let gameOver = false;
    let winnerMessage = "";
    let endPhase: GamePhase | null = null;

    console.log(numActiveUndercovers, numActiveMrWhites, numActiveCivilians, numMrWhiteWinners);

    if (
      numActiveUndercovers === 0 &&
      numActiveMrWhites === 0 &&
      numActiveCivilians > 0
    ) {
      gameOver = true;
      if (numMrWhiteWinners === 0) {
        winnerMessage =
        "Vincono i Cittadini! Tutti gli Undercover e Mr. White eliminati!";
        endPhase = "game_over_civilians_win";
      } else {
        winnerMessage = "Vincono i Mr. White!";
        endPhase = "game_over_mr_white_wins";
      }
    } else if (numActiveCivilians <= 1) {
      if (numActiveUndercovers > 0 && (numActiveMrWhites > 0 || numMrWhiteWinners > 0)) {
        gameOver = true;
        winnerMessage = "Vincono gli Undercover e Mr. White!";
        endPhase = "game_over_undercovers_mr_white_win";
      } else if (numActiveUndercovers > 0 && numActiveMrWhites === 0 && numMrWhiteWinners === 0) {
        gameOver = true;
        winnerMessage = "Vincono gli Undercover!";
        endPhase = "game_over_undercovers_win";
      } else if (numActiveMrWhites > 0 || numMrWhiteWinners > 0) {
        gameOver = true;
        winnerMessage = "Vincono i Mr. White!";
        endPhase = "game_over_mr_white_wins";
      } else if (
        numActivePlayers === 0 &&
        !gamePhase.value.startsWith("game_over")
      ) {
        console.error("Game ended with no players and no winner determined.");
        return false;
      }
    }
    if (gameOver && endPhase) {
      if (!gamePhase.value.startsWith("game_over")) {
        gamePhase.value = endPhase;
        gameOverMessage.value = winnerMessage;
        finalRoleReveal.value = getOriginalAssignmentsInOrder();
      }
      return true;
    }
    return false;
  }

  function goToDiscussion() {
    if (checkAndDetermineWinner()) return;
    if (gamePhase.value === "elimination" || wasVoteTied.value) {
      currentRound.value++;
    }
    gamePhase.value = "discussing";
    votingPlayerIndex.value = 0;
    currentVotes.value = {};
    wordShowingPlayerIndex.value = 0;
    if (!wasVoteTied.value) {
      lastEliminated.value = null;
    }
  }

  function processVotes() {
    const votes = currentVotes.value;
    let maxVotes = -1;
    let playersWithMaxVotes: string[] = [];
    const activeNames = (activePlayers.value || []).map((p) => p.name);
    activeNames.forEach((playerName) => {
      const voteCount = votes[playerName] || 0;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        playersWithMaxVotes = [playerName];
      } else if (voteCount === maxVotes && voteCount > 0) {
        playersWithMaxVotes.push(playerName);
      }
    });
    const totalVotesCast = Object.values(votes).reduce(
      (sum, count) => sum + count,
      0
    );
    if (playersWithMaxVotes.length === 1 && maxVotes > 0) {
      const eliminatedPlayerName = playersWithMaxVotes[0];
      const eliminatedPlayer = activePlayers.value.find(
        (p) => p.name === eliminatedPlayerName
      );
      if (!eliminatedPlayer) {
        console.error(
          "Error: Could not find eliminated player:",
          eliminatedPlayerName
        );
        gamePhase.value = "error";
        return;
      }
      wasVoteTied.value = false;
      lastEliminated.value = { ...eliminatedPlayer };
      eliminatedHistory.value = [
        ...eliminatedHistory.value,
        { ...eliminatedPlayer },
      ];
      // If Mr. White is eliminated, do NOT remove from activePlayers yet
      if (eliminatedPlayer.role === "MrWhite") {
        pendingMrWhiteGuess.value = true;
        gamePhase.value = "mr_white_guessing";
      } else {
        // Remove eliminated player immediately
        activePlayers.value = activePlayers.value.filter(
          (p) => p.name !== eliminatedPlayerName
        );
        gamePhase.value = "elimination";
        checkAndDetermineWinner();
      }
    } else if (
      playersWithMaxVotes.length > 1 ||
      (playersWithMaxVotes.length === 0 && totalVotesCast > 0) ||
      maxVotes === 0
    ) {
      wasVoteTied.value = true;
      lastEliminated.value = null;
      goToDiscussion();
    } else {
      console.warn("No votes were cast in this round.");
      wasVoteTied.value = true;
      lastEliminated.value = null;
      goToDiscussion();
    }
  }

  function castVote(votedForPlayerName: string, event: MouseEvent) {
    if (event && event.target instanceof HTMLElement) {
      event.target.blur();
    }
    if (currentVotes.value[votedForPlayerName] === undefined) {
      console.error(
        `Attempted to vote for non-existent or ineligible player: ${votedForPlayerName}`
      );
      currentVotes.value[votedForPlayerName] = 0;
    }
    currentVotes.value[votedForPlayerName]++;
    const currentMaxVoterIndex = (activePlayers.value?.length ?? 0) - 1;
    if (isLastVoter.value || votingPlayerIndex.value >= currentMaxVoterIndex) {
      processVotes();
    } else {
      votingPlayerIndex.value++;
    }
  }

  function startVotingPhase() {
    wasVoteTied.value = false;
    gamePhase.value = "voting";
    votingPlayerIndex.value = 0;
    currentVotes.value = {};
    (activePlayers.value || []).forEach((player) => {
      if (player?.name) {
        currentVotes.value[player.name] = 0;
      }
    });
  }

  function showWordAction() {
    showingWord.value = true;
  }

  function hideWordAndProceed() {
    showingWord.value = false;
    const currentMaxIndex = (activePlayers.value?.length ?? 0) - 1;
    if (
      isLastWordToShow.value ||
      wordShowingPlayerIndex.value >= currentMaxIndex
    ) {
      goToDiscussion();
    } else {
      wordShowingPlayerIndex.value++;
    }
  }

  function saveCurrentGameState() {
    if (
      !players.value ||
      !gameWordPair.value ||
      !assignments.value ||
      !activePlayers.value
    ) {
      console.warn("Attempted to save incomplete game state.");
      return;
    }
    saveGameStateToLocalStorage({
      players: players.value,
      gameWordPair: gameWordPair.value,
      assignments: assignments.value,
      numberOfUndercovers: numberOfUndercovers.value,
      numberOfMrWhites: numberOfMrWhites.value,
      activePlayers: activePlayers.value,
      currentRound: currentRound.value,
      wordShowingPlayerIndex: wordShowingPlayerIndex.value,
      gamePhase: gamePhase.value,
      currentVotes: currentVotes.value,
      votingPlayerIndex: votingPlayerIndex.value,
      wasVoteTied: wasVoteTied.value,
      lastEliminated: lastEliminated.value,
      eliminatedHistory: eliminatedHistory.value,
      gameOverMessage: gameOverMessage.value,
      finalRoleReveal: finalRoleReveal.value,
      pendingMrWhiteGuess: pendingMrWhiteGuess.value,
      mrWhiteWinners: mrWhiteWinners.value,
    });
  }

  function loadAndInitializeGame() {
    const savedState = loadGameStateFromLocalStorage();
    if (savedState) {
      players.value = savedState.players;
      gameWordPair.value = savedState.gameWordPair;
      assignments.value = savedState.assignments;
      numberOfUndercovers.value = savedState.numberOfUndercovers;
      numberOfMrWhites.value = savedState.numberOfMrWhites ?? 0;
      activePlayers.value = savedState.activePlayers;
      currentRound.value = savedState.currentRound;
      wordShowingPlayerIndex.value = savedState.wordShowingPlayerIndex;
      gamePhase.value = savedState.gamePhase;
      currentVotes.value = savedState.currentVotes;
      votingPlayerIndex.value = savedState.votingPlayerIndex;
      wasVoteTied.value = savedState.wasVoteTied;
      lastEliminated.value = savedState.lastEliminated;
      eliminatedHistory.value = savedState.eliminatedHistory;
      gameOverMessage.value = savedState.gameOverMessage;
      finalRoleReveal.value = savedState.finalRoleReveal;
      pendingMrWhiteGuess.value = !!savedState.pendingMrWhiteGuess;
      mrWhiteWinners.value = savedState.mrWhiteWinners ?? [];
      showingWord.value = false;
      if (
        gamePhase.value.startsWith("game_over") &&
        (!finalRoleReveal.value || finalRoleReveal.value.length === 0)
      ) {
        finalRoleReveal.value = getOriginalAssignmentsInOrder();
      }
      const isGameOver = gamePhase.value.startsWith("game_over");
      if (
        !assignments.value ||
        assignments.value.length === 0 ||
        !activePlayers.value ||
        (activePlayers.value.length === 0 && !isGameOver) ||
        !gameWordPair.value
      ) {
        console.error("Loaded game state is invalid. Resetting.");
        clearGameState();
        gamePhase.value = "error";
        return false;
      }
      // If we are in mr_white_guessing phase, ensure Mr. White is still in activePlayers
      if (
        savedState.gamePhase === "mr_white_guessing" &&
        savedState.lastEliminated &&
        savedState.lastEliminated.role === "MrWhite"
      ) {
        const mrWhiteName = savedState.lastEliminated.name;
        if (
          !savedState.activePlayers.some(
            (p: PlayerAssignment) => p.name === mrWhiteName
          )
        ) {
          // Add Mr. White back to activePlayers for guessing phase
          savedState.activePlayers.push(savedState.lastEliminated);
          activePlayers.value = savedState.activePlayers;
        }
      }
      if (
        gamePhase.value !== "showing_words" ||
        wordShowingPlayerIndex.value > 0
      ) {
        checkAndDetermineWinner();
      }
    } else {
      console.log("No saved game state found or state is invalid.");
      // If no saved state, we probably shouldn't be on the 'gioca' page.
      // Setting phase to error might be okay, or maybe redirecting is better handled by the calling page.
      gamePhase.value = "error";
      return false; // Indicate failure to load/initialize from storage
    }
    return true; // Indicate success
  }

  function clearGameState() {
    players.value = [];
    gameWordPair.value = null;
    assignments.value = [];
    numberOfUndercovers.value = 1;
    numberOfMrWhites.value = 0;
    activePlayers.value = [];
    currentRound.value = 1;
    wordShowingPlayerIndex.value = 0;
    gamePhase.value = "loading"; // Reset to loading or an appropriate initial state
    showingWord.value = false;
    currentVotes.value = {};
    votingPlayerIndex.value = 0;
    wasVoteTied.value = false;
    lastEliminated.value = null;
    eliminatedHistory.value = [];
    gameOverMessage.value = "";
    finalRoleReveal.value = [];
    pendingMrWhiteGuess.value = false;
    mrWhiteWinners.value = [];
    clearStorage();
  }

  // Auto-saving watcher (moved inside)
  watchEffect(() => {
    // Prevent saving during initial load or error states
    if (
      gamePhase.value &&
      gamePhase.value !== "loading" &&
      gamePhase.value !== "error" &&
      activePlayers.value && // Ensure active players exist (might be empty array, that's ok)
      assignments.value &&
      assignments.value.length > 0 && // Ensure assignments exist
      gameWordPair.value // Ensure word pair exists
    ) {
      // Avoid saving right at the start before any interaction in showing_words phase
      if (
        gamePhase.value !== "showing_words" ||
        wordShowingPlayerIndex.value > 0 ||
        showingWord.value // Save if word is currently being shown
      ) {
        saveCurrentGameState();
      }
    }
  });

  // --- Return Values ---
  // Return all state, computed, and actions needed by components
  return {
    // State Refs
    players,
    gameWordPair,
    assignments,
    numberOfUndercovers,
    numberOfMrWhites,
    activePlayers,
    currentRound,
    wordShowingPlayerIndex,
    gamePhase,
    showingWord,
    currentVotes,
    votingPlayerIndex,
    wasVoteTied,
    lastEliminated,
    eliminatedHistory,
    gameOverMessage,
    finalRoleReveal,
    mrWhiteWinners,

    // Computed Refs
    currentPlayerForWord,
    isLastWordToShow,
    currentPlayerForVote,
    votingOptions,
    isLastVoter,
    eliminatedPlayerNames,
    isPlayerEliminated,
    saveCurrentGameState,

    // Actions
    initializeGame: loadAndInitializeGame,
    clearGameState,
    showWord: showWordAction,
    hideWordAndProceed,
    startVotingPhase,
    castVote,
    goToDiscussion,
    getOriginalAssignmentsInOrder, // Expose for Mr White guess reveal
    // Mr White Guessing
    mrWhiteGuess,
    mrWhiteGuessResult,
    mrWhiteGuessingPlayer,
    pendingMrWhiteGuess,
  };
}
