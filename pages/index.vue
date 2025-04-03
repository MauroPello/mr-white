<template>
  <div class="container setup-page">
    <h1>Undercover / Mr. White</h1>

    <!-- Resume Option -->
    <div v-if="savedGameState" class="resume-section section">
        <h2>Resume Previous Game?</h2>
        <p>A game state from {{ formatTimestamp(savedGameState.timestamp) }} was found.</p>
        <div class="resume-buttons">
            <button @click="resumeGame" class="action-button resume-button">Resume Game</button>
            <button @click="discardSavedGame" class="action-button discard-button">Discard & Start New</button>
        </div>
    </div>

    <!-- New Game Setup (Shown if no saved game or discard is clicked) -->
    <div v-if="!savedGameState">
        <h2>New Game Setup</h2>

        <!-- Add Player Section -->
        <div class="add-player section">
          <input
            v-model.trim="newPlayerName"
            @keyup.enter="addPlayer"
            placeholder="Enter player name"
            aria-label="Enter player name"
          />
          <button @click="addPlayer" :disabled="!newPlayerName">Add Player</button>
        </div>

        <!-- Player List -->
        <div v-if="playersState.length > 0" class="section">
          <h3>Players ({{ playersState.length }}):</h3>
          <ul class="player-list">
            <li v-for="(player, index) in playersState" :key="index">
              <span>{{ player }}</span>
              <button @click="removePlayer(index)" class="remove-btn" aria-label="Remove player">×</button>
            </li>
          </ul>
        </div>

        <!-- Number of Undercovers Selection -->
        <div v-if="playersState.length >= 3" class="section undercover-select">
            <label for="undercover-count">Number of Undercover Players:</label>
            <input
                type="number"
                id="undercover-count"
                v-model.number="selectedUndercovers"
                :min="1"
                :max="maxPossibleUndercovers"
                aria-label="Number of Undercover Players"
            />
            <span>(Min: 1, Max: {{ maxPossibleUndercovers }})</span>
        </div>

        <!-- Validation Messages -->
        <div v-if="playersState.length < 3" class="warning">
          You need at least 3 players to start.
        </div>
        <div v-if="playersState.length >= 3 && selectedUndercovers > maxPossibleUndercovers" class="warning">
           Too many Undercovers selected. Max is {{ maxPossibleUndercovers }}.
        </div>

        <!-- Start Button -->
        <button
          class="start-button"
          @click="startNewGame"
          :disabled="playersState.length < 3 || selectedUndercovers > maxPossibleUndercovers || selectedUndercovers < 1"
        >
          Start New Game
        </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getRandomWordPair } from '~/utils/wordPairs';
import { saveGameStateToLocalStorage, loadGameStateFromLocalStorage, clearSavedGameState } from '~/utils/gameStateStorage';
import {
  usePlayers,
  useGameWordPair,
  useAssignments,
  useActivePlayers,
  useCurrentRound,
  useGamePhase,
  useCurrentVotes,
  useVotingPlayerIndex,
  useLastEliminated,
  useGameOverMessage,
  useFinalRoleReveal,
  useEliminatedPlayersHistory,
  useWasVoteTied,
  useNumberOfUndercovers, // Import new state
  type PlayerAssignment
} from '~/composables/useGameState';

const router = useRouter();
const newPlayerName = ref('');
const selectedUndercovers = ref(1); // Local state for the input
const savedGameState = ref<ReturnType<typeof loadGameStateFromLocalStorage>>(null); // Holds loaded state if found

// Get all state composables
const playersState = usePlayers();
const gameWordPair = useGameWordPair();
const assignments = useAssignments();
const activePlayers = useActivePlayers();
const currentRound = useCurrentRound();
const gamePhase = useGamePhase();
const currentVotes = useCurrentVotes();
const votingPlayerIndex = useVotingPlayerIndex();
const lastEliminated = useLastEliminated();
const gameOverMessage = useGameOverMessage();
const finalRoleReveal = useFinalRoleReveal();
const eliminatedHistory = useEliminatedPlayersHistory();
const wasVoteTied = useWasVoteTied();
const numberOfUndercoversState = useNumberOfUndercovers();

// Reset ALL game state when navigating to setup page
playersState.value = [];
gameWordPair.value = null;
assignments.value = [];
activePlayers.value = [];
currentRound.value = 1;
gamePhase.value = 'showing_words';
currentVotes.value = {};
votingPlayerIndex.value = 0;
lastEliminated.value = null;
gameOverMessage.value = '';
finalRoleReveal.value = [];
eliminatedHistory.value = [];
wasVoteTied.value = false;
numberOfUndercoversState.value = 1; // Reset selected count
selectedUndercovers.value = 1; // Reset local input state

