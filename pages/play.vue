<template>
    <div class="container play-page">
      <!-- === Phase: Showing Words === -->
      <div v-if="gamePhase === 'showing_words'">
         <h1>Round {{ currentRound }}: Reveal Words</h1>
         <div v-if="currentPlayerForWord">
           <h2>Pass the phone to <span class="player-name">{{ currentPlayerForWord.name }}</span></h2>
           <p v-if="!showingWord">Tap below when you are ready.</p>

           <button v-if="!showingWord" @click="showWord" class="action-button">
             Show My Word
           </button>

           <div v-if="showingWord" class="word-reveal">
             <p>Your word is:</p>
             <strong class="revealed-word">{{ currentPlayerForWord.word }}</strong>
             <button @click="hideWordAndProceed" class="action-button hide-button">
               Got it! Hide & {{ isLastWordToShow ? 'Start Discussion' : 'Pass Phone' }}
             </button>
           </div>
         </div>
         <div v-else class="error-message">Error: Could not determine current player for word reveal.</div>
      </div>

      <!-- === Phase: Discussing === -->
      <div v-else-if="gamePhase === 'discussing'">
        <h1>Round {{ currentRound }}: Discussion</h1>
        <!-- Display Tie Message if applicable -->
        <div v-if="wasVoteTiedState" class="tie-message info-box">
            The last vote ended in a tie! No one was eliminated. Discuss again!
        </div>
         <p>Everyone remaining has seen their word.</p>
         <p>Put the phone down and discuss! Try to find the Undercover.</p>
         <p>When ready, the group should decide to start voting.</p>
         <button @click="startVotingPhase" class="action-button start-voting-button">
           Start Voting
         </button>
      </div>

      <!-- === Phase: Voting === -->
      <div v-else-if="gamePhase === 'voting'">
           <h1>Round {{ currentRound }}: Voting</h1>
           <div v-if="currentPlayerForVote">
               <h2><span class="player-name">{{ currentPlayerForVote.name }}</span>, please vote!</h2>
               <p>Who do you think is the Undercover?</p>
               <div class="voting-options">
                  <button
                      v-for="option in votingOptions"
                      :key="option.name"
                      @click="castVote(option.name)"
                      class="action-button vote-button"
                      :disabled="option.name === currentPlayerForVote.name"
                  >
                      Vote for {{ option.name }}
                  </button>
               </div>
           </div>
           <div v-else class="error-message">Error: Could not determine the current voter.</div>
      </div>

      <!-- === Phase: Elimination (Only shown if someone IS eliminated) === -->
      <div v-else-if="gamePhase === 'elimination'">
          <h1>Round {{ currentRound }}: Elimination</h1>
          <div v-if="lastEliminatedState" class="elimination-box info-box">
              <p class="elimination-result">
                  Based on the votes,
                  <span class="player-name eliminated-player">{{ lastEliminatedState.name }}</span>
                  has been eliminated!
              </p>
               <p>There are {{ activePlayersState.length }} players remaining.</p>
               <button @click="goToDiscussion" class="action-button next-round-button">
                  Continue to Next Discussion
               </button>
          </div>
           <div v-else class="error-message">Error: Elimination details missing, but in elimination phase.</div>
      </div>

      <!-- === Phase: Game Over === -->
      <div v-else-if="gamePhase.startsWith('game_over')">
          <h1>Game Over!</h1>
          <h2 :class="{'undercover-wins': gamePhase === 'game_over_undercover_wins', 'civilians-win': gamePhase === 'game_over_civilians_win'}">
              {{ gameOverMessageState }}
          </h2>
          <p v-if="gameWordPairState">The words were: <strong>{{ gameWordPairState.civilian }}</strong> (Civilian) and <strong>{{ gameWordPairState.undercover }}</strong> (Undercover)</p>

          <h3>Final Status:</h3>
          <ul class="results-list">
              <!-- Use finalRoleRevealState which has ALL original players -->
              <li v-for="player in finalRoleRevealState" :key="player.name">
                   <span :class="{ 'undercover-player': player.isUndercover }">
                       {{ player.name }}: {{ player.word }}
                       <span v-if="player.isUndercover"> (Undercover!)</span>
                       <!-- Add Eliminated Tag -->
                       <span v-if="isPlayerEliminated(player.name)" class="eliminated-tag"> (Eliminated)</span>
                  </span>
              </li>
          </ul>
           <button @click="playAgain" class="action-button play-again-button">
              Play Again
           </button>
      </div>

       <!-- === Error State === -->
       <div v-else-if="gamePhase === 'error'">
          <h1>Error</h1>
          <p>An unexpected error occurred. Please restart the game.</p>
           <button @click="playAgain" class="action-button play-again-button">
              Restart Game
           </button>
       </div>

        <!-- Fallback / Loading (Optional) -->
        <div v-else>
            <p>Loading game...</p>
        </div>

    </div>
  </template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { saveGameStateToLocalStorage, clearSavedGameState } from '~/utils/gameStateStorage';
