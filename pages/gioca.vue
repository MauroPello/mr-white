<script setup lang="ts">
import { companyMainStructuredData } from "~/constants/company";
import { useGameState } from "~/composables/useGameState";

useHead(companyMainStructuredData);

// --- Call the composable and destructure needed refs and actions ---
const {
  // State Refs
  activePlayers,
  gamePhase,
  gameWordPair,
  currentRound,
  numberOfUndercovers,
  lastEliminated: lastEliminatedState,
  gameOverMessage: gameOverMessageState,
  finalRoleReveal: finalRoleRevealState,
  wasVoteTied: wasVoteTiedState,
  showingWord,
  mrWhiteWinners,

  // Computed Refs
  currentPlayerForWord,
  isLastWordToShow,
  currentPlayerForVote,
  votingOptions,
  mrWhiteGuessingPlayer,

  // Actions
  initializeGame,
  clearGameState,
  showWord,
  hideWordAndProceed,
  startVotingPhase,
  castVote,
  goToDiscussion,
  isPlayerEliminated,
  mrWhiteGuess,
  lastVoteCount,
} = useGameState();

// --- Local Component Logic ---
const maxLastVoteCount = computed(() => {
  if (!lastVoteCount.value) return 0;
  return Math.max(...lastVoteCount.value.map((v) => v.count));
});
const isExitConfirmationModalOpen = ref(false);
function askForExitConfirmation() {
  isExitConfirmationModalOpen.value = true;
}
async function exitGame() {
  isExitConfirmationModalOpen.value = false;
  await playAgain();
}

async function playAgain() {
  clearGameState();
  await navigateTo("/#gioca");
}

const mrWhiteGuessInput = ref("");

function submitMrWhiteGuess() {
  if (!mrWhiteGuessInput.value.trim()) return;
  mrWhiteGuess(mrWhiteGuessInput.value.trim());
  mrWhiteGuessInput.value = "";
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  const success = initializeGame();
  if (!success) {
    console.warn("Game initialization failed, redirecting to setup.");
    await navigateTo("/#gioca");
  }
});

const hasMrWhiteJustWon = computed(
  () =>
    lastEliminatedState.value &&
    lastEliminatedState.value.role === "MrWhite" &&
    mrWhiteWinners.value.some((w) => w.name === lastEliminatedState.value?.name)
);
</script>

