<script setup lang="ts">
import { getRandomWordPair } from "~/utils/wordPairs";
import { wordPairs } from "~/constants/wordPairs"; // Import predefined word pairs
import {
  loadGameStateFromLocalStorage,
  clearSavedGameState,
  loadPlayerSettingsFromLocalStorage,
  clearPlayerSettingsFromLocalStorage,
} from "~/utils/gameStateStorage";
import type { WordPair } from "~/types/wordPairs";

const router = useRouter();
const newPlayerName = ref("");
const selectedUndercovers = ref(1);
const selectedMrWhites = ref(0);
const useCustomWords = ref(false);
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
  {
    label: "Civili, Undercover e Mr. White",
    slot: "players",
    defaultOpen: true,
  },
  { label: "Parole", slot: "words" },
];

const {
  players: playersState,
  gameWordPair,
  assignments,
  activePlayers,
  currentRound,
  gamePhase,
  currentVotes,
  votingPlayerIndex,
  lastEliminated,
  gameOverMessage,
  finalRoleReveal,
  eliminatedHistory,
  wasVoteTied,
  numberOfUndercovers: numberOfUndercoversState,
  numberOfMrWhites: numberOfMrWhitesState,
  wordShowingPlayerIndex,
  saveCurrentGameState,
  pendingMrWhiteGuess,
  mrWhiteWinners,
} = useGameState();

onMounted(() => {
  savedGameState.value = loadGameStateFromLocalStorage();
  resetGlobalGameState();
  if (!savedGameState.value) {
    // Prefill from last player settings if available
    const lastSettings = loadPlayerSettingsFromLocalStorage();
    if (lastSettings) {
      playersState.value = [...lastSettings.players];
      selectedUndercovers.value = lastSettings.numberOfUndercovers;
      selectedMrWhites.value = lastSettings.numberOfMrWhites;
    } else {
      resetLocalSetupState();
    }
  }
});

// Max total special roles (Undercover + Mr. White)
const maxPossibleSpecialRoles = computed(() => {
  const len = playersState.value?.length ?? 0;
  // Ensure at least 1 special role if possible, and less than total players
  return len >= 3 ? Math.max(1, Math.floor(len / 2)) : 0;
});

const maxPossibleUndercovers = computed(() => {
  const maxTotal = maxPossibleSpecialRoles.value;
  const currentMrWhites = selectedMrWhites.value;
  return Math.max(0, maxTotal - currentMrWhites);
});

const maxPossibleMrWhites = computed(() => {
  const maxTotal = maxPossibleSpecialRoles.value;
  const currentUndercovers = selectedUndercovers.value;
  return Math.max(0, maxTotal - currentUndercovers);
});

watch(maxPossibleSpecialRoles, (newMaxSpecial) => {
  if (selectedUndercovers.value + selectedMrWhites.value > newMaxSpecial) {
    selectedUndercovers.value = Math.min(1, newMaxSpecial);
    selectedMrWhites.value = 0;
  } else {
    if (selectedUndercovers.value > maxPossibleUndercovers.value) {
      selectedUndercovers.value = maxPossibleUndercovers.value;
    }
    if (selectedMrWhites.value > maxPossibleMrWhites.value) {
      selectedMrWhites.value = maxPossibleMrWhites.value;
    }
  }
});

function resetLocalSetupState() {
  selectedUndercovers.value = 1;
  selectedMrWhites.value = 0;
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
  numberOfMrWhitesState.value = 0;
  pendingMrWhiteGuess.value = false;
  mrWhiteWinners.value = [];
}

function addPlayer() {
  const nameToAdd = newPlayerName.value.trim();
  if (addPlayerError.value === "") {
    playersState.value.push(nameToAdd);
    newPlayerName.value = "";
  }
}

function removePlayer(index: number) {
  playersState.value.splice(index, 1);
}

const errorMessage = ref("");
const addPlayerError = computed(() => {
  if (newPlayerName.value.trim() === "") return "";
  if (playersState.value.includes(newPlayerName.value.trim())) {
    return `${newPlayerName.value} è già in gioco!`;
  }
  return "";
});

