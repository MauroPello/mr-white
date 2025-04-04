<script setup lang="ts">
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
    resetGlobalGameState();
    if (!savedGameState.value) {
        resetLocalSetupState();
    }
});

const maxPossibleUndercovers = computed(() => {
    const len = playersState.value?.length ?? 0;
    return Math.max(1, Math.floor(len / 2));
});

watch(playersState, (newPlayers) => {
    const len = newPlayers?.length ?? 0;
    const maxAllowed = Math.max(1, Math.floor(len / 2));
    if (selectedUndercovers.value > maxAllowed) {
        selectedUndercovers.value = maxAllowed;
    }
     if (selectedUndercovers.value < 1 && len >= 3) {
        selectedUndercovers.value = 1;
    }
}, { deep: true });

function resetLocalSetupState() {
    selectedUndercovers.value = 1;
    newPlayerName.value = '';
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
    playersState.value.push(nameToAdd);
    newPlayerName.value = '';
  } else if (playersState.value.includes(nameToAdd)) {
    // Consider using UToast for non-blocking notifications instead of alert
    alert(`${nameToAdd} è già in gioco!`);
  }
}

function removePlayer(index: number) {
  playersState.value.splice(index, 1);
}

function startNewGame() {
  clearSavedGameState();

  const numPlayers = playersState.value.length;
  const numUndercovers = selectedUndercovers.value;
  if (numPlayers < 3 || numUndercovers < 1 || numUndercovers > maxPossibleUndercovers.value) {
       alert(`Impostazione non valida. Assicurati che ci siano almeno 3 giocatori e un numero valido di Infiltrati (1-${maxPossibleUndercovers.value}).`);
       return;
   }

  const selectedPair = getRandomWordPair();
  if (!selectedPair) { alert("Errore: Impossibile caricare le coppie di parole."); return; }

  const { civilian, undercover } = selectedPair;
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  for (let i = playerIndices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [playerIndices[i], playerIndices[j]] = [playerIndices[j]!, playerIndices[i]!]; }
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));

  const initialAssignments: PlayerAssignment[] = playersState.value.map((name, index) => ({
      name: name, word: undercoverIndices.has(index) ? undercover : civilian, isUndercover: undercoverIndices.has(index)
  }));

  const shuffledAssignments = [...initialAssignments];
  for (let i = shuffledAssignments.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffledAssignments[i], shuffledAssignments[j]] = [shuffledAssignments[j]!, shuffledAssignments[i]!]; }

  gameWordPair.value = selectedPair;
  assignments.value = initialAssignments;
  numberOfUndercoversState.value = numUndercovers;
  activePlayers.value = shuffledAssignments;
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

  saveCurrentGameState();
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

    savedGameState.value = null;
    router.push('/play');
}

function discardSavedGame() {
    clearSavedGameState();
    savedGameState.value = null;
    resetLocalSetupState();
    resetGlobalGameState();
}

function formatTimestamp(timestamp: number): string {
    if (!timestamp) return 'ora sconosciuta';
    return new Date(timestamp).toLocaleString('it-IT');
}

function saveCurrentGameState() {
    if (!playersState.value || !gameWordPair.value || !assignments.value || !activePlayers.value ) {
         console.warn("Attempted to save, but essential state missing."); return;
    }
    saveGameStateToLocalStorage({
        players: playersState.value, gameWordPair: gameWordPair.value, assignments: assignments.value,
        numberOfUndercovers: numberOfUndercoversState.value, activePlayers: activePlayers.value,
        currentRound: currentRound.value, wordShowingPlayerIndex: wordShowingPlayerIndex.value,
        gamePhase: gamePhase.value, currentVotes: currentVotes.value, votingPlayerIndex: votingPlayerIndex.value,
        wasVoteTied: wasVoteTied.value, lastEliminated: lastEliminated.value,
        eliminatedHistory: eliminatedHistory.value, gameOverMessage: gameOverMessage.value,
        finalRoleReveal: finalRoleReveal.value,
    });
}
</script>

