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
    return Math.max(1, len - 1);
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
  for (let i = playerIndices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [playerIndices[i], playerIndices[j]] = [playerIndices[j], playerIndices[i]]; }
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));

  const initialAssignments: PlayerAssignment[] = playersState.value.map((name, index) => ({
      name: name,
      word: undercoverIndices.has(index) ? undercover : civilian,
      isUndercover: undercoverIndices.has(index)
  }));

  const shuffledAssignments = [...initialAssignments];
  // Fisher-Yates Shuffle (for reveal order)
  for (let i = shuffledAssignments.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffledAssignments[i], shuffledAssignments[j]] = [shuffledAssignments[j], shuffledAssignments[i]]; }

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

<style scoped>
.container { max-width: 500px; margin: 2rem auto; padding: 2rem; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); font-family: sans-serif; text-align: center; }
h1 { color: #333; margin-bottom: 0.5rem; }
h2 { color: #555; margin-bottom: 1.5rem; }
.section { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
.section:last-of-type { border-bottom: none; padding-bottom: 0; margin-bottom: 0; } /* Adjust spacing for last section */
.add-player { display: flex; gap: 0.5rem; }
input[type="text"], input[type="number"] { padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
input[type="text"] { flex-grow: 1; }
input[type="number"] { width: 60px; text-align: center; margin: 0 0.5rem; }
button { padding: 0.75rem 1.5rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background-color 0.2s ease; }
button:disabled { background-color: #cccccc; cursor: not-allowed; }
button:not(:disabled):hover { background-color: #0056b3; }
.player-list { list-style: none; padding: 0; margin: 0; text-align: left; }
.player-list li { background-color: #fff; padding: 0.5rem 1rem; margin-bottom: 0.5rem; border: 1px solid #eee; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
.remove-btn { background-color: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 1rem; line-height: 1; cursor: pointer; padding: 0; flex-shrink: 0; }
.remove-btn:hover { background-color: #c82333; }
.undercover-select { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.5rem; }
.undercover-select label { margin-right: 0.5rem; font-weight: bold; }
.undercover-select span { font-size: 0.9em; color: #666; margin-left: 0.5rem; }
.warning { color: #dc3545; margin-bottom: 1rem; font-weight: bold; }
.start-button { width: 100%; padding: 1rem; font-size: 1.2rem; background-color: #28a745; margin-top: 1.5rem; }
.start-button:not(:disabled):hover { background-color: #218838; }
.resume-section { border: 2px solid #007bff; background-color: #e7f3ff; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
.resume-section h2 { color: #0056b3; margin-top: 0; margin-bottom: 1rem; }
.resume-section p { margin-bottom: 1.5rem; color: #333; }
.resume-buttons { display: flex; justify-content: center; gap: 1rem; }
.action-button { padding: 0.8rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; transition: background-color 0.2s ease, transform 0.1s ease; }
.action-button:hover { transform: translateY(-1px); }
.resume-button { background-color: #28a745; color: white; }
.resume-button:hover { background-color: #218838; }
.discard-button { background-color: #dc3545; color: white; }
.discard-button:hover { background-color: #c82333; }
</style>