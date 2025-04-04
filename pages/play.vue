
<script setup lang="ts">
import { saveGameStateToLocalStorage, clearSavedGameState } from '~/utils/gameStateStorage';
import {
  useGamePhase, useActivePlayers, useCurrentRound, useGameWordPair,
  useAssignments, usePlayers, useCurrentVotes, useVotingPlayerIndex,
  useLastEliminated, useGameOverMessage, useFinalRoleReveal,
  useEliminatedPlayersHistory, useWasVoteTied, useNumberOfUndercovers,
  useWordShowingPlayerIndex,
  type PlayerAssignment, type GamePhase
} from '~/composables/useGameState';

const router = useRouter();

// Global State Refs
const gamePhase = useGamePhase();
const activePlayersState = useActivePlayers();
const currentRound = useCurrentRound();
const gameWordPairState = useGameWordPair();
const assignmentsState = useAssignments();
const playersListState = usePlayers();
const numberOfUndercoversState = useNumberOfUndercovers();
const currentVotes = useCurrentVotes();
const votingPlayerIndex = useVotingPlayerIndex();
const lastEliminatedState = useLastEliminated();
const gameOverMessageState = useGameOverMessage();
const finalRoleRevealState = useFinalRoleReveal();
const eliminatedHistory = useEliminatedPlayersHistory();
const wasVoteTiedState = useWasVoteTied();
const wordShowingPlayerIndex = useWordShowingPlayerIndex();

// Local State
const showingWord = ref(false);

// Computed Properties
const currentPlayerForWord = computed<PlayerAssignment | undefined>(() => {
  const phase = gamePhase.value;
  const players = activePlayersState.value;
  const index = wordShowingPlayerIndex.value;
  if (phase === 'showing_words' && players && players.length > index && index >= 0) {
    return players[index];
  }
  return undefined;
});

const isLastWordToShow = computed(() => {
    if (!activePlayersState.value) return false;
    const index = wordShowingPlayerIndex.value;
    return index >= 0 && index >= activePlayersState.value.length - 1;
});

const currentPlayerForVote = computed<PlayerAssignment | undefined>(() => {
  const phase = gamePhase.value;
  const players = activePlayersState.value;
  const index = votingPlayerIndex.value;
    if (phase === 'voting' && players && players.length > index && index >=0 ) {
      return players[index];
  }
  return undefined;
});

const votingOptions = computed(() => activePlayersState.value || []);

const isLastVoter = computed(() => {
    if (!activePlayersState.value) return false;
    return votingPlayerIndex.value >= 0 && votingPlayerIndex.value >= activePlayersState.value.length - 1;
});

const eliminatedPlayerNames = computed(() => new Set((eliminatedHistory.value || []).map(p => p.name)));

const isPlayerEliminated = (playerName: string): boolean => eliminatedPlayerNames.value.has(playerName);

// Watcher for Auto-Saving
watchEffect(() => {
    if (gamePhase.value && gamePhase.value !== 'error' && activePlayersState.value && assignmentsState.value && gameWordPairState.value) {
          // Avoid saving right at the start before any interaction
          if (gamePhase.value !== 'showing_words' || wordShowingPlayerIndex.value > 0 || showingWord.value) {
              saveCurrentGameState();
          }
    }
});

// Watcher for Win Condition Check
watch(activePlayersState, (newActivePlayers, _) => {
    // Check only after the showing words phase and if not already game over
    if (newActivePlayers && gamePhase.value !== 'showing_words' && !gamePhase.value.startsWith('game_over')) {
          nextTick(() => {
              checkAndDetermineWinner();
          });
    }
}, { deep: true });

// --- Methods ---

function saveCurrentGameState() {
    if (!playersListState.value || !gameWordPairState.value || !assignmentsState.value || !activePlayersState.value ) {
          console.warn("Attempted to save, but essential state missing.");
          return;
    }
    saveGameStateToLocalStorage({
        players: playersListState.value,
        gameWordPair: gameWordPairState.value,
        assignments: assignmentsState.value,
        numberOfUndercovers: numberOfUndercoversState.value,
        activePlayers: activePlayersState.value,
        currentRound: currentRound.value,
        wordShowingPlayerIndex: wordShowingPlayerIndex.value,
        gamePhase: gamePhase.value,
        currentVotes: currentVotes.value,
        votingPlayerIndex: votingPlayerIndex.value,
        wasVoteTied: wasVoteTiedState.value,
        lastEliminated: lastEliminatedState.value,
        eliminatedHistory: eliminatedHistory.value,
        gameOverMessage: gameOverMessageState.value,
        finalRoleReveal: finalRoleRevealState.value,
    });
}