function startNewGame() {
  errorMessage.value = ""; // Reset error before starting

  clearSavedGameState();
  clearPlayerSettingsFromLocalStorage();

  const numPlayers = playersState.value.length;
  const numUndercovers = selectedUndercovers.value;
  const numMrWhites = selectedMrWhites.value;

  let selectedPair: WordPair | null = null;

  if (wordSelectionMode.value === "custom") {
    const civilianWord = customCivilianWord.value.trim();
    const undercoverWord = customUndercoverWord.value.trim();
    if (!civilianWord || !undercoverWord) {
      errorMessage.value =
        "Per favore, inserisci entrambe le parole personalizzate.";
      return;
    }
    if (civilianWord.toLowerCase() === undercoverWord.toLowerCase()) {
      errorMessage.value =
        "Le parole personalizzate non possono essere uguali.";
      return;
    }
    selectedPair = { civilian: civilianWord, undercover: undercoverWord };
  } else if (wordSelectionMode.value === "select") {
    if (
      selectedPredefinedPairIndex.value === undefined ||
      selectedPredefinedPairIndex.value < 0 ||
      selectedPredefinedPairIndex.value >= wordPairs.length
    ) {
      errorMessage.value =
        "Per favore, seleziona una coppia di parole dalla lista.";
      return;
    }
    selectedPair = wordPairs[selectedPredefinedPairIndex.value]!;
  } else {
    selectedPair = getRandomWordPair();
    if (!selectedPair) {
      errorMessage.value =
        "Errore: Impossibile caricare una coppia di parole casuale.";
      return;
    }
  }

  if (!selectedPair) {
    errorMessage.value =
      "Errore interno: la coppia di parole selezionata non è valida.";
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
  // Assign roles based on shuffled indices
  const undercoverIndices = new Set(playerIndices.slice(0, numUndercovers));
  const mrWhiteIndices = new Set(
    playerIndices.slice(numUndercovers, numUndercovers + numMrWhites)
  );

  const initialAssignments: PlayerAssignment[] = playersState.value.map(
    (name, index): PlayerAssignment => {
      let role: PlayerRole;
      let word: string | null;

      if (undercoverIndices.has(index)) {
        role = "Undercover";
        word = undercover;
      } else if (mrWhiteIndices.has(index)) {
        role = "MrWhite";
        word = null;
      } else {
        role = "Civilian";
        word = civilian;
      }

      return { name, word, role };
    }
  );

  gameWordPair.value = selectedPair;
  assignments.value = initialAssignments;
  numberOfUndercoversState.value = numUndercovers;
  numberOfMrWhitesState.value = numMrWhites;
  activePlayers.value = initialAssignments;
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
  pendingMrWhiteGuess.value = false;
  mrWhiteWinners.value = [];

  saveCurrentGameState();
  router.push("/gioca");
}

function resumeGame() {
  if (!savedGameState.value) return;

  playersState.value = savedGameState.value.players;
  gameWordPair.value = savedGameState.value.gameWordPair;
  assignments.value = savedGameState.value.assignments;
  numberOfUndercoversState.value = savedGameState.value.numberOfUndercovers;
  numberOfMrWhitesState.value = savedGameState.value.numberOfMrWhites ?? 0;
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
  resetLocalSetupState();
  resetGlobalGameState();

  if (savedGameState.value) {
    playersState.value = savedGameState.value.players ?? [];
    numberOfUndercoversState.value = savedGameState.value.numberOfUndercovers ?? 1;
    numberOfMrWhitesState.value = savedGameState.value.numberOfMrWhites ?? 0;
  }

  savedGameState.value = null;
}

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "ora sconosciuta";
  return new Date(timestamp).toLocaleString("it-IT");
}
</script>