<template>
  <div class="pt-12 pb-4">
    <UContainer>
      <!-- Phase: Showing Words -->
      <UCard v-if="gamePhase === 'showing_words'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">
            Round {{ currentRound }}: Rivela Parole
          </h1>
        </template>

        <div v-if="currentPlayerForWord" class="space-y-4">
          <h2 class="text-lg">
            Passa il telefono a
            <UBadge color="primary" variant="subtle" size="lg" class="text-lg">
              {{ currentPlayerForWord.name }}
            </UBadge>
          </h2>

          <p v-if="!showingWord" class="text-gray-600 dark:text-gray-400">
            Tocca sotto quando sei pronto.
          </p>

          <UButton
            v-if="!showingWord"
            size="lg"
            icon="i-heroicons-eye"
            @click="showWord"
          >
            Mostra la Mia Parola
          </UButton>

          <UCard
            v-if="showingWord"
            class="bg-white dark:bg-gray-800 border-primary-500 dark:border-primary-400 border-2"
          >
            <p class="text-gray-700 dark:text-gray-300 mb-2">
              La tua parola è:
            </p>
            <p
              class="text-3xl font-bold text-red-600 dark:text-red-400 my-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded break-words bg-gray-50 dark:bg-gray-700/50"
            >
              <template v-if="currentPlayerForWord.role === 'MrWhite'">
                <span class="italic text-gray-600"
                  >Nessuna parola! Sei Mr. White.</span
                >
              </template>
              <template v-else>
                {{ currentPlayerForWord.word }}
              </template>
            </p>
            <UButton
              color="amber"
              size="lg"
              icon="i-heroicons-check-circle"
              @click="hideWordAndProceed"
            >
              Capito! Nascondi &
              {{ isLastWordToShow ? "Inizia Discussione" : "Passa Telefono" }}
            </UButton>
          </UCard>
        </div>

        <UAlert
          v-else
          icon="i-heroicons-exclamation-circle"
          color="red"
          variant="soft"
          title="Errore Interno"
          description="Impossibile determinare il giocatore corrente per la rivelazione della parola. Ricarica o riavvia."
        />
      </UCard>

      <!-- Phase: Discussing -->
      <UCard v-else-if="gamePhase === 'discussing'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">
            Round {{ currentRound }}: Discussione
          </h1>
        </template>

        <UAlert
          v-if="wasVoteTiedState"
          color="yellow"
          variant="subtle"
          description="Nessuno è stato eliminato"
          class="mb-4"
          :ui="{ title: 'text-lg font-semibold', description: 'text-base' }"
        >
          <template #title>
            <div class="w-full">
              <UIcon
                name="i-heroicons-hand-raised"
                size="24"
                class="absolute left-4 text-yellow-500"
              />
              <span>Votazione in Parità!</span>
            </div>
          </template>
        </UAlert>

        <!-- Vote Results on Tie -->
        <div v-if="wasVoteTiedState && lastVoteCount" class="mb-6">
          <UDivider label="Riepilogo Voti" class="my-6" />
          <ul class="space-y-2 text-left max-w-md mx-auto">
            <li
              v-for="voteCount in lastVoteCount"
              :key="voteCount.playerName"
              class="p-3 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center"
            >
              <span>
                {{ voteCount.playerName }}:
                <span class="font-bold"
                  >{{ voteCount.count }} vot{{
                    voteCount.count === 1 ? "o" : "i"
                  }}</span
                >
              </span>
              <UBadge
                v-if="maxLastVoteCount === voteCount.count"
                color="yellow"
                variant="subtle"
                >Pareggio</UBadge
              >
            </li>
          </ul>
        </div>

        <div class="space-y-4 text-gray-700 dark:text-gray-300">
          <template v-if="!wasVoteTiedState">
            <p>Tutti i giocatori rimasti hanno visto la loro parola.</p>
            <p>
              Mettete giù il telefono e discutete! Cercate di trovare gli
              undercover e i Mr. White.
            </p>
            <p>Quando siete pronti, iniziate a votare.</p>
          </template>
          <template v-else>
            <p>
              Nessuno è stato eliminato, quindi potete continuare a discutere e
              votare di nuovo.
            </p>
          </template>
        </div>

        <template #footer>
          <UButton
            color="orange"
            class="w-full max-w-xs mx-auto"
            size="lg"
            block
            icon="i-heroicons-chat-bubble-left-right"
            @click="startVotingPhase"
          >
            Inizia Votazione
          </UButton>
        </template>
      </UCard>

      <!-- Phase: Voting -->
      <UCard v-else-if="gamePhase === 'voting'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">
            Round {{ currentRound }}: Votazione
          </h1>
        </template>

        <div v-if="currentPlayerForVote" class="space-y-4">
          <h2 class="text-lg">
            <UBadge color="primary" variant="subtle" size="lg" class="text-lg">
              {{ currentPlayerForVote.name }} </UBadge
            >, per favore vota!
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Chi sospetti sia un Infiltrato?
          </p>

          <div class="flex flex-col items-center gap-3 mt-6">
            <UButton
              v-for="option in votingOptions"
              :key="option.name + currentPlayerForVote.name"
              size="lg"
              color="blue"
              class="w-full max-w-xs"
              :class="{
                hidden: option.name === currentPlayerForVote.name,
              }"
              @click="castVote(option.name)"
            >
              Vota per {{ option.name }}
            </UButton>
          </div>
        </div>

        <UAlert
          v-else
          icon="i-heroicons-exclamation-circle"
          color="red"
          variant="soft"
          title="Errore Interno"
          description="Impossibile determinare il votante corrente. Ricarica o riavvia."
        />
      </UCard>

      <!-- Phase: Elimination -->
      <UCard v-else-if="gamePhase === 'elimination'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">
            Round {{ currentRound }}: Eliminazione
          </h1>
        </template>

        <div v-if="lastEliminatedState">
          <UAlert
            :color="hasMrWhiteJustWon ? 'green' : 'red'"
            variant="subtle"
            class="mb-4 text-black"
            :ui="{ title: 'text-lg font-semibold', description: 'text-base' }"
          >
            <template #title>
              <div class="w-full">
                <UIcon
                  :name="
                    hasMrWhiteJustWon
                      ? 'i-heroicons-trophy-solid'
                      : 'i-heroicons-user-minus-solid'
                  "
                  size="24"
                  :class="`text-${hasMrWhiteJustWon ? 'green' : 'red'}-500`"
                  class="absolute left-4"
                />
                <UBadge color="red" variant="solid" class="text-base">
                  {{ lastEliminatedState.name }}
                </UBadge>
                <span>
                  {{
                    " " + (hasMrWhiteJustWon ? "vincitore" : "eliminato")
                  }}!</span
                >
              </div>
            </template>
            <template #description>
              <template v-if="hasMrWhiteJustWon">
                <p class="mt-1">
                  Era
                  <span class="font-semibold text-red-600 dark:text-red-400"
                    >Mr. White</span
                  >
                  e ha indovinato la parola dei Civili!
                </p>
              </template>
              <p v-else class="mt-1">
                Era
                <span
                  class="font-semibold"
                  :class="{
                    'text-orange-600 dark:text-orange-400':
                      lastEliminatedState.role === 'Undercover',
                    'text-red-600 dark:text-red-400':
                      lastEliminatedState.role === 'MrWhite',
                    'text-green-600 dark:text-green-400':
                      lastEliminatedState.role === 'Civilian',
                  }"
                >
                  {{
                    lastEliminatedState.role === "Undercover"
                      ? "un Infiltrato!"
                      : lastEliminatedState.role === "MrWhite"
                      ? "Mr. White"
                      : "un Civile!"
                  }}
                </span>
                <span v-if="lastEliminatedState.role === 'MrWhite'">
                  e ha sbagliato ad indovinare la parola dei Civili!
                </span>
              </p>
            </template>
          </UAlert>

          <!-- Vote Results -->
          <div v-if="lastVoteCount" class="mb-6">
            <UDivider label="Riepilogo Voti" class="my-6" />
            <ul class="space-y-2 text-left max-w-md mx-auto">
              <li
                v-for="voteCount in lastVoteCount"
                :key="voteCount.playerName"
                class="p-3 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center"
              >
                <span>
                  {{ voteCount.playerName }}:
                  <span class="font-bold"
                    >{{ voteCount.count }} vot{{
                      voteCount.count === 1 ? "o" : "i"
                    }}</span
                  >
                </span>
                <UBadge
                  v-if="isPlayerEliminated(voteCount.playerName)"
                  color="red"
                  variant="subtle"
                  >Eliminato</UBadge
                >
              </li>
            </ul>
          </div>

          <p class="text-gray-600 dark:text-gray-400 my-4">
            Ci sono {{ activePlayers.length }} giocatori rimasti.
          </p>

          <UButton
            color="violet"
            size="lg"
            icon="i-heroicons-forward-20-solid"
            @click="goToDiscussion"
          >
            Continua alla Prossima Discussione
          </UButton>
        </div>

        <UAlert
          v-else
          icon="i-heroicons-exclamation-circle"
          color="red"
          variant="soft"
          title="Errore Interno"
          description="Dettagli eliminazione mancanti. Ricarica o riavvia."
        />
      </UCard>

      <!-- Phase: Mr White Guessing -->
      <UCard v-else-if="gamePhase === 'mr_white_guessing'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">Prova a Indovinare la Parola!</h1>
        </template>
        <div v-if="mrWhiteGuessingPlayer" class="flex flex-col items-center">
          <p class="mb-4">
            <UBadge color="red" variant="solid" class="text-base">
              {{ mrWhiteGuessingPlayer.name }}
            </UBadge>
            , sei stato eliminato come Mr. White! Ora puoi provare a indovinare
            la parola segreta dei Civili.
          </p>
          <UInput
            v-model="mrWhiteGuessInput"
            placeholder="Scrivi la parola dei Civili"
            size="lg"
            icon="i-heroicons-pencil"
            class="mb-4 w-full max-w-128"
            @keyup.enter="submitMrWhiteGuess"
          />
          <UButton
            size="lg"
            icon="i-heroicons-light-bulb"
            :disabled="!mrWhiteGuessInput"
            @click="submitMrWhiteGuess"
          >
            Indovina!
          </UButton>
        </div>
        <div v-else>
          <UAlert
            icon="i-heroicons-exclamation-circle"
            color="red"
            variant="soft"
            title="Errore Interno"
            description="Non è stato trovato il giocatore Mr. White per il turno di indovinare."
          />
        </div>
      </UCard>

      <!-- Phase: Game Over -->
      <UCard v-else-if="gamePhase.startsWith('game_over')" class="text-center">
        <template #header>
          <h1 class="text-2xl font-bold">Partita Terminata!</h1>
        </template>

        <h2
          class="text-xl font-semibold mb-4"
          :class="{
            'text-red-600 dark:text-red-400':
              gamePhase === 'game_over_undercovers_win',
            'text-green-600 dark:text-green-400':
              gamePhase === 'game_over_civilians_win',
          }"
        >
          {{ gameOverMessageState }}
        </h2>

        <!-- Show Mr. White winners if any -->
        <div v-if="mrWhiteWinners.length > 0" class="mb-4">
          <p>
            <span v-for="(winner, idx) in mrWhiteWinners" :key="winner.name">
              <UBadge color="red" variant="solid" class="text-base">
                {{ winner.name }}
              </UBadge>
              <span v-if="idx < mrWhiteWinners.length - 1">, </span>
            </span>
            {{ mrWhiteWinners.length > 1 ? "hanno" : "ha" }} indovinato la
            parola dei Civili!
          </p>
        </div>

        <!-- Civilians win and there were Mr. Whites, but none won -->
        <div
          v-if="
            gamePhase === 'game_over_civilians_win' &&
            finalRoleRevealState.some((p) => p.role === 'MrWhite') &&
            mrWhiteWinners.length === 0
          "
          class="mb-4"
        >
          <p class="text-gray-700 dark:text-gray-300 italic">
            Tutti i Mr. White sono stati eliminati senza indovinare la parola
            dei Civili!
          </p>
        </div>

        <p
          v-if="gameWordPair && numberOfUndercovers > 0"
          class="text-gray-600 dark:text-gray-400 mb-4"
        >
          Le parole erano:
          <UBadge variant="soft" color="gray" size="md" class="text-base">{{
            gameWordPair.civilian
          }}</UBadge>
          (Civile) e
          <UBadge variant="soft" color="red" size="md" class="text-base">{{
            gameWordPair.undercover
          }}</UBadge>
          (Infiltrato)
        </p>
        <p
          v-else-if="gameWordPair"
          class="text-gray-600 dark:text-gray-400 mb-4"
        >
          La parola dei Civili era:
          <UBadge variant="soft" color="gray" size="md" class="text-base">{{
            gameWordPair.civilian
          }}</UBadge>
        </p>

        <UDivider label="Stato Finale" class="my-6" />

        <ul class="space-y-2 text-left max-w-md mx-auto mb-6">
          <li
            v-for="player in finalRoleRevealState"
            :key="player.name"
            class="p-3 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
          >
            <span
              :class="{
                'font-bold text-orange-600 dark:text-orange-400':
                  player.role === 'Undercover',
                'font-bold text-red-600 dark:text-red-400':
                  player.role === 'MrWhite',
              }"
            >
              {{ player.name }}: {{ player.word }}
              <UBadge
                v-if="player.role === 'Undercover'"
                color="orange"
                variant="subtle"
                size="xs"
                class="ml-1"
                >Infiltrato!</UBadge
              >
              <UBadge
                v-else-if="player.role === 'MrWhite'"
                color="red"
                variant="subtle"
                size="xs"
                class="ml-1"
                >Mr. White!</UBadge
              >
              <span
                v-if="
                  player.role === 'MrWhite' &&
                  mrWhiteWinners.some((w) => w.name === player.name)
                "
                class="italic text-green-600 dark:text-green-400 text-sm ml-1"
              >
                (Risposta Corretta)
              </span>
              <span
                v-else-if="isPlayerEliminated(player.name)"
                class="italic text-gray-500 dark:text-gray-400 text-sm ml-1"
              >
                (Eliminato)
              </span>
            </span>
          </li>
        </ul>

        <UButton
          color="green"
          size="xl"
          class="w-full max-w-xs mx-auto"
          block
          icon="i-heroicons-arrow-path"
          @click="playAgain"
        >
          Gioca Ancora
        </UButton>
      </UCard>

      <!-- Phase: Error State -->
      <UCard v-else-if="gamePhase === 'error'">
        <template #header>
          <h1 class="text-xl font-semibold text-red-600 dark:text-red-400">
            Errore
          </h1>
        </template>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Si è verificato un errore imprevisto. Per favore, riavvia il gioco.
        </p>
        <UButton
          color="red"
          variant="outline"
          block
          size="lg"
          @click="playAgain"
        >
          Riavvia Gioco
        </UButton>
      </UCard>

      <!-- Fallback Loading -->
      <div v-else class="text-center py-10">
        <p class="text-gray-500 dark:text-gray-400">Caricamento partita...</p>
        <!-- Optional: Add a USkeleton or loading spinner here -->
        <USkeleton class="h-12 w-1/2 mx-auto my-4" />
        <USkeleton class="h-8 w-3/4 mx-auto my-4" />
        <USkeleton class="h-10 w-1/3 mx-auto my-4" />
      </div>
    </UContainer>

    <div
      v-if="!gamePhase.startsWith('game_over')"
      class="text-center text-sm pt-6 px-8 w-full"
    >
      <p>
        Questa partita ti sta annoiando?
        <UButton
          color="red"
          variant="link"
          class="text-sm"
          label="Esci dalla partita e torna al menu"
          @click="askForExitConfirmation"
        />
      </p>
    </div>
    <div v-else class="text-center text-sm pt-6 px-8 w-full">
      <p>
        Vuoi aiutare a migliorare il gioco?
        <UButton
          color="blue"
          variant="link"
          class="text-sm"
          label="Clicca qui!"
          to="/#supporta"
        />
      </p>
    </div>

    <UModal
      v-model="isExitConfirmationModalOpen"
      :ui="{
        container: 'flex min-h-full items-center justify-center text-center',
      }"
    >
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Conferma Uscita</h2>
        </template>

        <p>
          Sei sicuro di voler abbandonare la partita in corso? Tutti i progressi
          andranno persi.
        </p>

        <template #footer>
          <div class="flex justify-end gap-4">
            <UButton
              variant="ghost"
              color="gray"
              @click="isExitConfirmationModalOpen = false"
            >
              Annulla
            </UButton>
            <UButton color="red" @click="exitGame">
              Esci dalla Partita
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