function showWord() {
    showingWord.value = true;
}

function hideWordAndProceed() {
  showingWord.value = false;
  const currentMaxIndex = (activePlayersState.value?.length ?? 0) - 1;
  if (isLastWordToShow.value || wordShowingPlayerIndex.value >= currentMaxIndex) {
    goToDiscussion();
  } else {
        wordShowingPlayerIndex.value++;
  }
}

function startVotingPhase() {
    wasVoteTiedState.value = false;
    gamePhase.value = 'voting';
    votingPlayerIndex.value = 0;
    currentVotes.value = {};
    (activePlayersState.value || []).forEach(player => {
        if (player?.name) { currentVotes.value[player.name] = 0; }
    });
}

function castVote(votedForPlayerName: string) {
    if (currentVotes.value[votedForPlayerName] === undefined) { currentVotes.value[votedForPlayerName] = 0; }
    currentVotes.value[votedForPlayerName]++;

    const currentMaxVoterIndex = (activePlayersState.value?.length ?? 0) - 1;
    if (isLastVoter.value || votingPlayerIndex.value >= currentMaxVoterIndex) {
        processVotes();
    } else {
        votingPlayerIndex.value++;
    }
}

function processVotes() {
    const votes = currentVotes.value;
    let maxVotes = -1;
    let playersWithMaxVotes: string[] = [];
    const activeNames = (activePlayersState.value || []).map(p => p.name);

    activeNames.forEach(playerName => {
          const voteCount = votes[playerName] || 0;
          if (voteCount > maxVotes) {
            maxVotes = voteCount;
            playersWithMaxVotes = [playerName];
        } else if (voteCount === maxVotes && voteCount > 0) {
            playersWithMaxVotes.push(playerName);
        }
    });

    if (playersWithMaxVotes.length === 1 && maxVotes > 0) {
        const eliminatedPlayerName = playersWithMaxVotes[0];
        const eliminatedPlayer = activePlayersState.value.find(p => p.name === eliminatedPlayerName);
        if (!eliminatedPlayer) { gamePhase.value = 'error'; return; }

        wasVoteTiedState.value = false;
        lastEliminatedState.value = { ...eliminatedPlayer };
        eliminatedHistory.value = [...eliminatedHistory.value, { ...eliminatedPlayer }];
        activePlayersState.value = activePlayersState.value.filter(p => p.name !== eliminatedPlayerName); // Triggers watcher
        gamePhase.value = 'elimination';

    } else {
        console.log("Votazione in parità o inconcludente. Nessuna eliminazione.");
        wasVoteTiedState.value = true;
        lastEliminatedState.value = null;
        goToDiscussion(); // Skips elimination phase display
    }
}

function goToDiscussion() {
    if (checkAndDetermineWinner()) { return; } // Check if game ends immediately

    if(gamePhase.value === 'elimination' || wasVoteTiedState.value ) {
        currentRound.value++;
    }
    gamePhase.value = 'discussing';
    votingPlayerIndex.value = 0;
    currentVotes.value = {};
    wordShowingPlayerIndex.value = 0; // Reset for safety
    if (!wasVoteTiedState.value) { lastEliminatedState.value = null; }
}

function checkAndDetermineWinner(): boolean {
    if (gamePhase.value.startsWith('game_over') || !activePlayersState.value) {
        return gamePhase.value.startsWith('game_over');
    }

    const currentActivePlayers = activePlayersState.value;
    const numActivePlayers = currentActivePlayers.length;
    if (numActivePlayers === 0 && !gamePhase.value.startsWith('game_over')) { return false; }
    const numActiveUndercovers = currentActivePlayers.filter(p => p.isUndercover).length;
    const numActiveCivilians = numActivePlayers - numActiveUndercovers;

    let gameOver = false;
    let winnerMessage = '';
    let endPhase: GamePhase | null = null;

    if (numActiveUndercovers === 0 && numActivePlayers > 0) {
        gameOver = true;
        winnerMessage = "Tutti gli Infiltrati Eliminati! Vincono i Cittadini!";
        endPhase = 'game_over_civilians_win';
    }
    else if ((numActiveCivilians === 0 && numActivePlayers > 0) || (numActiveUndercovers === 1 && numActiveCivilians === 1)) {
        gameOver = true;
        winnerMessage = "Gli Infiltrati non possono essere fermati! Vincono gli Infiltrati!";
        endPhase = 'game_over_undercover_wins';
    }

    if (gameOver && endPhase) {
        console.log("Condizione Fine Partita Raggiunta:", winnerMessage);
        if (!gamePhase.value.startsWith('game_over')) {
            gamePhase.value = endPhase;
            gameOverMessageState.value = winnerMessage;
            finalRoleRevealState.value = getOriginalAssignmentsInOrder();
        }
        return true;
    }
    return false;
}

