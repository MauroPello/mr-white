<script setup lang="ts">
import { getRandomWordPair } from "~/utils/wordPairs";
import { wordPackNames, wordPacks } from "~/constants/wordPacks";
import { addPlayedWordPair } from "~/utils/playedWordPairsStorage";
import {
  loadGameStateFromLocalStorage,
  clearSavedGameState,
  loadPlayerSettingsFromLocalStorage,
  savePlayerSettingsToLocalStorage,
} from "~/utils/gameStateStorage";
import type { WordPair } from "~/types/wordPairs";

const { isMinimumMd } = useScreenSize();

const newPlayerName = ref("");
const selectedUndercovers = ref(1);
const selectedMrWhites = ref(0);
const shouldUseCustomWords = ref(false);
const customCivilianWord = ref("");
const customUndercoverWord = ref("");
const savedGameState =
  ref<ReturnType<typeof loadGameStateFromLocalStorage>>(null);
const selectedPackNames = ref<string[]>(wordPackNames);
const lastSelectedPackNames = ref<string[]>([]);

function saveCurrentPlayerSettings() {
  savePlayerSettingsToLocalStorage({
    players: playersState.value,
    numberOfUndercovers: selectedUndercovers.value,
    numberOfMrWhites: selectedMrWhites.value,
    selectedPackNames: selectedPackNames.value,
  });
}

function updateSpecialRoleCount(
  role: "undercover" | "mrwhite",
  change: 1 | -1
) {
  if (role === "undercover") {
    const newValue = selectedUndercovers.value + change;
    if (newValue >= 0 && newValue <= maxPossibleUndercovers.value) {
      selectedUndercovers.value = newValue;
    }
  } else {
    const newValue = selectedMrWhites.value + change;
    if (newValue >= 0 && newValue <= maxPossibleMrWhites.value) {
      selectedMrWhites.value = newValue;
    }
  }
  saveCurrentPlayerSettings();
}

function togglePack(packName: string) {
  shouldUseCustomWords.value = false; // Disable custom words when a pack is selected
  const index = selectedPackNames.value.indexOf(packName);

  if (index > -1) {
    // Deselect specific pack
    selectedPackNames.value.splice(index, 1);
  } else {
    // Select specific pack
    selectedPackNames.value.push(packName);
  }

  saveCurrentPlayerSettings();
}

watch(shouldUseCustomWords, (isUsingCustom) => {
  if (isUsingCustom) {
    // User wants to use custom words, so save the current pack selection and clear it.
    if (selectedPackNames.value.length > 0) {
      lastSelectedPackNames.value = [...selectedPackNames.value];
    }
    selectedPackNames.value = [];
  } else {
    // User switched back to using word packs, so restore the previous selection.
    if (lastSelectedPackNames.value.length > 0) {
      selectedPackNames.value = [...lastSelectedPackNames.value];
    } else {
      // If there was no prior selection, default to all packs.
      selectedPackNames.value = wordPackNames;
    }
  }
});

// Accordion items definition
const accordionItems = [
  {
    label: "Civili, Undercover e Mr. White",
    slot: "players",
    defaultOpen: true,
  },
  {
    label: "Parole",
    slot: "words",
    defaultOpen: false,
  },
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
      if (
        lastSettings.selectedPackNames &&
        lastSettings.selectedPackNames.length > 0
      ) {
        selectedPackNames.value = [...lastSettings.selectedPackNames];
        lastSelectedPackNames.value = [...lastSettings.selectedPackNames];
        shouldUseCustomWords.value = false;
      } else {
        // Default to all packs if none were saved
        selectedPackNames.value = wordPackNames;
        lastSelectedPackNames.value = [...selectedPackNames.value];
      }

      if (selectedPackNames.value.length !== wordPackNames.length){
        const accordionButton = document?.querySelector('#startgame-accordion-item-1');
        (accordionButton as HTMLElement)?.click();
      }
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
    if (selectedUndercovers.value === 0 && selectedMrWhites.value === 0) {
      selectedUndercovers.value = 1;
    }
  }
});

function resetLocalSetupState() {
  selectedUndercovers.value = 1;
  selectedMrWhites.value = 0;
  newPlayerName.value = "";
  shouldUseCustomWords.value = false;
  customCivilianWord.value = "";
  customUndercoverWord.value = "";
  selectedPackNames.value = wordPackNames;
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

  saveCurrentPlayerSettings();
}

