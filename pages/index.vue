<script setup lang="ts">
import { companyLogo, companySEODescription, companySEOTitle, companyUrl } from '~/constants/company';

useHead({
  title: companySEOTitle,
  meta: [
    { name: 'description', content: companySEODescription },
    { name: 'keywords', content: "l'infiltrato, infiltrato, mr white, gioco società, gioco di gruppo, party game, gioco parole, gioco bluff, undercover game, giocare online, un telefono, italiano" },
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
            "name": "L'Infiltrato / Mr. White - Gioco Online",
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
            "name": "L'Infiltrato (Mr. White / Undercover)",
            "description": "Un party game di bluff in cui i giocatori ricevono una parola segreta, tranne uno (o più) 'infiltrati' che ne ricevono una simile ma diversa. L'obiettivo è scoprire gli infiltrati (o sopravvivere come infiltrato) descrivendo la propria parola senza essere troppo ovvi.",
            "url": companyUrl,
            "inLanguage": "it-IT",
            "genre": ["Party game", "Word game", "Bluffing game", "Gioco di società"],
            "keywords": "l'infiltrato, infiltrato, mr white, undercover, gioco parole, gioco bluff, party game, gioco società, un telefono",
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
</script>

<template>
  <div>
      <div>
      <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
        L'Infiltrato
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-300 mb-8">
        Il gioco di bluff e parole nascoste, con un solo telefono!
      </p>
    </div>
    <div id="gioca">
      <StartGame />
    </div>
</div>
</template>