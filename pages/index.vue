<script setup lang="ts">
import { companyLogo, companyName, companySEODescription, companySEOTitle, companyUrl } from '~/constants/company';
import { loadGameStateFromLocalStorage } from '~/utils/gameStateStorage';

useHead({
  title: companySEOTitle,
  meta: [
    { name: 'description', content: companySEODescription },
    { name: 'keywords', content: "undercover, mr white, mr white gioco, gioco società, gioco di gruppo, party game, gioco parole, gioco bluff, undercover game, giocare online, un telefono, italiano" },
    { property: 'og:title', content: companySEOTitle },
    { property: 'og:description', content: companySEODescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: companyUrl },
    { property: 'og:image', content: companyLogo },
    { property: 'og:image:width', content: '900' },
    { property: 'og:image:height', content: '900' },
    { property: 'og:locale', content: 'it_IT' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: companySEOTitle },
    { name: 'twitter:description', content: companySEODescription },
    { name: 'twitter:image', content: companyLogo },
  ],
  link: [
    { rel: 'canonical', href: companyUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "name": companySEOTitle,
            "description": companySEODescription,
            "url": companyUrl,
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web Browser",
            "browserRequirements": "Requires JavaScript",
            "inLanguage": "it-IT",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "subjectOf": { "@id": `${companyUrl}#game` }
          },
          {
            "@type": "Game",
            "@id": `${companyUrl}#game`,
            "name": companyName,
            "description": "Un party game di bluff in cui i giocatori ricevono una parola segreta, tranne uno (o più) 'infiltrati' che ne ricevono una simile ma diversa. L'obiettivo è scoprire gli infiltrati (o sopravvivere come infiltrato) descrivendo la propria parola senza essere troppo ovvi.",
            "url": companyUrl,
            "inLanguage": "it-IT",
            "genre": ["Party game", "Word game", "Bluffing game", "Gioco di società"],
            "keywords": "undercover, infiltrato, mr white, gioco parole, gioco bluff, party game, gioco società, un telefono",
            "numberOfPlayers": {
              "@type": "QuantitativeValue",
              "minValue": 3
            },
            "playMode": "MultiPlayer",
            "gamePlatform": "Browser"
          }
        ]
      }),
    }
  ]
});

const router = useRouter();

onMounted(() => {
  if (loadGameStateFromLocalStorage()) {
    router.push('/#gioca');
  }
});
</script>

