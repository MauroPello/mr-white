<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getRandomWordPair } from '~/utils/wordPairs';
import { saveGameStateToLocalStorage, loadGameStateFromLocalStorage, clearSavedGameState } from '~/utils/gameStateStorage';
import {
  usePlayers, useGameWordPair, useAssignments, useActivePlayers,
  useCurrentRound, useGamePhase, useCurrentVotes, useVotingPlayerIndex,
  useLastEliminated, useGameOverMessage, useFinalRoleReveal,
  useEliminatedPlayersHistory, useWasVoteTied, useNumberOfUndercovers,
  useWordShowingPlayerIndex,
  type PlayerAssignment
} from '~/composables/useGameState';

const router = useRouter();
const newPlayerName = ref('');
const selectedUndercovers = ref(1);
const savedGameState = ref<ReturnType<typeof loadGameStateFromLocalStorage>>(null);


// Get global state refs
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
const wordShowingPlayerIndex = useWordShowingPlayerIndex();

onMounted(() => {
    savedGameState.value = loadGameStateFromLocalStorage();
    // Always reset global state initially; it will be populated either by resumeGame or startNewGame
    resetGlobalGameState();
    if (!savedGameState.value) {
        resetLocalSetupState(); // Only reset the form input state if not resuming
    }
});

const maxPossibleUndercovers = computed(() => {
    const len = playersState.value?.length ?? 0;
    return Math.max(1, Math.floor(len / 2));
});

watch(playersState, (newPlayers) => {
    const len = newPlayers?.length ?? 0;
    const maxAllowed = Math.max(1, len - 1);
    if (selectedUndercovers.value > maxAllowed) {
        selectedUndercovers.value = maxAllowed;
    }
     if (selectedUndercovers.value < 1 && len >= 1) {
        selectedUndercovers.value = 1;
    }
}, { deep: true });

function resetLocalSetupState() {
    // Resets only the form inputs, not the global state managed by usePlayers
    selectedUndercovers.value = 1;
    newPlayerName.value = '';
    // playersState is reset globally in resetGlobalGameState
}

function resetGlobalGameState() {
    playersState.value = [];
    gameWordPair.value = null;
    assignments.value = [];
    activePlayers.value = [];
    currentRound.value = 1;
    gamePhase.value = 'showing_words';
    wordShowingPlayerIndex.value = 0;
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
  const nameToAdd = newPlayerName.value.trim();
  if (nameToAdd && !playersState.value.includes(nameToAdd)) {
    playersState.value.push(nameToAdd); // Update global state directly
    newPlayerName.value = '';
  } else if (playersState.value.includes(nameToAdd)) {
    alert(`${nameToAdd} è già in gioco!`);
  }
}

function removePlayer(index: number) {
  playersState.value.splice(index, 1); // Update global state directly
}

function startNewGame() {
  clearSavedGameState(); // Clear any old save first

  const numPlayers = playersState.value.length;
  const numUndercovers = selectedUndercovers.value;
  if (numPlayers < 3 || numUndercovers < 1 || numUndercovers > maxPossibleUndercovers.value) {
       alert(`Impostazione non valida. Assicurati che ci siano almeno 3 giocatori e un numero valido di Infiltrati (1-${maxPossibleUndercovers.value}).`);
       return;
   }

  const selectedPair = getRandomWordPair();
  if (!selectedPair) { // Handle case where word pairs might be empty
      alert("Errore: Impossibile caricare le coppie di parole.");
      return;
  }
  const { civilian, undercover } = selectedPair;
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  // Fisher-Yates Shuffle
  for (let i = playerIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (playerIndices[i] && playerIndices[j]) {
      [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]!];
    }
  }
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));

  const initialAssignments: PlayerAssignment[] = playersState.value.map((name, index) => ({
      name: name,
      word: undercoverIndices.has(index) ? undercover : civilian,
      isUndercover: undercoverIndices.has(index)
  }));

  const shuffledAssignments = [...initialAssignments];
  // Fisher-Yates Shuffle (for reveal order)
  for (let i = shuffledAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (shuffledAssignments[i] && shuffledAssignments[j]) {
      [shuffledAssignments[i], shuffledAssignments[j]] = [shuffledAssignments[j], shuffledAssignments[i]!];
    }
  }

  // Populate global state refs
  gameWordPair.value = selectedPair;
  assignments.value = initialAssignments; // Store original order
  numberOfUndercoversState.value = numUndercovers;
  activePlayers.value = shuffledAssignments; // Start with shuffled for play
  currentRound.value = 1;
  gamePhase.value = 'showing_words';
  wordShowingPlayerIndex.value = 0;
  currentVotes.value = {};
  votingPlayerIndex.value = 0;
  lastEliminated.value = null;
  gameOverMessage.value = '';
  finalRoleReveal.value = [];
  eliminatedHistory.value = [];
  wasVoteTied.value = false;
  // playersState is already set via user input

  saveCurrentGameState(); // Save the newly initialized state
  router.push('/play');
}