<template>
  <UContainer class="py-8" :ui="{ padding: 'px-0 sm:px-6 lg:px-8' }">
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
        <template #players>
          <div class="px-2 space-y-4">
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
                  :disabled="!newPlayerName || !!addPlayerError"
                  icon="i-heroicons-plus-circle"
                  size="lg"
                  aria-label="Aggiungi Giocatore"
                  @click="addPlayer"
                />
              </div>
              <div v-if="addPlayerError" class="text-xs text-red-600 mt-1">
                {{ addPlayerError }}
              </div>
            </UFormGroup>

            <!-- Player List -->
            <div v-if="playersState.length > 0" class="mb-4">
              <ul class="space-y-2">
                <li
                  v-for="(player, index) in playersState"
                  :key="player"
                  class="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 sm:py-3 rounded shadow-sm border border-gray-200 dark:border-gray-700"
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

            <div v-if="playersState.length >= 3" class="space-y-3">
              <p class="font-medium text-gray-700 dark:text-gray-200">
                Seleziona Ruoli Speciali (in totale max:
                {{ maxPossibleSpecialRoles }}):
              </p>

              <UFormGroup>
                <div class="flex items-center justify-start gap-2 flex-wrap">
                  <UPopover>
                    <label
                      for="undercover-count"
                      class="w-[105px] flex items-center group"
                    >
                      <span
                        class="transition-all group-hover:underline group-focus-within:underline"
                      >
                        Undercover
                      </span>
                      <UIcon
                        name="i-heroicons-information-circle"
                        class="ml-0.5 text-blue-500 cursor-pointer text-xl"
                        aria-label="Info Undercover"
                        tabindex="0"
                      />
                      :
                    </label>
                    <template #panel>
                      <div class="p-3 text-sm max-w-xs">
                        Conosce una parola diversa ma simile a quella dei
                        civili.<br>Deve confondersi tra loro.
                      </div>
                    </template>
                  </UPopover>
                  <div class="flex items-center gap-2">
                    <UButton
                      icon="i-heroicons-minus"
                      size="xs"
                      class="p-1"
                      aria-label="Diminuisci Undercover"
                      :disabled="selectedUndercovers <= 0"
                      @click="
                        selectedUndercovers = Math.max(
                          0,
                          selectedUndercovers - 1
                        )
                      "
                    />
                    <p class="w-4 text-center text-base">
                      {{ selectedUndercovers }}
                    </p>
                    <UButton
                      icon="i-heroicons-plus"
                      size="xs"
                      class="p-1"
                      aria-label="Aumenta Undercover"
                      :disabled="selectedUndercovers >= maxPossibleUndercovers"
                      @click="
                        selectedUndercovers = Math.min(
                          maxPossibleUndercovers,
                          selectedUndercovers + 1
                        )
                      "
                    />
                    <span
                      class="hidden sm:block text-sm text-gray-500 dark:text-gray-400 w-16 text-right"
                    >
                      (Max: {{ maxPossibleUndercovers }})
                    </span>
                  </div>
                </div>
              </UFormGroup>

              <UFormGroup>
                <div class="flex items-center justify-start gap-2 flex-wrap">
                  <UPopover>
                    <label
                      for="mrwhite-count"
                      class="w-[105px] flex items-center group"
                    >
                      <span
                        class="transition-all group-hover:underline group-focus-within:underline"
                      >
                        Mr. White
                      </span>
                      <UIcon
                        name="i-heroicons-information-circle"
                        class="ml-0.5 text-blue-500 cursor-pointer text-xl"
                        aria-label="Info Mr. White"
                        tabindex="0"
                      />
                      :
                    </label>
                    <template #panel>
                      <div class="p-3 text-sm max-w-xs">
                        Non conosce nessuna parola.<br>Deve indovinare quella
                        dei civili.
                      </div>
                    </template>
                  </UPopover>
                  <div class="flex items-center gap-2">
                    <UButton
                      icon="i-heroicons-minus"
                      size="xs"
                      class="p-1"
                      aria-label="Diminuisci Mr. White"
                      :disabled="selectedMrWhites <= 0"
                      @click="
                        selectedMrWhites = Math.max(0, selectedMrWhites - 1)
                      "
                    />
                    <p class="w-4 text-center text-base">
                      {{ selectedMrWhites }}
                    </p>
                    <UButton
                      icon="i-heroicons-plus"
                      size="xs"
                      class="p-1"
                      aria-label="Aumenta Mr. White"
                      :disabled="selectedMrWhites >= maxPossibleMrWhites"
                      @click="
                        selectedMrWhites = Math.min(
                          maxPossibleMrWhites,
                          selectedMrWhites + 1
                        )
                      "
                    />
                    <span
                      class="hidden sm:block text-sm text-gray-500 dark:text-gray-400 w-16 text-right"
                    >
                      (Max: {{ maxPossibleMrWhites }})
                    </span>
                  </div>
                </div>
              </UFormGroup>

              <UAlert
                v-if="selectedUndercovers + selectedMrWhites < 1"
                icon="i-heroicons-exclamation-circle"
                color="orange"
                variant="soft"
                title="Attenzione"
                description="Seleziona almeno un Undercover o un Mr. White."
                class="mt-2"
              />
              <UAlert
                v-if="
                  selectedUndercovers + selectedMrWhites >
                  maxPossibleSpecialRoles
                "
                icon="i-heroicons-exclamation-circle"
                color="red"
                variant="soft"
                title="Errore"
                :description="`Troppi ruoli speciali. Massimo consentito: ${maxPossibleSpecialRoles}.`"
                class="mt-2"
              />
            </div>
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
              <UFormGroup label="Parola Undercover">
                <UInput
                  v-model.trim="customUndercoverWord"
                  placeholder="Es: Gatto"
                  aria-label="Parola Undercover"
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

      <!-- Error Message Display -->
      <UAlert
        v-if="errorMessage"
        icon="i-heroicons-exclamation-circle"
        color="red"
        variant="soft"
        title="Errore"
        :description="errorMessage"
        class="mb-4"
      />

      <!-- Start Button -->
      <UButton
        :disabled="
          playersState.length < 3 ||
          selectedUndercovers + selectedMrWhites < 1 ||
          selectedUndercovers > maxPossibleUndercovers ||
          selectedMrWhites > maxPossibleMrWhites ||
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