<template>
  <UContainer class="py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-4">
        {{ companyName }}
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        Il gioco di società dove tutti conoscono la parola segreta... tranne Mr. White! Scopri l'infiltrato o confondi gli altri giocatori in questo divertente party game di bluff. Si gioca tutti con un solo telefono!
      </p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
        <UButton icon="i-heroicons-play-circle" size="xl" to="/#gioca">
          Inizia a Giocare
        </UButton>
        <UButton to="/consigli" variant="ghost" icon="i-heroicons-book-open" size="xl" color="gray">
          Leggi i Consigli <span aria-hidden="true">→</span>
        </UButton>
      </div>
    </div>

    <!-- How to Play Section -->
    <div class="py-16">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-2">
        Come si Gioca?
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
        Bastano pochi semplici passi per iniziare il divertimento:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div class="flex flex-col items-center text-center">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-4xl text-primary mb-3" />
          <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">1. Configura</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Scegli il numero di giocatori, quanti Mr. White ci saranno e la lingua delle parole.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <UIcon name="i-heroicons-device-phone-mobile" class="text-4xl text-primary mb-3" />
          <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">2. Passa il Telefono</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ogni giocatore scopre segretamente la propria parola (o vede che è Mr. White).</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="text-4xl text-primary mb-3" />
          <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">3. Descrivi</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">A turno, ogni giocatore dice una parola collegata alla parola segreta per dimostrare di non essere Mr. White.</p>
        </div>
         <div class="flex flex-col items-center text-center">
          <UIcon name="i-heroicons-check-badge" class="text-4xl text-primary mb-3" />
          <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">4. Vota!</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Discutete e votate chi pensate sia Mr. White. Si continua a votare finché tutti i Mr. White o tutti i civili sono eliminati.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <UIcon name="i-heroicons-puzzle-piece" class="text-4xl text-primary mb-3" />
          <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">5. La Sfida di Mr. White</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Se Mr. White viene scoperto, ha un'ultima possibilità: indovinare la parola segreta dei civili!</p>
        </div>
      </div>
    </div>

    <!-- Why Play Section -->
     <div class="py-16">
       <div class="text-center mb-12">
         <!-- Consider changing this icon if it feels repetitive with the How to Play section -->
         <UIcon name="i-heroicons-squares-plus" class="text-4xl text-primary mb-3" />
         <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
           Perché Giocare a Mr. White?
         </h2>
         <p class="text-lg text-gray-600 dark:text-gray-300">
           Scopri il party game perfetto per mettere alla prova le tue doti di bluff e deduzione. <NuxtLink to='/consigli' class='text-primary font-medium hover:underline'>Leggi i nostri consigli</NuxtLink> per diventare un maestro!
         </p>
       </div>
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div class="flex items-start gap-3">
           <UIcon name="i-heroicons-device-phone-mobile" class="text-2xl text-primary mt-1 flex-shrink-0" />
           <div>
             <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Un Solo Telefono</h3>
             <p class="text-sm text-gray-500 dark:text-gray-400">Non servono app complicate o più dispositivi. Basta un browser e un telefono per giocare ovunque.</p>
           </div>
         </div>
         <div class="flex items-start gap-3">
           <UIcon name="i-heroicons-face-smile" class="text-2xl text-primary mt-1 flex-shrink-0" />
           <div>
             <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Divertimento Assicurato</h3>
             <p class="text-sm text-gray-500 dark:text-gray-400">Risate e sospetti garantiti! Perfetto per rompere il ghiaccio o animare una serata tra amici.</p>
           </div>
         </div>
         <div class="flex items-start gap-3">
           <UIcon name="i-heroicons-bolt" class="text-2xl text-primary mt-1 flex-shrink-0" />
           <div>
             <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Semplice e Veloce</h3>
             <p class="text-sm text-gray-500 dark:text-gray-400">Le regole si imparano in un minuto e una partita dura pochi minuti.</p>
           </div>
         </div>
         <div class="flex items-start gap-3">
           <UIcon name="i-heroicons-currency-euro" class="text-2xl text-primary mt-1 flex-shrink-0" />
           <div>
             <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Completamente Gratuito</h3>
             <p class="text-sm text-gray-500 dark:text-gray-400">Gioca senza limiti e senza costi nascosti.</p>
           </div>
         </div>
       </div>
     </div>

    <!-- Start Game Section -->
    <div id="gioca" class="py-16">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-2">
        Pronto a Giocare?
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
        Configura la tua partita qui sotto e inizia subito a scoprire chi è l'infiltrato!
      </p>
      <StartGame class="max-w-2xl mx-auto" />
    </div>

    <div class="py-16 text-center dark:border-gray-800 mt-16">
      <UIcon name="i-heroicons-gift" class="text-4xl text-primary mb-3" />
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        Ti piace Mr. White? Offrimi un caffè!
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Se ti stai divertendo con {{ companyName }}, puoi supportare il mantenimento e lo sviluppo del gioco offrendomi un caffè virtuale. Ogni contributo, anche piccolo, è molto apprezzato e mi aiuta a mantenere il gioco gratuito per tutti!
      </p>
      <UButton
        icon="i-heroicons-banknotes"
        size="xl"
        to="https://paypal.me/MrWhiteGioco"
        target="_blank"
        rel="noopener noreferrer"
        variant="soft"
        color="primary"
      >
        Supporta con PayPal
      </UButton>
    </div>
  </UContainer>
</template>