import {
  useGamePhase,
  useActivePlayers,
  useCurrentRound,
  useGameWordPair,
  useAssignments,
  usePlayers,
  useCurrentVotes,
  useVotingPlayerIndex,
  useLastEliminated,
  useGameOverMessage,
  useFinalRoleReveal,
  useEliminatedPlayersHistory,
  useWasVoteTied,
  // useNumberOfUndercovers, // Not directly needed in template/logic here
  type PlayerAssignment,
  type GamePhase
} from '~/composables/useGameState';

const router = useRouter();

// State Refs
const gamePhase = useGamePhase();
const activePlayersState = useActivePlayers();
const currentRound = useCurrentRound();
const gameWordPairState = useGameWordPair();
const assignmentsState = useAssignments();
const playersListState = usePlayers(); // Need this for saving
const numberOfUndercoversState = useNumberOfUndercovers(); // Need this for saving
const currentVotes = useCurrentVotes();
const votingPlayerIndex = useVotingPlayerIndex();
const lastEliminatedState = useLastEliminated();
const gameOverMessageState = useGameOverMessage();
const finalRoleRevealState = useFinalRoleReveal();
const eliminatedHistory = useEliminatedPlayersHistory();
const wasVoteTiedState = useWasVoteTied();

// Local state
const wordShowingPlayerIndex = ref(0);
const showingWord = ref(false);

// --- Computed Properties --- (Unchanged from previous correct version)
const currentPlayerForWord = computed<PlayerAssignment | null>(() => {
  const phase = gamePhase.value;
  const players = activePlayersState.value;
  const index = wordShowingPlayerIndex.value;
  if (phase === 'showing_words' && players && players.length > index && index >= 0) {
    return players[index];
  }
  return null;
});

const isLastWordToShow = computed(() => {
    if (!activePlayersState.value) return false;
    // Ensure index is valid before comparing
    return wordShowingPlayerIndex.value >= 0 && wordShowingPlayerIndex.value >= activePlayersState.value.length - 1;
});

const currentPlayerForVote = computed<PlayerAssignment | null>(() => {
  const phase = gamePhase.value;
  const players = activePlayersState.value;
  const index = votingPlayerIndex.value;
   if (phase === 'voting' && players && players.length > index && index >=0 ) {
      return players[index];
  }
  return null;
});

const votingOptions = computed(() => activePlayersState.value || []);

const isLastVoter = computed(() => {
    if (!activePlayersState.value) return false;
    return votingPlayerIndex.value >= 0 && votingPlayerIndex.value >= activePlayersState.value.length - 1;
});

const eliminatedPlayerNames = computed(() => new Set((eliminatedHistory.value || []).map(p => p.name)));

const isPlayerEliminated = (playerName: string): boolean => eliminatedPlayerNames.value.has(playerName);


// --- Watchers --- (Unchanged)
watch(activePlayersState, (newActivePlayers, oldActivePlayers) => {
    if (newActivePlayers && gamePhase.value !== 'showing_words' && !gamePhase.value.startsWith('game_over')) {
        nextTick(() => { checkAndDetermineWinner(); });
    }
}, { deep: true });

// --- NEW: Watcher for Auto-Saving Game State ---
watchEffect(() => {
    // This effect runs initially and whenever any of its dependencies change.
    // We access all relevant state refs here, so any change triggers a save.
    // Avoid saving during initial load if state isn't fully set or if phase is error
    if (gamePhase.value && gamePhase.value !== 'error' && activePlayersState.value && assignmentsState.value) {
        // Don't save immediately on setup if navigating right away
        // A small delay can prevent saving incomplete initial state during navigation/setup
        // However, for robustness, let's save whenever state is stable.
         if (gamePhase.value !== 'showing_words' || wordShowingPlayerIndex.value > 0 || showingWord.value) {
              // Save unless it's the very start of showing_words before interaction
             saveCurrentGameState();
         } else if (gamePhase.value === 'showing_words' && wordShowingPlayerIndex.value === 0 && !showingWord.value && activePlayersState.value?.length > 0) {
             // If it IS the very start, maybe save initial state once?
             // Let's rely on the save in index.vue after startGame for initial state.
             // console.log("Skipping auto-save at initial word showing state.");
         } else {
             saveCurrentGameState(); // Save in other valid states
         }
    }
});

