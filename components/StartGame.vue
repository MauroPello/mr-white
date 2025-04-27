<script setup lang="ts">
import { getRandomWordPair } from "~/utils/wordPairs";
import { wordPairs } from "~/constants/wordPairs"; // Import predefined word pairs
import {
  saveGameStateToLocalStorage,
  loadGameStateFromLocalStorage,
  clearSavedGameState,
} from "~/utils/gameStateStorage";
import type { WordPair } from "~/types/wordPairs";
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
  useNumberOfUndercovers,
  useWordShowingPlayerIndex,
  type PlayerAssignment,
} from "~/composables/useGameState";

const router = useRouter();
const newPlayerName = ref("");
const selectedUndercovers = ref(1);
const useCustomWords = ref(false); // Added state for custom words toggle
const customCivilianWord = ref("");
const customUndercoverWord = ref("");
const savedGameState =
  ref<ReturnType<typeof loadGameStateFromLocalStorage>>(null);

// Word Selection Mode
type WordSelectionMode = "random" | "custom" | "select";
const wordSelectionMode = ref<WordSelectionMode>("random");
const selectedPredefinedPairIndex = ref<number | undefined>(undefined); // Use undefined instead of null

const wordSelectionOptions = [
  { value: "random", label: "Casuali" },
  { value: "select", label: "Scelte dalla nostra lista" },
  { value: "custom", label: "Personalizzate" },
];

// Options for the Select Menu
const predefinedPairOptions = computed(() =>
  wordPairs.map((pair, index) => ({
    label: `${pair.civilian} / ${pair.undercover}`,
    value: index,
  }))
);

// Accordion items definition (Settings removed)
const accordionItems = [
  { label: "Giocatori e Infiltrati", slot: "players", defaultOpen: true },
  { label: "Parole", slot: "words" },
];

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

watch(
  playersState,
  (newPlayers) => {
    const len = newPlayers?.length ?? 0;
    const maxAllowed = Math.max(1, Math.floor(len / 2));
    if (selectedUndercovers.value > maxAllowed) {
      selectedUndercovers.value = maxAllowed;
    }
    if (selectedUndercovers.value < 1 && len >= 3) {
      selectedUndercovers.value = 1;
    }
  },
  { deep: true }
);

function resetLocalSetupState() {
  selectedUndercovers.value = 1;
  newPlayerName.value = "";
  useCustomWords.value = false;
  customCivilianWord.value = "";
  customUndercoverWord.value = "";
  wordSelectionMode.value = "random";
  selectedPredefinedPairIndex.value = undefined; // Reset to undefined
}

function resetGlobalGameState() {
  playersState.value = [];
  gameWordPair.value = null;
  assignments.value = [];
  activePlayers.value = [];
  currentRound.value = 1;
  gamePhase.value = "showing_words";
  wordShowingPlayerIndex.value = 0;
  currentVotes.value = {};
  votingPlayerIndex.value = 0;
  lastEliminated.value = null;
  gameOverMessage.value = "";
  finalRoleReveal.value = [];
  eliminatedHistory.value = [];
  wasVoteTied.value = false;
  numberOfUndercoversState.value = 1;
}