function resumeGame() {
    if (!savedGameState.value) return;

    playersState.value = savedGameState.value.players;
    gameWordPair.value = savedGameState.value.gameWordPair;
    assignments.value = savedGameState.value.assignments;
    numberOfUndercoversState.value = savedGameState.value.numberOfUndercovers;
    activePlayers.value = savedGameState.value.activePlayers;
    currentRound.value = savedGameState.value.currentRound;
    gamePhase.value = savedGameState.value.gamePhase;
    wordShowingPlayerIndex.value = savedGameState.value.wordShowingPlayerIndex;
    currentVotes.value = savedGameState.value.currentVotes;
    votingPlayerIndex.value = savedGameState.value.votingPlayerIndex;
    wasVoteTied.value = savedGameState.value.wasVoteTied;
    lastEliminated.value = savedGameState.value.lastEliminated;
    eliminatedHistory.value = savedGameState.value.eliminatedHistory;
    gameOverMessage.value = savedGameState.value.gameOverMessage;
    finalRoleReveal.value = savedGameState.value.finalRoleReveal;

    savedGameState.value = null; // Clear the temporary holder
    router.push('/play');
}

function discardSavedGame() {
    clearSavedGameState();
    savedGameState.value = null;
    resetLocalSetupState();
    resetGlobalGameState(); // Ensure global state is also clean for the new form
}

function formatTimestamp(timestamp: number): string {
    if (!timestamp) return 'ora sconosciuta';
    return new Date(timestamp).toLocaleString('it-IT');
}

function saveCurrentGameState() {
    // Gather current state values. Ensure required ones are not null.
    if (!playersState.value || !gameWordPair.value || !assignments.value || !activePlayers.value ) {
         console.warn("Attempted to save, but essential state missing.");
         return;
    }
    saveGameStateToLocalStorage({
        players: playersState.value,
        gameWordPair: gameWordPair.value,
        assignments: assignments.value,
        numberOfUndercovers: numberOfUndercoversState.value,
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
    });
}
</script>


