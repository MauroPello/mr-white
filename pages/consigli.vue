<script setup lang="ts">
import { companyName, companyUrl, companyLogo } from '~/constants/company';

// --- SEO Meta ---
const consigliSEOTitle = `Consigli e Strategie per Vincere a ${companyName}`;
const consigliSEODescription = `Scopri i migliori consigli e strategie per dominare a ${companyName}, sia come Civile che come Mr. White. Impara a bluffare e a scoprire l'infiltrato!`;
const consigliPageUrl = `${companyUrl}/consigli`;

useHead({
  title: consigliSEOTitle,
  meta: [
    { name: 'description', content: consigliSEODescription },
    { name: 'keywords', content: `consigli ${companyName}, strategie ${companyName}, come vincere ${companyName}, trucchi ${companyName}, guida ${companyName}, undercover, mr white, gioco società, gioco bluff` },
    // Open Graph
    { property: 'og:title', content: consigliSEOTitle },
    { property: 'og:description', content: consigliSEODescription },
    { property: 'og:type', content: 'article' }, // Article type for tips page
    { property: 'og:url', content: consigliPageUrl },
    { property: 'og:image', content: companyLogo },
    { property: 'og:image:width', content: '900' },
    { property: 'og:image:height', content: '900' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'article:published_time', content: new Date().toISOString() }, // Add published time
    { property: 'article:author', content: companyName }, // Optional: Author
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: consigliSEOTitle },
    { name: 'twitter:description', content: consigliSEODescription },
    { name: 'twitter:image', content: companyLogo },
  ],
  link: [
    { rel: 'canonical', href: consigliPageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          // WebPage Schema for this specific page
          {
            "@type": "WebPage",
            "@id": `${consigliPageUrl}#webpage`,
            "url": consigliPageUrl,
            "name": consigliSEOTitle,
            "description": consigliSEODescription,
            "isPartOf": { "@id": `${companyUrl}#website` }, // Assumes a WebSite object exists at the root URL ID
            "about": { "@id": `${companyUrl}#game` }, // Links to the Game defined on the index page
            "inLanguage": "it-IT",
            "mainEntity": { "@id": `${consigliPageUrl}#article` } // Points to the Article schema below
          },
          // Article Schema for the tips content
          {
            "@type": "Article",
            "@id": `${consigliPageUrl}#article`,
            "headline": `Consigli per Vincere a ${companyName}`,
            "description": consigliSEODescription,
            "url": consigliPageUrl,
            "image": companyLogo,
            "author": {
              "@type": "Organization",
              "name": companyName,
              "url": companyUrl
            },
            "publisher": {
              "@type": "Organization",
              "name": companyName,
              "logo": {
                "@type": "ImageObject",
                "url": companyLogo,
                "width": 900,
                "height": 900
              }
            },
            "datePublished": new Date().toISOString(),
            "mainEntityOfPage": { "@id": `${consigliPageUrl}#webpage` },
            "articleBody": `
              Consigli Generali:
              - Ascolta attentamente: Le parole degli altri sono indizi cruciali.
              - Non essere troppo ovvio: Se sei un Civile, non dare indizi troppo diretti che solo Mr. White non capirebbe.
              - Non essere troppo vago: Se sei Mr. White, cerca di mimetizzarti, ma non essere così vago da destare sospetti immediati.

              Consigli per i Civili:
              - Dai indizi specifici ma non rivelatori: Pensa a parole correlate che solo chi conosce la parola segreta può capire appieno.
              - Osserva le reazioni: Chi sembra esitante o confuso dopo un indizio?
              - Varia i tuoi indizi: Non usare sempre lo stesso tipo di associazione.

              Consigli per Mr. White:
              - Fai finta di capire: Annuisci, mostra sicurezza anche se non hai idea di cosa si stia parlando.
              - Usa parole generiche all'inizio: Cerca di capire l'argomento generale dalle parole degli altri.
              - Ruba gli indizi: Se un Civile dice una parola, prova a usarne una simile o correlata nel tuo turno.
              - Semina zizzania: Se hai un sospetto su chi potrebbe essere un altro Mr. White (se ce n'è più di uno), o se vuoi deviare l'attenzione, accusa qualcun altro con finta sicurezza.
              - Preparati alla domanda finale: Se vieni scoperto, pensa velocemente a quale potrebbe essere la parola segreta basandoti sugli indizi che hai sentito.
            ` // Placeholder text, replace with actual tips
          },
          // Reference the main WebApplication (optional but good for context)
          // Ensure the @id matches the one used in index.vue
          {
            "@type": "WebApplication",
            "@id": `${companyUrl}#webapp`, // Assuming this ID is used on index.vue for the WebApplication
            "name": companyName,
            "url": companyUrl
            // Add other relevant properties if needed, mirroring index.vue's WebApplication
          },
           // Reference the main Game (optional but good for context)
           // Ensure the @id matches the one used in index.vue
          {
            "@type": "Game",
            "@id": `${companyUrl}#game`, // Assuming this ID is used on index.vue for the Game
            "name": companyName,
            "url": companyUrl
             // Add other relevant properties if needed, mirroring index.vue's Game
          }
        ]
      }),
    }
  ]
});