function addPlayer() {
  const nameToAdd = newPlayerName.value.trim();
  if (nameToAdd && !playersState.value.includes(nameToAdd)) {
    playersState.value.push(nameToAdd);
    newPlayerName.value = "";
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
  if (
    numPlayers < 3 ||
    numUndercovers < 1 ||
    numUndercovers > maxPossibleUndercovers.value
  ) {
    alert(
      `Impostazione non valida. Assicurati che ci siano almeno 3 giocatori e un numero valido di Infiltrati (1-${maxPossibleUndercovers.value}).`
    );
    return;
  }

  let selectedPair: WordPair | null = null; // Explicitly use imported WordPair type

  if (wordSelectionMode.value === "custom") {
    const civilianWord = customCivilianWord.value.trim();
    const undercoverWord = customUndercoverWord.value.trim();
    if (!civilianWord || !undercoverWord) {
      alert("Per favore, inserisci entrambe le parole personalizzate.");
      return;
    }
    if (civilianWord.toLowerCase() === undercoverWord.toLowerCase()) {
      alert("Le parole personalizzate non possono essere uguali.");
      return;
    }
    selectedPair = { civilian: civilianWord, undercover: undercoverWord };
  } else if (wordSelectionMode.value === "select") {
    // Check against undefined
    if (
      selectedPredefinedPairIndex.value === undefined ||
      selectedPredefinedPairIndex.value < 0 ||
      selectedPredefinedPairIndex.value >= wordPairs.length
    ) {
      alert("Per favore, seleziona una coppia di parole dalla lista.");
      return;
    }
    // Use non-null assertion as index is validated
    selectedPair = wordPairs[selectedPredefinedPairIndex.value]!;
  } else {
    // 'random' mode
    selectedPair = getRandomWordPair();
    if (!selectedPair) {
      alert("Errore: Impossibile caricare una coppia di parole casuale.");
      return;
    }
  }

  // Add null check before destructuring
  if (!selectedPair) {
    alert("Errore interno: la coppia di parole selezionata non è valida.");
    return;
  }

  const { civilian, undercover } = selectedPair;
  const playerIndices = Array.from({ length: numPlayers }, (_, i) => i);
  for (let i = playerIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playerIndices[i], playerIndices[j]] = [
      playerIndices[j]!,
      playerIndices[i]!,
    ];
  }
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));

  const initialAssignments: PlayerAssignment[] = playersState.value.map(
    (name, index) => ({
      name: name,
      word: undercoverIndices.has(index) ? undercover : civilian,
      isUndercover: undercoverIndices.has(index),
    })
  );

  const shuffledAssignments = [...initialAssignments];
  for (let i = shuffledAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAssignments[i], shuffledAssignments[j]] = [
      shuffledAssignments[j]!,
      shuffledAssignments[i]!,
    ];
  }

  gameWordPair.value = selectedPair;
  assignments.value = initialAssignments;
  numberOfUndercoversState.value = numUndercovers;
  activePlayers.value = shuffledAssignments;
  currentRound.value = 1;
  gamePhase.value = "showing_words";
  wordShowingPlayerIndex.value = 0;
  currentVotes.value = {};
  votingPlayerIndex.value = 0;
  lastEliminated.value = null;
  gameOverMessage.value = "";
  finalRoleReveal.value = [];
  eliminatedHistory.value = [];
  wasVoteTied.value = false;

  saveCurrentGameState();
  router.push("/gioca");
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
  router.push("/gioca");
}

function discardSavedGame() {
  clearSavedGameState();
  savedGameState.value = null;
  resetLocalSetupState();
  resetGlobalGameState();
}

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "ora sconosciuta";
  return new Date(timestamp).toLocaleString("it-IT");
}

