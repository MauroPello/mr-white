
<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
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
watch(activePlayersState, (newActivePlayers, oldActivePlayers) => {
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
  <div class="container play-page">
    <!-- Phase: Showing Words -->
    <div v-if="gamePhase === 'showing_words'">
        <h1>Round {{ currentRound }}: Rivela Parole</h1>
        <div v-if="currentPlayerForWord">
          <h2>Passa il telefono a <span class="player-name">{{ currentPlayerForWord.name }}</span></h2>
          <p v-if="!showingWord">Tocca sotto quando sei pronto/a.</p>
          <button v-if="!showingWord" @click="showWord" class="action-button">Mostra la Mia Parola</button>
          <div v-if="showingWord" class="word-reveal">
            <p>La tua parola è:</p>
            <strong class="revealed-word">{{ currentPlayerForWord.word }}</strong>
            <button @click="hideWordAndProceed" class="action-button hide-button">
              Capito! Nascondi & {{ isLastWordToShow ? 'Inizia Discussione' : 'Passa Telefono' }}
            </button>
          </div>
        </div>
        <div v-else class="error-message">Errore: Impossibile determinare il giocatore corrente per la rivelazione della parola. Ricarica o riavvia.</div>
    </div>

    <!-- Phase: Discussing -->
    <div v-else-if="gamePhase === 'discussing'">
      <h1>Round {{ currentRound }}: Discussione</h1>
      <div v-if="wasVoteTiedState" class="tie-message info-box">
          L'ultima votazione è finita in parità! Nessuno è stato eliminato/a. Discutete di nuovo!
      </div>
        <p>Tutti i giocatori rimasti hanno visto la loro parola.</p>
        <p>Mettete giù il telefono e discutete! Cercate di trovare l'Infiltrato/gli Infiltrati.</p>
        <p>Quando siete pronti, il gruppo dovrebbe decidere di iniziare a votare.</p>
        <button @click="startVotingPhase" class="action-button start-voting-button">Inizia Votazione</button>
    </div>

    <!-- Phase: Voting -->
    <div v-else-if="gamePhase === 'voting'">
          <h1>Round {{ currentRound }}: Votazione</h1>
          <div v-if="currentPlayerForVote">
              <h2><span class="player-name">{{ currentPlayerForVote.name }}</span>, per favore vota!</h2>
              <p>Chi sospetti sia un Infiltrato?</p>
              <div class="voting-options">
                <button
                    v-for="option in votingOptions"
                    :key="option.name"
                    @click="castVote(option.name)"
                    class="action-button vote-button"
                    :disabled="option.name === currentPlayerForVote.name">
                    Vota per {{ option.name }}
                </button>
              </div>
          </div>
          <div v-else class="error-message">Errore: Impossibile determinare il votante corrente. Ricarica o riavvia.</div>
    </div>

    <!-- Phase: Elimination -->
    <div v-else-if="gamePhase === 'elimination'">
        <h1>Round {{ currentRound }}: Eliminazione</h1>
        <div v-if="lastEliminatedState" class="elimination-box info-box">
            <p class="elimination-result">
                In base ai voti,
                <span class="player-name eliminated-player">{{ lastEliminatedState.name }}</span>
                è stato/a eliminato/a!
            </p>
              <p>
                  {{ lastEliminatedState.name }} era
                  <strong :class="{'undercover-player': lastEliminatedState.isUndercover}">
                      {{ lastEliminatedState.isUndercover ? "un Infiltrato" : "un Cittadino" }}!
                  </strong>
              </p>
              <p>Ci sono {{ activePlayersState.length }} giocatori rimasti.</p>
              <button @click="goToDiscussion" class="action-button next-round-button">Continua alla Prossima Discussione</button>
        </div>
          <div v-else class="error-message">Errore: Dettagli eliminazione mancanti, ma in fase di eliminazione. Ricarica o riavvia.</div>
    </div>

    <!-- Phase: Game Over -->
    <div v-else-if="gamePhase.startsWith('game_over')">
        <h1>Partita Terminata!</h1>
        <h2 :class="{'undercover-wins': gamePhase === 'game_over_undercover_wins', 'civilians-win': gamePhase === 'game_over_civilians_win'}">
            {{ gameOverMessageState }}
        </h2>
        <p v-if="gameWordPairState">Le parole erano: <strong>{{ gameWordPairState.civilian }}</strong> (Cittadino) e <strong>{{ gameWordPairState.undercover }}</strong> (Infiltrato)</p>
        <h3>Stato Finale:</h3>
        <ul class="results-list">
            <li v-for="player in finalRoleRevealState" :key="player.name">
                  <span :class="{ 'undercover-player': player.isUndercover }">
                      {{ player.name }}: {{ player.word }}
                      <span v-if="player.isUndercover"> (Infiltrato!)</span>
                      <span v-if="isPlayerEliminated(player.name)" class="eliminated-tag"> (Eliminato/a)</span>
                </span>
            </li>
        </ul>
          <button @click="playAgain" class="action-button play-again-button">Gioca Ancora</button>
    </div>

    <!-- Phase: Error State -->
      <div v-else-if="gamePhase === 'error'">
        <h1>Errore</h1>
        <p>Si è verificato un errore imprevisto. Per favore, riavvia il gioco.</p>
        <button @click="playAgain" class="action-button play-again-button">Riavvia Gioco</button>
      </div>
      <!-- Fallback Loading -->
      <div v-else> <p>Caricamento partita...</p> </div>
  </div>
</template>

<style scoped lang="postcss">
.container {
@apply max-w-[500px] mx-auto my-4 p-6 bg-[#f0f8ff] rounded-lg shadow-md font-sans text-center min-h-[80vh];
}

h1 {
@apply text-[1.8rem] text-[#333] mb-4;
}

h2 {
@apply text-[1.4rem] text-[#555] mb-4;
}

p {
@apply text-[#555] leading-relaxed mb-4;
}

.player-name {
@apply font-bold text-[#007bff] bg-[#e7f3ff] px-2 py-[0.1em] rounded inline-block;
}

.eliminated-player {
@apply font-bold text-[#721c24] rounded;
}

.action-button {
@apply px-6 py-3 bg-[#17a2b8] text-white border border-transparent rounded cursor-pointer text-base transition-colors duration-200 mt-2 mr-2 inline-block align-middle disabled:bg-[#cccccc] disabled:cursor-not-allowed disabled:opacity-70 hover:enabled:bg-[#138496];
}

.hide-button {
@apply bg-[#ffc107] text-[#333] hover:enabled:bg-[#e0a800];
}

.start-voting-button {
@apply bg-[#fd7e14] hover:enabled:bg-[#e66a0a];
}

.next-round-button {
@apply bg-[#6f42c1] hover:enabled:bg-[#5a34a1];
}

.play-again-button {
@apply bg-[#28a745] w-[90%] mt-6 hover:enabled:bg-[#218838];
}

.word-reveal {
@apply bg-white p-6 border-2 border-[#17a2b8] rounded mt-4;
}

.revealed-word {
@apply block text-2xl font-bold text-[#dc3545] my-3 p-3 bg-[#fdfdfe] border border-dashed border-[#ccc] rounded break-words;
}

.voting-options {
@apply mt-6 flex flex-col items-center gap-3;
}

.vote-button {
@apply bg-[#007bff] w-[80%] max-w-[300px] p-4 text-[1.1rem] hover:enabled:bg-[#0056b3] disabled:bg-[#6c757d] disabled:border-[#6c757d] disabled:text-[#eee];
}

.info-box {
@apply border p-4 rounded mt-4 mb-6 text-center;
}

.tie-message {
@apply bg-[#fff3cd] border border-[#ffeeba] text-[#856404] font-bold;
}

.elimination-box {
@apply bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24];
}

.elimination-result {
@apply text-[1.1rem] mb-2;
}

.results-list {
@apply list-none p-0 mt-4 text-left max-w-[380px] mx-auto;
}

.results-list li {
@apply bg-white p-3 mb-2 border border-[#eee] rounded text-[0.95rem];
}

.results-list li span {
@apply block;
}

.undercover-player {
@apply font-bold text-[#dc3545];
}

.eliminated-tag {
@apply italic text-[#6c757d] ml-2 text-[0.9em];
}

.undercover-wins {
@apply text-[#dc3545];
}

.civilians-win {
@apply text-[#28a745];
}

.error-message {
@apply text-[#721c24] bg-[#f8d7da] border border-[#f5c6cb] p-4 rounded mt-4;
}
</style>