function removePlayer(index: number) {
  playersState.value.splice(index, 1);

  saveCurrentPlayerSettings();
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

  const numPlayers = playersState.value.length;
  const numUndercovers = selectedUndercovers.value;
  const numMrWhites = selectedMrWhites.value;

  let selectedPair: WordPair | null = null;

  if (shouldUseCustomWords.value) {
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
  } else {
    if (selectedPackNames.value.length === 0) {
      errorMessage.value = "Per favore, seleziona almeno un pacchetto.";
      return;
    }
    selectedPair = getRandomWordPair(selectedPackNames.value);
    if (!selectedPair) {
      errorMessage.value =
        "Errore: Impossibile caricare una coppia di parole casuale.";
      return;
    }
  }

  if (selectedPair) {
    addPlayedWordPair(selectedPair);
  }

  // Reset game state before setting new values
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
  navigateTo("/gioca");
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
  navigateTo("/gioca");
}

function discardSavedGame() {
  clearSavedGameState();
  resetLocalSetupState();
  resetGlobalGameState();
  savedGameState.value = null;

  const lastSettings = loadPlayerSettingsFromLocalStorage();
  if (lastSettings) {
    // Restore players and roles from the local storage
    playersState.value = lastSettings.players ?? [];
    numberOfUndercoversState.value = lastSettings.numberOfUndercovers ?? 1;
    numberOfMrWhitesState.value = lastSettings.numberOfMrWhites ?? 0;
    selectedPackNames.value = lastSettings.selectedPackNames ?? wordPackNames;
  }
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
        Abbiamo trovato una partita salvata del
        {{ formatTimestamp(savedGameState.timestamp) }}.
      </p>

      <div class="flex justify-center gap-4">
        <UButton
          color="green"
          :size="isMinimumMd ? 'xl' : 'md'"
          @click="resumeGame"
        >
          Riprendi Partita
        </UButton>
        <UButton
          color="red"
          variant="soft"
          :size="isMinimumMd ? 'xl' : 'md'"
          @click="discardSavedGame"
        >
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
        <template #default="{ item, index, open }">
          <UButton variant="soft" size="xl" class="mb-1.5">
            <span :id="`startgame-accordion-item-${index}`" class="text-left break-all line-clamp-1">{{ item.label }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
        </template>
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
                  class="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-1 sm:py-3 rounded shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <span class="text-gray-600 dark:text-gray-200">
                    {{ index + 1 }}.
                    <span
                      class="font-medium text-gray-800 dark:text-gray-100"
                      >{{ player }}</span
                    >
                  </span>
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
                        civili.<br >Deve confondersi tra loro.
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
                      @click="updateSpecialRoleCount('undercover', -1)"
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
                      @click="updateSpecialRoleCount('undercover', 1)"
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
                        Non conosce nessuna parola.<br >Deve indovinare quella
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
                      @click="updateSpecialRoleCount('mrwhite', -1)"
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
                      @click="updateSpecialRoleCount('mrwhite', 1)"
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
          <div class="px-2 space-y-6">
            <!-- Word Pack Selection -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3"
              >
                Scegli con quali pacchetti di parole giocare
              </label>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5"
              >
                <div
                  v-for="pack in wordPacks"
                  :key="pack.name"
                  class="relative rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 h-20 md:h-24"
                  :class="{
                    'bg-primary-400/90 text-white shadow-md scale-105 border-primary-600':
                      selectedPackNames.includes(pack.name),
                    'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent':
                      !selectedPackNames.includes(pack.name),
                  }"
                  @click="togglePack(pack.name)"
                >
                  <span class="text-3xl mb-1">{{ pack.icon }}</span>
                  <span class="text-sm font-semibold text-center">{{
                    pack.name
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Custom Words Section -->
            <div>
              <UDivider>
                <span class="text-sm">oppure</span>
              </UDivider>
              <div class="flex justify-center mt-4">
                <UCheckbox
                  v-model="shouldUseCustomWords"
                  name="custom-words"
                  label="Usa parole personalizzate"
                />
              </div>

              <div
                v-if="shouldUseCustomWords"
                class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
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
            </div>

            <!-- Validation Alerts -->
            <UAlert
              v-if="!shouldUseCustomWords && selectedPackNames.length === 0"
              icon="i-heroicons-exclamation-circle"
              color="orange"
              variant="soft"
              title="Selezione Mancante"
              description="Per favore, scegli almeno un pacchetto di parole."
              class="mb-4"
            />
            <UAlert
              v-if="
                shouldUseCustomWords &&
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
                shouldUseCustomWords &&
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
          (!shouldUseCustomWords && selectedPackNames.length === 0) ||
          (shouldUseCustomWords &&
            (!customCivilianWord ||
              !customUndercoverWord ||
              customCivilianWord.toLowerCase() ===
                customUndercoverWord.toLowerCase()))
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