function saveCurrentGameState() {
  if (
    !playersState.value ||
    !gameWordPair.value ||
    !assignments.value ||
    !activePlayers.value
  ) {
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
  <UContainer class="py-8">
    <!-- Resume Option -->
    <UCard
      v-if="savedGameState"
      class="mb-8 bg-primary-50 dark:bg-primary-900/50"
    >
      <template #header>
        <h2
          class="text-xl font-semibold text-primary-700 dark:text-primary-300"
        >
          Riprendere Partita Precedente?
        </h2>
      </template>

      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Trovato partita salvata il
        {{ formatTimestamp(savedGameState.timestamp) }}.
      </p>

      <div class="flex justify-center gap-4">
        <UButton color="green" size="lg" @click="resumeGame">
          Riprendi Partita
        </UButton>
        <UButton color="red" variant="soft" size="lg" @click="discardSavedGame">
          Scarta e Inizia Nuova
        </UButton>
      </div>
    </UCard>

    <!-- New Game Setup -->
    <UCard v-if="!savedGameState">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Nuova Partita
        </h2>
      </template>

      <UAccordion :items="accordionItems" size="xl" multiple>
        <!-- Added multiple prop -->
        <template #players>
          <div class="px-2">
            <!-- Add Player Section -->
            <UFormGroup label="Aggiungi Giocatore" class="mb-4">
              <div class="flex items-center gap-2">
                <UInput
                  v-model.trim="newPlayerName"
                  placeholder="Nome giocatore..."
                  aria-label="Inserisci nome giocatore"
                  class="flex-grow"
                  size="lg"
                  icon="i-heroicons-user-plus"
                  @keyup.enter="addPlayer"
                />
                <UButton
                  :disabled="!newPlayerName"
                  icon="i-heroicons-plus-circle"
                  size="lg"
                  aria-label="Aggiungi Giocatore"
                  @click="addPlayer"
                />
              </div>
            </UFormGroup>

            <!-- Player List -->
            <div v-if="playersState.length > 0" class="mb-4">
              <ul class="space-y-2">
                <li
                  v-for="(player, index) in playersState"
                  :key="player"
                  class="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <span class="text-gray-800 dark:text-gray-100">{{
                    player
                  }}</span>
                  <UButton
                    icon="i-heroicons-x-circle-20-solid"
                    color="red"
                    variant="ghost"
                    size="sm"
                    aria-label="Rimuovi giocatore"
                    @click="removePlayer(index)"
                  />
                </li>
              </ul>
            </div>

            <!-- Player Count Validation -->
            <UAlert
              v-if="playersState.length < 3"
              icon="i-heroicons-exclamation-triangle"
              color="orange"
              variant="soft"
              title="Attenzione"
              description="Servono almeno 3 giocatori per iniziare."
              class="mb-4"
            />

            <!-- Number of Undercovers Selection (Moved here) -->
            <UFormGroup
              v-if="playersState.length >= 3 && maxPossibleUndercovers > 1"
              class="mb-4"
            >
              <div
                class="flex items-center justify-start gap-2 flex-wrap font-medium text-gray-700 dark:text-gray-200"
              >
                <p>Numero di Infiltrati:</p>
                <div class="flex items-center gap-2">
                  <p>{{ selectedUndercovers }}</p>
                  <URange
                    id="undercover-count"
                    v-model="selectedUndercovers"
                    :min="1"
                    :max="maxPossibleUndercovers"
                    aria-label="Numero di Infiltrati"
                    class="w-32 text-center"
                    size="md"
                  />
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    (Max: {{ maxPossibleUndercovers }})
                  </span>
                </div>
              </div>
            </UFormGroup>

            <!-- Undercover Count Validation (Moved here) -->
            <UAlert
              v-if="
                playersState.length >= 3 &&
                (selectedUndercovers < 1 ||
                  selectedUndercovers > maxPossibleUndercovers)
              "
              icon="i-heroicons-exclamation-circle"
              color="red"
              variant="soft"
              title="Errore"
              :description="`Numero di Infiltrati non valido (Min: 1, Max: ${maxPossibleUndercovers}).`"
              class="mb-4"
            />
          </div>
        </template>

        <template #words>
          <div class="px-2">
            <!-- Word Selection Mode -->
            <UFormGroup
              label="Con quali parole vuoi giocare?"
              class="mb-4 px-2"
            >
              <URadioGroup
                v-model="wordSelectionMode"
                :options="wordSelectionOptions"
              />
            </UFormGroup>

            <!-- Custom Word Inputs (Conditional) -->
            <div
              v-if="wordSelectionMode === 'custom'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <UFormGroup label="Parola Cittadino">
                <UInput
                  v-model.trim="customCivilianWord"
                  placeholder="Es: Cane"
                  aria-label="Parola Cittadino"
                  size="lg"
                />
              </UFormGroup>
              <UFormGroup label="Parola Infiltrato">
                <UInput
                  v-model.trim="customUndercoverWord"
                  placeholder="Es: Gatto"
                  aria-label="Parola Infiltrato"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <!-- Predefined Word Selection (Conditional) -->
            <UFormGroup
              v-if="wordSelectionMode === 'select'"
              label="Scegli Coppia Predefinita"
              class="mb-4"
            >
              <USelectMenu
                v-model="selectedPredefinedPairIndex"
                :options="predefinedPairOptions"
                placeholder="Seleziona una coppia..."
                value-attribute="value"
                option-attribute="label"
                searchable
                searchable-placeholder="Cerca coppia..."
                aria-label="Seleziona coppia di parole predefinita"
              />
            </UFormGroup>

            <!-- Validation for Custom Words -->
            <UAlert
              v-if="
                wordSelectionMode === 'custom' &&
                (!customCivilianWord || !customUndercoverWord)
              "
              icon="i-heroicons-exclamation-circle"
              color="orange"
              variant="soft"
              title="Parole Mancanti"
              description="Inserisci entrambe le parole personalizzate per iniziare."
              class="mb-4"
            />
            <UAlert
              v-if="
                wordSelectionMode === 'custom' &&
                customCivilianWord &&
                customUndercoverWord &&
                customCivilianWord.toLowerCase() ===
                  customUndercoverWord.toLowerCase()
              "
              icon="i-heroicons-exclamation-circle"
              color="red"
              variant="soft"
              title="Parole Uguali"
              description="Le parole personalizzate non possono essere uguali."
              class="mb-4"
            />
            <!-- Validation for Selected Predefined Word -->
            <UAlert
              v-if="
                wordSelectionMode === 'select' &&
                selectedPredefinedPairIndex === undefined
              "
              icon="i-heroicons-exclamation-circle"
              color="orange"
              variant="soft"
              title="Selezione Mancante"
              description="Per favore, scegli una coppia di parole dalla lista."
              class="mb-4"
            />
          </div>
        </template>
      </UAccordion>

      <!-- Start Button -->
      <UButton
        :disabled="
          playersState.length < 3 ||
          selectedUndercovers < 1 ||
          selectedUndercovers > maxPossibleUndercovers ||
          (wordSelectionMode === 'custom' &&
            (!customCivilianWord ||
              !customUndercoverWord ||
              customCivilianWord.toLowerCase() ===
                customUndercoverWord.toLowerCase())) ||
          (wordSelectionMode === 'select' &&
            selectedPredefinedPairIndex === undefined) // Check against undefined
        "
        size="xl"
        block
        color="primary"
        class="mt-4"
        trailing-icon="i-heroicons-arrow-right-circle-20-solid"
        @click="startNewGame"
      >
        Inizia Nuova Partita
      </UButton>
    </UCard>
  </UContainer>
</template>