<template>
  <UContainer class="py-8">
    <!-- Resume Option -->
    <UCard v-if="savedGameState" class="mb-8 bg-primary-50 dark:bg-primary-900/50">
      <template #header>
        <h2 class="text-xl font-semibold text-primary-700 dark:text-primary-300">
            Riprendere Partita Precedente?
        </h2>
      </template>

      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Trovato stato partita del {{ formatTimestamp(savedGameState.timestamp) }}.
      </p>

      <div class="flex justify-center gap-4">
        <UButton @click="resumeGame" color="green" size="lg">
            Riprendi Partita
        </UButton>
        <UButton @click="discardSavedGame" color="red" variant="soft" size="lg">
            Scarta e Inizia Nuova
        </UButton>
      </div>
    </UCard>

    <!-- New Game Setup -->
    <UCard v-if="!savedGameState">
        <template #header>
             <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Impostazione Nuova Partita
            </h2>
        </template>

        <!-- Add Player Section -->
        <UFormGroup label="Aggiungi Giocatore" class="mb-6">
            <div class="flex items-center gap-2">
                <UInput
                    v-model.trim="newPlayerName"
                    @keyup.enter="addPlayer"
                    placeholder="Nome giocatore..."
                    aria-label="Inserisci nome giocatore"
                    class="flex-grow"
                    size="lg"
                    icon="i-heroicons-user-plus"
                />
                <UButton
                    @click="addPlayer"
                    :disabled="!newPlayerName"
                    icon="i-heroicons-plus-circle"
                    size="lg"
                    aria-label="Aggiungi Giocatore"
                />
            </div>
        </UFormGroup>

        <!-- Player List -->
        <div v-if="playersState.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Giocatori ({{ playersState.length }}):
            </h3>
            <ul class="space-y-2">
                <li
                    v-for="(player, index) in playersState"
                    :key="player"
                    class="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <span class="text-gray-800 dark:text-gray-100">{{ player }}</span>
                    <UButton
                        @click="removePlayer(index)"
                        icon="i-heroicons-x-circle-20-solid"
                        color="red"
                        variant="ghost"
                        size="sm"
                        aria-label="Rimuovi giocatore"
                        />
                </li>
            </ul>
        </div>

        <!-- Number of Undercovers Selection -->
         <UFormGroup v-if="playersState.length >= 3" label="Numero di Infiltrati" class="mb-6">
            <div class="flex items-center justify-center gap-2 flex-wrap">
                 <UInput
                    type="number"
                    id="undercover-count"
                    v-model.number="selectedUndercovers"
                    :min="1"
                    :max="maxPossibleUndercovers"
                    aria-label="Numero di Infiltrati"
                    class="w-20 text-center"
                    size="md"
                />
                 <span class="text-sm text-gray-500 dark:text-gray-400">
                    (Min: 1, Max: {{ maxPossibleUndercovers }})
                 </span>
            </div>
         </UFormGroup>


        <!-- Validation Messages -->
         <UAlert
            v-if="playersState.length < 3"
            icon="i-heroicons-exclamation-triangle"
            color="orange"
            variant="soft"
            title="Attenzione"
            description="Servono almeno 3 giocatori per iniziare."
            class="mb-4"
         />
         <UAlert
            v-if="playersState.length >= 3 && (selectedUndercovers < 1 || selectedUndercovers > maxPossibleUndercovers)"
            icon="i-heroicons-exclamation-circle"
            color="red"
            variant="soft"
            title="Errore"
            :description="`Numero di Infiltrati non valido (Min: 1, Max: ${maxPossibleUndercovers}).`"
            class="mb-4"
         />

        <!-- Start Button -->
        <UButton
            @click="startNewGame"
            :disabled="playersState.length < 3 || selectedUndercovers < 1 || selectedUndercovers > maxPossibleUndercovers"
            size="xl"
            block
            color="primary"
            class="mt-4"
            trailing-icon="i-heroicons-arrow-right-circle-20-solid"
        >
            Inizia Nuova Partita
        </UButton>

    </UCard>
  </UContainer>
</template>