// Calculate max possible undercovers (must leave at least 1 civilian)
const maxPossibleUndercovers = computed(() => {
    return Math.max(1, Math.floor(playersState.value.length / 2));
});

// --- Lifecycle Hook: Check for saved game on mount ---
onMounted(() => {
    savedGameState.value = loadGameStateFromLocalStorage();
    // If no saved game, ensure the setup state is clear (it should be from navigation, but belts and suspenders)
    if (!savedGameState.value) {
        resetLocalSetupState(); // Reset player list, etc. for new game form
    } else {
        // Clear the actual game state refs now, as they will be populated by resume or new game later
        // This prevents old state potentially flashing if user chooses 'start new'
         resetGlobalGameState();
    }
});

// Watch for changes in player count and adjust selected undercovers if needed
watch(playersState, (newPlayers) => {
    const maxAllowed = Math.max(1, newPlayers.length - 1);
    if (selectedUndercovers.value > maxAllowed) {
        selectedUndercovers.value = maxAllowed;
    }
     if (selectedUndercovers.value < 1 && newPlayers.length >= 1) {
        selectedUndercovers.value = 1; // Ensure at least 1 if possible
    }
}, { deep: true });

// Function to reset local refs used *only* for the setup form
function resetLocalSetupState() {
    playersState.value = [];
    selectedUndercovers.value = 1;
    newPlayerName.value = '';
}

// Function to reset ALL global game state refs
function resetGlobalGameState() {
    playersState.value = []; // Also part of global state if needed elsewhere, reset here too
    gameWordPair.value = null;
    assignments.value = [];
    activePlayers.value = [];
    currentRound.value = 1;
    gamePhase.value = 'showing_words'; // Default start phase
    currentVotes.value = {};
    votingPlayerIndex.value = 0;
    lastEliminated.value = null;
    gameOverMessage.value = '';
    finalRoleReveal.value = [];
    eliminatedHistory.value = [];
    wasVoteTied.value = false;
    numberOfUndercoversState.value = 1;
}

function addPlayer() {
  if (newPlayerName.value && !playersState.value.includes(newPlayerName.value)) {
    playersState.value.push(newPlayerName.value);
    newPlayerName.value = '';
  } else if (playersState.value.includes(newPlayerName.value)) {
    alert(`${newPlayerName.value} is already in the game!`);
  }
}

function removePlayer(index: number) {
  playersState.value.splice(index, 1);
  // Recalculate max and adjust selection if necessary (watcher handles this)
}

function startNewGame() {
  // 1. Clear any potentially saved state
  clearSavedGameState();

  // 2. Perform validation
   const numPlayers = playersState.value.length;
   const numUndercovers = selectedUndercovers.value;
   if (numPlayers < 3 || numUndercovers < 1 || numUndercovers > maxPossibleUndercovers.value) {
       alert(`Invalid setup. Ensure at least 3 players and a valid number of Undercovers (1-${maxPossibleUndercovers.value}).`);
       return;
   }

  // 3. Setup game state (logic moved here from old startGame)
  const selectedPair = getRandomWordPair();
  const { civilian, undercover } = selectedPair;
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  for (let i = playerIndices.length - 1; i > 0; i--) { /* Shuffle */ const j = Math.floor(Math.random() * (i + 1)); [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]]; }
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));
  const initialAssignments: PlayerAssignment[] = playersState.value.map((name, index) => ({ name, word: undercoverIndices.has(index) ? undercover : civilian, isUndercover: undercoverIndices.has(index) }));
  const shuffledAssignments = [...initialAssignments];
  for (let i = shuffledAssignments.length - 1; i > 0; i--) { /* Shuffle */ const j = Math.floor(Math.random() * (i + 1)); [shuffledAssignments[i], shuffledAssignments[j]] = [shuffledAssignments[j], shuffledAssignments[i]]; }

  // 4. Populate global state refs
  gameWordPair.value = selectedPair;
  assignments.value = initialAssignments;
  numberOfUndercoversState.value = numUndercovers;
  activePlayers.value = shuffledAssignments;
  currentRound.value = 1;
  gamePhase.value = 'showing_words';
  currentVotes.value = {};
  votingPlayerIndex.value = 0;
  lastEliminated.value = null;
  gameOverMessage.value = '';
  finalRoleReveal.value = [];
  eliminatedHistory.value = [];
  wasVoteTied.value = false;
  // playersState is already populated by the form

   // 5. Save the newly initialized state
   saveCurrentGameState(); // Use helper function

  // 6. Navigate
  router.push('/play');
}