function getOriginalAssignmentsInOrder(): PlayerAssignment[] {
    const originalPlayerNames = playersListState.value || [];
    const assignmentMap = new Map((assignmentsState.value || []).map(a => [a.name, a]));
    return originalPlayerNames.map(name => {
        return assignmentMap.get(name) || { name: name, word: 'Errore', isUndercover: false };
    });
}

function playAgain() {
  clearSavedGameState();
  router.push('/');
}

onMounted(() => {
  const isGameOver = gamePhase.value.startsWith('game_over');
    // Robust check for valid state on load
  if (!assignmentsState.value || assignmentsState.value.length === 0 || !activePlayersState.value || (activePlayersState.value.length === 0 && !isGameOver) || !gameWordPairState.value ) {
    console.warn("Play page loaded with invalid/missing state, redirecting.");
    router.replace('/');
    return;
  }

  if(isGameOver && (!finalRoleRevealState.value || finalRoleRevealState.value.length === 0)) {
        console.log("Re-populating final roles on game over screen load.");
        finalRoleRevealState.value = getOriginalAssignmentsInOrder();
  }

  // Check win condition on mount only if not starting fresh
  if (gamePhase.value !== 'showing_words') {
      checkAndDetermineWinner();
  } else {
        // Ensure index is 0 if starting fresh
        if (wordShowingPlayerIndex.value !== 0) {
            console.warn(`Play page mounted in 'showing_words' phase but index is ${wordShowingPlayerIndex.value}. Resetting to 0.`);
            wordShowingPlayerIndex.value = 0;
        }
  }
});
</script>