<template>
  <div class="container setup-page">
    <h1>L'Infiltrato</h1>

    <!-- Resume Option -->
    <div v-if="savedGameState" class="resume-section section">
      <h2>Riprendere Partita Precedente?</h2>
      <p>Trovato stato partita del {{ formatTimestamp(savedGameState.timestamp) }}.</p>
      <div class="resume-buttons">
        <button @click="resumeGame" class="action-button resume-button">Riprendi Partita</button>
        <button @click="discardSavedGame" class="action-button discard-button">Scarta e Inizia Nuova</button>
      </div>
    </div>

    <!-- New Game Setup -->
    <div v-if="!savedGameState">
      <h2>Impostazione Nuova Partita</h2>
      <p>
          Gioca a L'Infiltrato (o Mr. White) online con i tuoi amici usando un solo telefono!
          Un party game di bluff e parole nascoste.
      </p>

      <div class="add-player section">
        <input
          v-model.trim="newPlayerName"
          @keyup.enter="addPlayer"
          placeholder="Inserisci nome giocatore"
          aria-label="Inserisci nome giocatore"
        />
        <button @click="addPlayer" :disabled="!newPlayerName">Aggiungi Giocatore</button>
      </div>

      <div v-if="playersState.length > 0" class="section">
        <h3>Giocatori ({{ playersState.length }}):</h3>
        <ul class="player-list">
          <li v-for="(player, index) in playersState" :key="player"> <!-- Use player name as key if unique -->
            <span>{{ player }}</span>
            <button @click="removePlayer(index)" class="remove-btn" aria-label="Rimuovi giocatore">×</button>
          </li>
        </ul>
      </div>

      <div v-if="playersState.length >= 3" class="section undercover-select">
        <label for="undercover-count">Numero di Infiltrati:</label>
        <input
            type="number"
            id="undercover-count"
            v-model.number="selectedUndercovers"
            :min="1"
            :max="maxPossibleUndercovers"
            aria-label="Numero di Infiltrati"
        />
        <span>(Min: 1, Max: {{ maxPossibleUndercovers }})</span>
      </div>

      <div v-if="playersState.length < 3" class="warning">
        Servono almeno 3 giocatori per iniziare.
      </div>
      <div v-if="playersState.length >= 3 && (selectedUndercovers < 1 || selectedUndercovers > maxPossibleUndercovers)" class="warning">
        Numero di Infiltrati non valido (Min: 1, Max: {{ maxPossibleUndercovers }}).
      </div>

      <button
        class="start-button"
        @click="startNewGame"
        :disabled="playersState.length < 3 || selectedUndercovers < 1 || selectedUndercovers > maxPossibleUndercovers"
      >
        Inizia Nuova Partita
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.container {
  @apply max-w-[500px] mx-auto my-8 p-8 bg-[#f9f9f9] rounded-lg shadow-md font-sans text-center;
}

h1 {
  @apply text-[#333] mb-2;
}

h2 {
  @apply text-[#555] mb-6;
}

.section {
  @apply mb-6 pb-4 border-b border-[#eee];
}

.section:last-of-type {
  @apply border-b-0 pb-0 mb-0;
}

.add-player {
  @apply flex gap-2;
}

input[type="text"],
input[type="number"] {
  @apply p-3 border border-[#ccc] rounded text-base;
}

input[type="text"] {
  @apply flex-grow;
}

input[type="number"] {
  @apply w-[60px] text-center mx-2;
}

button {
  @apply px-6 py-3 bg-[#007bff] text-white border-0 rounded cursor-pointer text-base transition-colors duration-200;
}

button:disabled {
  @apply bg-[#cccccc] cursor-not-allowed;
}

button:not(:disabled):hover {
  @apply bg-[#0056b3];
}

.player-list {
  @apply list-none p-0 m-0 text-left;
}

.player-list li {
  @apply bg-white p-2 px-4 mb-2 border border-[#eee] rounded flex justify-between items-center;
}

.remove-btn {
  @apply bg-[#dc3545] text-white border-0 rounded-full w-6 h-6 text-base leading-none cursor-pointer p-0 shrink-0;
}

.remove-btn:hover {
  @apply bg-[#c82333];
}

.undercover-select {
  @apply flex items-center justify-center flex-wrap gap-2;
}

.undercover-select label {
  @apply mr-2 font-bold;
}

.undercover-select span {
  @apply text-[0.9em] text-[#666] ml-2;
}

.warning {
  @apply text-[#dc3545] mb-4 font-bold;
}

.start-button {
  @apply w-full p-4 text-xl bg-[#28a745] mt-6;
}

.start-button:not(:disabled):hover {
  @apply bg-[#218838];
}

.resume-section {
  @apply border-2 border-[#007bff] bg-[#e7f3ff] p-6 rounded-lg mb-8;
}

.resume-section h2 {
  @apply text-[#0056b3] mt-0 mb-4;
}

.resume-section p {
  @apply mb-6 text-[#333];
}

.resume-buttons {
  @apply flex justify-center gap-4;
}

.action-button {
  @apply px-6 py-[0.8rem] border-0 rounded-[5px] cursor-pointer text-base font-bold transition-colors duration-200 ease-linear;
}

.action-button:hover {
  @apply -translate-y-[1px];
}

.resume-button {
  @apply bg-[#28a745] text-white;
}

.resume-button:hover {
  @apply bg-[#218838];
}

.discard-button {
  @apply bg-[#dc3545] text-white;
}

.discard-button:hover {
  @apply bg-[#c82333];
}
</style>