function resumeGame() {
    if (!savedGameState.value) return;

    // Populate all the global state refs from the saved data
    playersState.value = savedGameState.value.players;
    gameWordPair.value = savedGameState.value.gameWordPair;
    assignments.value = savedGameState.value.assignments;
    numberOfUndercoversState.value = savedGameState.value.numberOfUndercovers;
    activePlayers.value = savedGameState.value.activePlayers;
    currentRound.value = savedGameState.value.currentRound;
    gamePhase.value = savedGameState.value.gamePhase;
    currentVotes.value = savedGameState.value.currentVotes;
    votingPlayerIndex.value = savedGameState.value.votingPlayerIndex;
    wasVoteTied.value = savedGameState.value.wasVoteTied;
    lastEliminated.value = savedGameState.value.lastEliminated;
    eliminatedHistory.value = savedGameState.value.eliminatedHistory;
    gameOverMessage.value = savedGameState.value.gameOverMessage;
    finalRoleReveal.value = savedGameState.value.finalRoleReveal;

    // Clear the temporary ref holding the loaded state
    savedGameState.value = null;

    // Navigate to the play page
    router.push('/play');
}


function discardSavedGame() {
    clearSavedGameState();
    savedGameState.value = null; // Hide resume section
    resetLocalSetupState(); // Prepare form for new game
    resetGlobalGameState(); // Ensure global state is also clear
}

// Helper to format timestamp (optional)
function formatTimestamp(timestamp: number): string {
    if (!timestamp) return 'unknown time';
    return new Date(timestamp).toLocaleString();
}

// Helper function to gather current state and save it
function saveCurrentGameState() {
    // Gathers *all* current state values needed for a full save
    saveGameStateToLocalStorage({
        players: playersState.value,
        gameWordPair: gameWordPair.value,
        assignments: assignments.value,
        numberOfUndercovers: numberOfUndercoversState.value,
        activePlayers: activePlayers.value,
        currentRound: currentRound.value,
        gamePhase: gamePhase.value,
        currentVotes: currentVotes.value,
        votingPlayerIndex: votingPlayerIndex.value,
        wasVoteTied: wasVoteTied.value,
        lastEliminated: lastEliminated.value,
        eliminatedHistory: eliminatedHistory.value,
        gameOverMessage: gameOverMessage.value, // Make sure to use the correct ref name if different
        finalRoleReveal: finalRoleReveal.value,
    });
}

</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
  text-align: center;
}

h1 { color: #333; margin-bottom: 0.5rem; }
h2 { color: #555; margin-bottom: 1.5rem; } /* Reduced margin */

.section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}
.section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}


.add-player { display: flex; gap: 0.5rem; }
input[type="text"], input[type="number"] {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
input[type="text"] { flex-grow: 1; }
input[type="number"] {
    width: 60px; /* Fixed width for number input */
    text-align: center;
    margin: 0 0.5rem;
}


button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}
button:disabled { background-color: #cccccc; cursor: not-allowed; }
button:not(:disabled):hover { background-color: #0056b3; }

.player-list { list-style: none; padding: 0; text-align: left; }
.player-list li {
  background-color: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-btn {
  background-color: #dc3545; color: white; border: none; border-radius: 50%;
  width: 24px; height: 24px; font-size: 1rem; line-height: 1; cursor: pointer; padding: 0;
}
.remove-btn:hover { background-color: #c82333; }

.undercover-select label {
    margin-right: 0.5rem;
    font-weight: bold;
}
.undercover-select span {
    font-size: 0.9em;
    color: #666;
    margin-left: 0.5rem;
}


.warning { color: #dc3545; margin-bottom: 1rem; font-weight: bold; }

.start-button {
  width: 100%; padding: 1rem; font-size: 1.2rem; background-color: #28a745; margin-top: 1rem;
}
.start-button:not(:disabled):hover { background-color: #218838; }

/* --- New Styles for Resume Section --- */
.resume-section {
    border: 2px solid #007bff;
    background-color: #e7f3ff;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.resume-section h2 {
    color: #0056b3;
    margin-top: 0;
    margin-bottom: 1rem;
}

.resume-section p {
    margin-bottom: 1.5rem;
    color: #333;
}

.resume-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.action-button { /* General style for buttons in this section */
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.action-button:hover {
    transform: translateY(-1px);
}

.resume-button {
    background-color: #28a745; /* Green */
    color: white;
}
.resume-button:hover {
     background-color: #218838;
}

.discard-button {
     background-color: #dc3545; /* Red */
     color: white;
}
.discard-button:hover {
      background-color: #c82333;
}

/* Ensure setup section styling remains */
.section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    /* border-bottom: 1px solid #eee; */ /* Optional: Remove border if resume section present */
}
.section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}
.undercover-select { /* Minor adjustments if needed */
     display: flex;
     align-items: center;
     justify-content: center;
     flex-wrap: wrap; /* Allow wrapping on small screens */
     gap: 0.5rem;
}
</style>