<template>
  <div class="container setup-page">
    <h1>Undercover / Mr. White</h1>
    <h2>Game Setup</h2>

    <!-- Add Player Section -->
    <div class="add-player">
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
       Too many Undercovers selected for the number of players. Max is {{ maxPossibleUndercovers }}.
     </div>


    <!-- Start Button -->
    <button
      class="start-button"
      @click="startGame"
      :disabled="playersState.length < 3 || selectedUndercovers > maxPossibleUndercovers || selectedUndercovers < 1"
    >
      Start Game
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getRandomWordPair } from '~/utils/wordPairs';
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
const numberOfUndercoversState = useNumberOfUndercovers(); // Access new global state

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

function startGame() {
  const numPlayers = playersState.value.length;
  const numUndercovers = selectedUndercovers.value;

  // Final validation before starting
  if (numPlayers < 3) {
    alert("You need at least 3 players.");
    return;
  }
   if (numUndercovers < 1 || numUndercovers > maxPossibleUndercovers.value) {
       alert(`Invalid number of Undercovers selected. Please choose between 1 and ${maxPossibleUndercovers.value}.`);
       return;
   }


  // 1. Select Word Pair
  const selectedPair = getRandomWordPair();
  gameWordPair.value = selectedPair;
  const { civilian, undercover } = selectedPair;

  // 2. Assign Roles (Modified for multiple undercovers)
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i); // [0, 1, 2, ...]

  // Shuffle indices to pick random players for undercover roles
  for (let i = playerIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]];
  }

  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers)); // Take the first 'numUndercovers' shuffled indices

  const initialAssignments: PlayerAssignment[] = playersState.value.map((name, index) => ({
    name: name,
    word: undercoverIndices.has(index) ? undercover : civilian, // Assign word based on index being in the undercover set
    isUndercover: undercoverIndices.has(index), // Mark as undercover accordingly
  }));

  // Shuffle the assignments list itself for the initial reveal order
  const shuffledAssignments = [...initialAssignments];
  for (let i = shuffledAssignments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAssignments[i], shuffledAssignments[j]] = [shuffledAssignments[j], shuffledAssignments[i]];
  }

  // --- Initialize Game State ---
  numberOfUndercoversState.value = numUndercovers; // Store selected number globally
  assignments.value = initialAssignments; // Store ORIGINAL assignments (ordered by input)
  activePlayers.value = [...shuffledAssignments]; // Start with SHUFFLED players active for reveal
  currentRound.value = 1;
  gamePhase.value = 'showing_words';
  currentVotes.value = {};
  votingPlayerIndex.value = 0;
  lastEliminated.value = null;
  gameOverMessage.value = '';
  finalRoleReveal.value = [];
  eliminatedHistory.value = [];
  wasVoteTied.value = false;


  // 3. Navigate to Play Page
  router.push('/play');
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
</style>