<template>
    <UContainer class="py-8">

      <!-- Phase: Showing Words -->
      <UCard v-if="gamePhase === 'showing_words'" class="text-center">
        <template #header>
          <h1 class="text-xl font-semibold">Round {{ currentRound }}: Rivela Parole</h1>
        </template>

        <div v-if="currentPlayerForWord" class="space-y-4">
          <h2 class="text-lg">
              Passa il telefono a
              <UBadge color="primary" variant="subtle" size="lg">
                  {{ currentPlayerForWord.name }}
              </UBadge>
          </h2>

          <p v-if="!showingWord" class="text-gray-600 dark:text-gray-400">
              Tocca sotto quando sei pronto/a.
          </p>

          <UButton
              v-if="!showingWord"
              size="lg"
              icon="i-heroicons-eye"
              @click="showWord"
              >
              Mostra la Mia Parola
          </UButton>

          <UCard v-if="showingWord" class="bg-white dark:bg-gray-800 border-primary-500 dark:border-primary-400 border-2">
              <p class="text-gray-700 dark:text-gray-300 mb-2">La tua parola è:</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400 my-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded break-words bg-gray-50 dark:bg-gray-700/50">
                  {{ currentPlayerForWord.word }}
              </p>
              <UButton
                  color="amber"
                  size="lg"
                  icon="i-heroicons-check-circle"
                  @click="hideWordAndProceed"
              >
                  Capito! Nascondi & {{ isLastWordToShow ? 'Inizia Discussione' : 'Passa Telefono' }}
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
              <h1 class="text-xl font-semibold">Round {{ currentRound }}: Discussione</h1>
          </template>

          <UAlert
              v-if="wasVoteTiedState"
              icon="i-heroicons-hand-raised"
              color="yellow"
              variant="subtle"
              title="Votazione in Parità!"
              description="Nessuno è stato eliminato/a. Discutete di nuovo!"
              class="mb-4"
           />

          <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>Tutti i giocatori rimasti hanno visto la loro parola.</p>
              <p>Mettete giù il telefono e discutete! Cercate di trovare l'Infiltrato/gli Infiltrati.</p>
              <p>Quando siete pronti, iniziate a votare.</p>
          </div>

          <template #footer>
              <UButton
                  color="orange"
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
               <h1 class="text-xl font-semibold">Round {{ currentRound }}: Votazione</h1>
          </template>

          <div v-if="currentPlayerForVote" class="space-y-4">
              <h2 class="text-lg">
                  <UBadge color="primary" variant="subtle" size="lg">
                      {{ currentPlayerForVote.name }}
                  </UBadge>, per favore vota!
              </h2>
              <p class="text-gray-600 dark:text-gray-400">Chi sospetti sia un Infiltrato?</p>

              <div class="flex flex-col items-center gap-3 mt-6">
                  <UButton
                      v-for="option in votingOptions"
                      :key="option.name"
                      :disabled="option.name === currentPlayerForVote.name"
                      size="lg"
                      color="blue"
                      class="w-full max-w-xs"
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
               <h1 class="text-xl font-semibold">Round {{ currentRound }}: Eliminazione</h1>
           </template>

          <div v-if="lastEliminatedState">
              <UAlert
                  icon="i-heroicons-user-minus-20-solid"
                  color="red"
                  variant="subtle"
                  class="mb-4"
              >
                  <template #title>
                      <span class="font-semibold">Eliminato/a!</span>
                  </template>
                  <template #description>
                       In base ai voti,
                      <UBadge color="red" variant="solid">{{ lastEliminatedState.name }}</UBadge>
                      è stato/a eliminato/a!
                      <p class="mt-1">
                          Era
                           <span class="font-semibold" :class="{'text-red-600 dark:text-red-400': lastEliminatedState.isUndercover, 'text-green-600 dark:text-green-400': !lastEliminatedState.isUndercover}">
                              {{ lastEliminatedState.isUndercover ? "un Infiltrato" : "un Cittadino" }}!
                           </span>
                      </p>
                  </template>
              </UAlert>

              <p class="text-gray-600 dark:text-gray-400 my-4">
                  Ci sono {{ activePlayersState.length }} giocatori rimasti.
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

      <!-- Phase: Game Over -->
      <UCard v-else-if="gamePhase.startsWith('game_over')" class="text-center">
          <template #header>
              <h1 class="text-2xl font-bold">Partita Terminata!</h1>
          </template>

          <h2
class="text-xl font-semibold mb-4"
              :class="{'text-red-600 dark:text-red-400': gamePhase === 'game_over_undercover_wins', 'text-green-600 dark:text-green-400': gamePhase === 'game_over_civilians_win'}">
              {{ gameOverMessageState }}
          </h2>

          <p v-if="gameWordPairState" class="text-gray-600 dark:text-gray-400 mb-4">
              Le parole erano:
              <UBadge variant="soft" color="gray" size="md">{{ gameWordPairState.civilian }}</UBadge> (Cittadino) e
              <UBadge variant="soft" color="red" size="md">{{ gameWordPairState.undercover }}</UBadge> (Infiltrato)
          </p>

          <UDivider label="Stato Finale" class="my-6" />

          <ul class="space-y-2 text-left max-w-md mx-auto mb-6">
              <li
v-for="player in finalRoleRevealState" :key="player.name"
                  class="p-3 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                   <span :class="{ 'font-bold text-red-600 dark:text-red-400': player.isUndercover }">
                       {{ player.name }}: {{ player.word }}
                       <UBadge v-if="player.isUndercover" color="red" variant="subtle" size="xs" class="ml-1">Infiltrato!</UBadge>
                       <span v-if="isPlayerEliminated(player.name)" class="italic text-gray-500 dark:text-gray-400 text-sm ml-1"> (Eliminato/a)</span>
                  </span>
              </li>
          </ul>

          <UButton
              color="green"
              size="xl"
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
              <h1 class="text-xl font-semibold text-red-600 dark:text-red-400">Errore</h1>
           </template>
           <p class="text-gray-700 dark:text-gray-300 mb-4">
               Si è verificato un errore imprevisto. Per favore, riavvia il gioco.
           </p>
           <UButton color="red" variant="outline" block size="lg" @click="playAgain">
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
  </template>