// Helper function to gather current state and save it (can be defined here or imported if moved)
function saveCurrentGameState() {
    // Make sure all required states have values before saving
    // Especially check potentially null values like gameWordPair
    if (!playersListState.value || !gameWordPairState.value || !assignmentsState.value || !activePlayersState.value ) {
        console.warn("Attempted to save game state, but some essential refs are null/empty. Aborting save.", {
             players: playersListState.value, gp: gameWordPairState.value, a: assignmentsState.value, ap: activePlayersState.value
        });
        return;
    }

    saveGameStateToLocalStorage({
        players: playersListState.value,
        gameWordPair: gameWordPairState.value,
        assignments: assignmentsState.value,
        numberOfUndercovers: numberOfUndercoversState.value,
        activePlayers: activePlayersState.value,
        currentRound: currentRound.value,
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

function showWord() { showingWord.value = true; }

function hideWordAndProceed() {
  showingWord.value = false;
  if (isLastWordToShow.value) {
    goToDiscussion();
    wordShowingPlayerIndex.value = 0; // Reset index after finishing
  } else {
     if (wordShowingPlayerIndex.value < (activePlayersState.value?.length ?? 0) -1 ) {
       wordShowingPlayerIndex.value++;
     } else {
        // Should have been caught by isLastWordToShow, but log error just in case
        console.error("Tried to increment wordShowingPlayerIndex beyond limits.");
        goToDiscussion(); // Failsafe to move on
     }
  }
}

function startVotingPhase() {
    wasVoteTiedState.value = false;
    gamePhase.value = 'voting';
    votingPlayerIndex.value = 0;
    currentVotes.value = {};
    (activePlayersState.value || []).forEach(player => {
        if (player && player.name) {
           currentVotes.value[player.name] = 0;
        }
    });
}

function castVote(votedForPlayerName: string) {
    if (currentVotes.value[votedForPlayerName] === undefined) {
        currentVotes.value[votedForPlayerName] = 0;
    }
    currentVotes.value[votedForPlayerName]++;

    if (isLastVoter.value) {
        processVotes();
    } else {
        if (votingPlayerIndex.value < (activePlayersState.value?.length ?? 0) -1) {
            votingPlayerIndex.value++;
        } else {
            console.error("Tried to increment votingPlayerIndex beyond limits.");
            processVotes(); // Failsafe
        }
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
        } else if (voteCount === maxVotes && voteCount > 0) { // Only add to tie if votes > 0
            playersWithMaxVotes.push(playerName);
        }
    });

    if (playersWithMaxVotes.length === 1 && maxVotes > 0) {
        // Single player eliminated
        const eliminatedPlayerName = playersWithMaxVotes[0];
        const eliminatedPlayer = activePlayersState.value.find(p => p.name === eliminatedPlayerName);

        if (!eliminatedPlayer) {
            console.error("Error finding eliminated player:", eliminatedPlayerName);
            gamePhase.value = 'error'; return;
        }

        wasVoteTiedState.value = false;
        lastEliminatedState.value = { ...eliminatedPlayer };
        eliminatedHistory.value = [...eliminatedHistory.value, { ...eliminatedPlayer }];
        // --- IMPORTANT: Update activePlayersState IMMUTABLY to trigger watcher reliably ---
        activePlayersState.value = activePlayersState.value.filter(p => p.name !== eliminatedPlayerName);
        // --- Set phase AFTER state update ---
        gamePhase.value = 'elimination'; // Watcher will trigger win check

    } else {
        // Tie or no decisive vote
        console.log("Vote tied or inconclusive. No elimination.");
        wasVoteTiedState.value = true;
        lastEliminatedState.value = null;
        goToDiscussion(); // Go directly to discussion, win check happens in goToDiscussion
    }
}

function goToDiscussion() {
    // Check win condition *before* potentially changing round/phase
    if (checkAndDetermineWinner()) {
         return; // Game ended, do nothing more
    }

    // If game continues...
    if(gamePhase.value === 'elimination' || wasVoteTiedState.value ) {
       currentRound.value++;
    }

    gamePhase.value = 'discussing';
    votingPlayerIndex.value = 0; // Reset voter index
    currentVotes.value = {};      // Clear votes
    if (!wasVoteTiedState.value) { // Clear last eliminated unless coming from a tie
        lastEliminatedState.value = null;
    }
    wordShowingPlayerIndex.value = 0; // Reset word index for safety (though not used after round 1)
}


// Combined Win Condition Check and Game End Logic
function checkAndDetermineWinner(): boolean {
    if (gamePhase.value.startsWith('game_over') || !activePlayersState.value) {
        return gamePhase.value.startsWith('game_over');
    }

    const currentActivePlayers = activePlayersState.value;
    const numActivePlayers = currentActivePlayers.length;
    // Check for edge case where list might be empty during transitions
    if (numActivePlayers === 0 && !gamePhase.value.startsWith('game_over')) {
        console.warn("checkAndDetermineWinner called with 0 active players, likely an error state.");
        // gamePhase.value = 'error'; // Optionally force error state
        return false; // Prevent ending game incorrectly
    }
    const numActiveUndercovers = currentActivePlayers.filter(p => p.isUndercover).length;
    const numActiveCivilians = numActivePlayers - numActiveUndercovers;

    let gameOver = false;
    let winnerMessage = '';
    let endPhase: GamePhase | null = null;

    // Condition 1: All Undercovers are eliminated
    if (numActiveUndercovers === 0 && numActivePlayers > 0) {
        gameOver = true;
        winnerMessage = "All Undercovers Eliminated! Civilians Win!";
        endPhase = 'game_over_civilians_win';
    }
    // Condition 2: All Civilians are eliminated
    // Condition 3: 1 Undercover and 1 Civilian left
    else if ((numActiveCivilians === 0 && numActivePlayers > 0) || (numActiveUndercovers == 1 && numActiveCivilians == 1)) {
        gameOver = true;
        winnerMessage = "Undercovers cannot be stopped! Undercovers Win!";
        endPhase = 'game_over_undercover_wins';
    }

    if (gameOver && endPhase) {
        console.log("Game Over Condition Met:", winnerMessage);
        // Ensure we don't overwrite if already game over
        if (!gamePhase.value.startsWith('game_over')) {
            gamePhase.value = endPhase;
            gameOverMessageState.value = winnerMessage;
            finalRoleRevealState.value = getOriginalAssignmentsInOrder();
        }
        return true; // Game has ended
    }

    return false; // Game continues
}


function getOriginalAssignmentsInOrder(): PlayerAssignment[] {
    const originalPlayerNames = playersListState.value || [];
    const assignmentMap = new Map((assignmentsState.value || []).map(a => [a.name, a]));
    return originalPlayerNames.map(name => {
        return assignmentMap.get(name) || { name: name, word: 'Error', isUndercover: false };
    });
}

// Modified Play Again
function playAgain() {
  // Clear the saved state BEFORE navigating away
  clearSavedGameState();
  // Resetting global state is handled by index.vue on load/discard
  router.push('/');
}

// --- Lifecycle Hook ---
onMounted(() => {
  // Redirect check - ensure activePlayers exists AND has items if not game over
  const isGameOver = gamePhase.value.startsWith('game_over');
  if (!assignmentsState.value || assignmentsState.value.length === 0 || !activePlayersState.value || (activePlayersState.value.length === 0 && !isGameOver)) {
    console.warn("Play page loaded with invalid/missing state, redirecting.", {
        hasAssignments: !!assignmentsState.value,
        assignmentsLength: assignmentsState.value?.length,
        hasActivePlayers: !!activePlayersState.value,
        activePlayersLength: activePlayersState.value?.length,
        isGameOver: isGameOver
     });
    router.replace('/');
    return; // Stop further execution in onMounted
  }

  // Re-populate final roles check (only if game over)
  if(isGameOver && (!finalRoleRevealState.value || finalRoleRevealState.value.length === 0)) {
       console.log("Re-populating final roles on game over screen load.");
       finalRoleRevealState.value = getOriginalAssignmentsInOrder();
  }

  // --- CORRECTED WIN CONDITION CHECK ---
  // Only run the win check on mount IF the game is NOT supposed to be in the initial word showing phase.
  // This prevents it from messing up the start of a new game.
  if (gamePhase.value !== 'showing_words') {
      console.log("Checking win condition on mount because phase is not 'showing_words'. Phase:", gamePhase.value);
      checkAndDetermineWinner();
  } else {
      // If we are starting fresh, ensure the word index is reset correctly.
      wordShowingPlayerIndex.value = 0;
      console.log("Game starting normally (showing_words phase). Word index reset to 0.");
  }
});

</script>

  <style scoped>
  .container {
    max-width: 500px;
    margin: 1rem auto; /* Reduced margin */
    padding: 1.5rem;  /* Reduced padding */
    background-color: #f0f8ff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: sans-serif;
    text-align: center;
    min-height: 80vh; /* Ensure container takes reasonable height */
  }

  h1, h2 {
    color: #333;
    margin-bottom: 1rem;
  }
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.4rem; color: #555;}

  .player-name {
      font-weight: bold;
      color: #007bff;
      background-color: #e7f3ff;
      padding: 0.1em 0.4em;
      border-radius: 4px;
      display: inline-block; /* Prevent wrapping issues */
  }

  .eliminated-player {
      color: #721c24; /* Darker red from info box */
      /* background-color: #f8d7da; */ /* Background from info box */
      /* padding: 0.1em 0.4em; */
      border-radius: 4px;
      font-weight: bold;
  }

  p {
      color: #555;
      line-height: 1.5;
      margin-bottom: 1rem;
  }

  .action-button {
    padding: 0.8rem 1.5rem; /* Slightly smaller */
    background-color: #17a2b8;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem; /* Slightly smaller */
    transition: background-color 0.2s ease;
    margin-top: 0.5rem;
    margin-right: 0.5rem; /* Spacing for multiple buttons */
    display: inline-block;
    width: auto;
    border: 1px solid transparent; /* Base border */
    vertical-align: middle; /* Align buttons better if text wraps */
  }
  .action-button:hover:not(:disabled) {
    background-color: #138496;
  }
  .action-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }


  .hide-button { background-color: #ffc107; color: #333; }
  .hide-button:hover:not(:disabled) { background-color: #e0a800; }

  .start-voting-button { background-color: #fd7e14; /* Orange */ }
  .start-voting-button:hover:not(:disabled) { background-color: #e66a0a; }

  .next-round-button { background-color: #6f42c1; /* Indigo */ }
  .next-round-button:hover:not(:disabled) { background-color: #5a34a1; }

  .play-again-button { background-color: #28a745; width: 90%; margin-top: 1.5rem; }
  .play-again-button:hover:not(:disabled) { background-color: #218838; }


  .word-reveal {
      background-color: #fff;
      padding: 1.5rem;
      border: 2px solid #17a2b8;
      border-radius: 5px;
      margin-top: 1rem;
  }

  .revealed-word {
    display: block;
    font-size: 2rem; /* Slightly smaller */
    font-weight: bold;
    color: #dc3545;
    margin: 0.8rem 0;
    padding: 0.8rem;
    background-color: #fdfdfe;
    border: 1px dashed #ccc;
    border-radius: 4px;
    word-wrap: break-word; /* Handle long words */
  }

  .voting-options {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column; /* Stack buttons vertically */
      align-items: center; /* Center buttons */
      gap: 0.75rem; /* Space between buttons */
  }

  .vote-button {
      background-color: #007bff;
      width: 80%; /* Make vote buttons wider */
      max-width: 300px; /* Max width for larger screens */
      padding: 1rem;
      font-size: 1.1rem;
  }
  .vote-button:hover:not(:disabled) {
       background-color: #0056b3;
  }
  .vote-button:disabled {
       background-color: #6c757d; /* Grey out self-vote */
       border-color: #6c757d;
       color: #eee;
  }

  .info-box {
      border: 1px solid; /* Defined by specific types */
      padding: 1rem;
      border-radius: 5px;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
  }

  .tie-message {
      background-color: #fff3cd; /* Light yellow */
      border-color: #ffeeba;
      color: #856404; /* Dark yellow */
      font-weight: bold;
  }

  .elimination-box {
       background-color: #f8d7da; /* Light red */
       border-color: #f5c6cb;
       color: #721c24; /* Dark red */
  }


  .elimination-result {
      font-size: 1.1rem;
      font-weight: normal;
      margin-bottom: 0.5rem;
  }

  .results-list {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
    text-align: left;
    max-width: 380px; /* Allow slightly wider */
    margin-left: auto;
    margin-right: auto;
  }
  .results-list li {
    background-color: #fff;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 0.95rem;
  }
  .results-list li span { /* Target the main span inside li */
      display: block; /* Ensure tags wrap nicely if needed */
  }

  .undercover-player { font-weight: bold; color: #dc3545; } /* Red for undercover */

  .eliminated-tag {
      font-style: italic;
      color: #6c757d; /* Grey color for the tag */
      margin-left: 0.5em;
      font-size: 0.9em;
  }

  .undercover-wins { color: #dc3545; /* Red */ }
  .civilians-win { color: #28a745; /* Green */ }

  .error-message {
      color: #721c24; /* Dark red */
      background-color: #f8d7da; /* Light red */
      border: 1px solid #f5c6cb; /* Red border */
      padding: 1rem;
      border-radius: 5px;
      margin-top: 1rem;
  }

  </style>