const router = useRouter();

const play = async () => {
  await router.push('/#gioca');
  router.go(0);
};
</script>

<template>
  <UContainer class="py-12">
    <div class="prose dark:prose-invert max-w-none"> <!-- Using prose for nice article formatting -->
      <h1>{{ consigliSEOTitle }}</h1>
      <p class="lead">{{ consigliSEODescription }}</p>

      <hr >

      <h2>Consigli Generali</h2>
      <ul>
        <li><strong>Ascolta attentamente:</strong> Le parole dette dagli altri giocatori sono la tua fonte principale di informazioni, sia che tu sia un Civile o l'infiltrato Mr. White. Cerca pattern, esitazioni o parole fuori contesto.</li>
        <li><strong>Gestisci il tempo:</strong> Non prendere troppo tempo per pensare alla tua parola, potrebbe insospettire gli altri.</li>
        <li><strong>Osserva il linguaggio del corpo:</strong> A volte, il nervosismo o la troppa sicurezza possono tradire un giocatore.</li>
      </ul>

      <h2>Consigli per i Civili</h2>
      <p>Il tuo obiettivo è duplice: identificare l'infiltrato Mr. White e dimostrare la tua innocenza.</p>
      <ul>
        <li><strong>Sii specifico, ma non troppo:</strong> La tua parola deve essere chiaramente collegata alla parola segreta, ma non così ovvia da renderla facile da indovinare per l'infiltrato Mr. White se dovesse essere scoperto. Esempio: se la parola è "Spiaggia", "Castello di sabbia" è meglio di "Mare".</li>
        <li><strong>Varia gli indizi:</strong> Non dare solo sinonimi o parole della stessa categoria. Pensa ad azioni, luoghi associati, caratteristiche.</li>
        <li><strong>Metti alla prova i sospettati:</strong> Se sospetti di qualcuno, prova a dare un indizio leggermente più difficile o ambiguo per vedere come reagisce.</li>
        <li><strong>Non accusare a caso:</strong> Basa i tuoi sospetti su prove concrete (parole strane, esitazioni).</li>
      </ul>

      <h2>Consigli per l'infiltrato Mr. White</h2>
      <p>Il tuo obiettivo è sopravvivere senza farti scoprire e, se possibile, indovinare la parola segreta.</p>
      <ul>
        <li><strong>Mimetizzati:</strong> Ascolta le prime parole dette dai Civili per capire l'argomento generale. Usa parole generiche o che potrebbero adattarsi a più contesti all'inizio.</li>
        <li><strong>Sii un pappagallo (con moderazione):</strong> Ripeti o riformula leggermente le parole dette da altri giocatori per sembrare informato. Non farlo troppo spesso o sembrerai sospetto.</li>
        <li><strong>Fai finta di capire:</strong> Annuisci, sorridi, mostra sicurezza anche quando non hai la minima idea di cosa stiano parlando.</li>
        <li><strong>Semina il dubbio:</strong> Se l'attenzione si sta concentrando su di te, prova a deviarla accusando qualcun altro con convinzione. Fai notare una sua presunta esitazione o una parola "strana".</li>
        <li><strong>Non essere il primo a votare:</strong> Aspetta di vedere come votano gli altri per capire meglio le dinamiche e chi sospetta di chi.</li>
        <li><strong>Preparati all'ultima sfida:</strong> Se vieni scoperto, ripassa mentalmente tutte le parole dette. Qual è il tema comune? Quale parola potrebbe collegarle tutte? Avere un'idea pronta aumenta le tue chance di vittoria.</li>
      </ul>

      <hr >

      <div class="text-center mt-12">
        <p>Ora che conosci i trucchi, mettili in pratica!</p>
        <UButton icon="i-heroicons-play-circle" size="lg" @click="play">
          Torna al Gioco
        </UButton>
      </div>
    </div>
  </UContainer>
</template>