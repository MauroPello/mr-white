<script setup lang="ts">
import { companyName, companyMainStructuredData } from "~/constants/company";

useHead({
  ...companyMainStructuredData,
  title: `Regole del Gioco - ${companyName}`,
  meta: [
    {
      name: "description",
      content: `Impara le regole ufficiali di ${companyName}. Una guida completa su come si gioca, i ruoli (Civile, Undercover, Mr. White) e le condizioni di vittoria.`,
    },
  ],
});
</script>

<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="prose dark:prose-invert mx-auto">
        <h1>Regole del Gioco</h1>

        <h2>Sul Gioco</h2>
        <p>
          {{ companyName }} è un gioco di società basato su bluff e deduzione,
          perfetto per animare qualsiasi festa o serata in compagnia. Si gioca
          con un solo telefono e l'obiettivo è scoprire i ruoli segreti degli
          altri giocatori. Ogni giocatore riceve una parola segreta, tranne gli
          Undercover (che ne ricevono una simile ma non identica) e Mr. White
          (che non ne riceve nessuna). Il divertimento sta nel dare indizi
          intelligenti per dimostrare di essere un Civile, senza però rivelare
          la parola segreta a Mr. White!
        </p>

        <h2>Come si Gioca</h2>
        <p>
          Giocare a {{ companyName }} è semplice. Ecco i passaggi fondamentali:
        </p>
        <ol>
          <li>
            <strong>Preparazione della Partita:</strong> Il primo giocatore (il
            "master") imposta la partita scegliendo il numero totale di
            giocatori, il numero di Undercover e il numero di Mr. White.
          </li>
          <li>
            <strong>Distribuzione dei Ruoli:</strong> A turno, ogni giocatore
            passa il telefono al successivo per scoprire segretamente il proprio
            ruolo e la parola associata. I ruoli possibili sono:
            <ul>
              <li>
                <strong>Civile:</strong> Riceve la parola segreta principale.
                L'obiettivo è eliminare tutti gli Undercover e i Mr. White.
              </li>
              <li>
                <strong>Undercover:</strong> Riceve una parola leggermente
                diversa da quella dei Civili. L'obiettivo è confondersi con i
                Civili e sopravvivere fino alla fine.
              </li>
              <li>
                <strong>Mr. White:</strong> Non riceve alcuna parola.
                L'obiettivo è non farsi scoprire e, se accusato, indovinare la
                parola segreta dei Civili per vincere.
              </li>
            </ul>
          </li>
          <li>
            <strong>Il Giro di Indizi:</strong> A partire dal primo giocatore,
            ognuno dice una singola parola come indizio. L'indizio deve essere
            abbastanza specifico da dimostrare di conoscere la parola, ma non
            troppo ovvio da svelarla a Mr. White.
          </li>
          <li>
            <strong>La Votazione:</strong> Dopo che tutti hanno dato il proprio
            indizio, si apre una discussione per decidere chi eliminare. I
            giocatori votano per la persona che ritengono sia un Undercover o
            Mr. White. La persona con più voti viene eliminata. In caso di
            pareggio, si procede con un nuovo giro di discussione prima di una
            nuova votazione.
          </li>
          <li>
            <strong>Eliminazione e Indovinello di Mr. White:</strong> La persona
            eliminata rivela il suo ruolo.
            <ul>
              <li>
                Se l'eliminato è un <strong>Civile</strong> o un
                <strong>Undercover</strong>, il gioco continua con un nuovo
                round (se le condizioni di vittoria non sono state ancora
                raggiunte).
              </li>
              <li>
                Se l'eliminato è <strong>Mr. White</strong>, ha un'ultima
                possibilità: deve provare a indovinare la parola segreta dei
                Civili. Se indovina, vince. Altrimenti, viene eliminato e il
                gioco continua.
              </li>
            </ul>
          </li>
          <li>
            <strong>Condizioni di Vittoria:</strong>
            <ul>
              <li>
                I <strong>Civili</strong> vincono se eliminano con successo
                tutti gli Undercover e tutti i Mr. White.
              </li>
              <li>
                Gli <strong>Undercover</strong> vincono se ne sopravvive almeno
                uno fino alla fine del gioco.
              </li>
              <li>
                <strong>Mr. White</strong> vince se sopravvive fino alla fine
                (quando rimangono solo lui e un altro giocatore) o se, una volta
                eliminato, indovina la parola segreta dei Civili.
              </li>
              <li>
                Gli <strong>Undercover e Mr. White</strong> possono vincere
                insieme se i Civili vengono eliminati e loro rimangono in gioco.
              </li>
            </ul>
          </li>
        </ol>

        <hr >

        <div class="text-center mt-12 not-prose">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Vuoi dei Consigli?
          </h2>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Perfeziona le tue abilità di bluff e deduzione.
            <UButton to="/consigli" variant="link" :padded="false" class="text-lg"
              >Leggi i nostri consigli e strategie</UButton
            >
            per diventare un maestro del gioco!
          </p>
        </div>

        <hr class="my-12">

        <div class="text-center mt-12">
          <p class="text-lg">
            Ora che conosci le regole, sei pronto a giocare!
          </p>
          <UButton icon="i-heroicons-play-circle" size="lg" to="/#gioca">
            Gioca Ora
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
