<script setup lang="ts">
import {
  companyName,
  companyUrl,
  companyLogo,
  companySEOTitle,
  companySEODescription,
} from "~/constants/company";

const consigliSEOTitle = `Diventa un Campione di ${companyName}: Consigli e Strategie`;
const consigliSEODescription = `Vuoi vincere a ${companyName}? Scopri i nostri consigli per smascherare gli avversari e dominare il gioco, che tu sia Civile, Undercover o Mr. White!`;
const consigliPageUrl = `${companyUrl}/consigli`;

useHead({
  title: consigliSEOTitle,
  meta: [
    { name: "description", content: consigliSEODescription },
    {
      name: "keywords",
      content: `consigli ${companyName}, strategie ${companyName}, come vincere ${companyName}, trucchi ${companyName}, guida ${companyName}, undercover, mr white, gioco società, gioco bluff`,
    },
    { property: "og:title", content: consigliSEOTitle },
    { property: "og:description", content: consigliSEODescription },
    { property: "og:type", content: "article" },
    { property: "og:url", content: consigliPageUrl },
    { property: "og:image", content: companyLogo },
    { property: "og:image:width", content: "900" },
    { property: "og:image:height", content: "900" },
    { property: "og:locale", content: "it_IT" },
    { property: "article:published_time", content: new Date().toISOString() },
    { property: "article:author", content: companyName },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: consigliSEOTitle },
    { name: "twitter:description", content: consigliSEODescription },
    { name: "twitter:image", content: companyLogo },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${consigliPageUrl}#webpage`,
            url: consigliPageUrl,
            name: consigliSEOTitle,
            description: consigliSEODescription,
            isPartOf: { "@id": `${companyUrl}#website` },
            about: { "@id": `${companyUrl}#game` },
            inLanguage: "it-IT",
            mainEntity: { "@id": `${consigliPageUrl}#article` },
          },
          {
            "@type": "Article",
            "@id": `${consigliPageUrl}#article`,
            headline: `Consigli per Vincere a ${companyName}`,
            description: consigliSEODescription,
            url: consigliPageUrl,
            image: companyLogo,
            author: {
              "@type": "Organization",
              name: companyName,
              url: companyUrl,
            },
            publisher: {
              "@type": "Organization",
              name: companyName,
              logo: {
                "@type": "ImageObject",
                url: companyLogo,
                width: 900,
                height: 900,
              },
            },
            datePublished: new Date().toISOString(),
            mainEntityOfPage: { "@id": `${consigliPageUrl}#webpage` },
            articleBody: `
              Consigli per tutti:
              - Ascolta con attenzione: Le parole degli altri sono indizi preziosi. Fai caso a esitazioni, parole strane o temi ricorrenti per capire chi bluffa.
              - Pensa in fretta: Non metterci troppo a dare il tuo indizio, potresti sembrare sospetto. La rapidità è un'arma!
              - Leggi le espressioni: Un'occhiata nervosa o un sorriso troppo sicuro possono svelare molto più delle parole. Diventa un detective delle emozioni!

              Sei un Civile? Ecco come vincere:
              - Indizi intelligenti: Dai un indizio chiaro ma non scontato. Se la parola è "Spiaggia", "Sabbia" è un buon indizio, "Mare" potrebbe essere troppo generico.
              - Varia i tuoi indizi: Non limitarti a sinonimi. Pensa a oggetti, azioni o luoghi collegati alla parola per mettere in difficoltà chi non la conosce.
              - Tendi una trappola: Se hai un sospetto, dai un indizio un po' più ambiguo e osserva la reazione. Potrebbe cadere nel tuo tranello!
              - Accusa con prove: Non puntare il dito a caso. Basa le tue accuse su indizi concreti, come una parola fuori luogo o un'esitazione di troppo.

              Sei un Undercover o Mr. White? Sopravvivi e vinci:
              - Mimetizzati: All'inizio, ascolta gli altri per capire il tema generale. Usa parole generiche che possano andare bene per più argomenti.
              - Fai il pappagallo (con astuzia): Ripeti o adatta le parole degli altri per sembrare credibile, ma non esagerare o desterai sospetti.
              - Mostrati sicuro: Anche se brancoli nel buio, annuisci e sorridi. La sicurezza è la tua migliore maschera.
              - Crea scompiglio: L'attenzione è su di te? Accusa qualcun altro con decisione, magari sottolineando una sua piccola incertezza.
              - Vota per ultimo: Osserva le scelte degli altri prima di votare. Ti aiuterà a capire chi sospetta di chi e a chi conviene eliminare.
              - Prepara il colpo di scena: Se ti scoprono, non è finita! Ripensa a tutti gli indizi e preparati a indovinare la parola segreta. La vittoria potrebbe essere ancora tua.
            `,
          },
          {
            "@type": "WebApplication",
            "@id": `${companyUrl}#website`,
            name: companySEOTitle,
            description: companySEODescription,
            url: companyUrl,
            applicationCategory: "GameApplication",
            operatingSystem: "Web Browser",
            browserRequirements: "Requires JavaScript",
            inLanguage: "it-IT",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            subjectOf: { "@id": `${companyUrl}#game` },
          },
          {
            "@type": "Game",
            "@id": `${companyUrl}#game`,
            name: companyName,
            description:
              "Un party game di bluff in cui i giocatori ricevono una parola segreta, tranne uno (o più) 'infiltrati' che ne ricevono una simile ma diversa. L'obiettivo è scoprire gli infiltrati (o sopravvivere come infiltrato) descrivendo la propria parola senza essere troppo ovvi.",
            url: companyUrl,
            inLanguage: "it-IT",
            genre: [
              "Party game",
              "Word game",
              "Bluffing game",
              "Gioco di società",
            ],
            keywords:
              "undercover, infiltrato, mr white, gioco parole, gioco bluff, party game, gioco società, un telefono",
            numberOfPlayers: {
              "@type": "QuantitativeValue",
              minValue: 3,
            },
            playMode: "MultiPlayer",
            gamePlatform: "Browser",
          },
        ],
      }),
    },
  ],
});
</script>

<template>
  <UContainer class="py-12">
    <div class="prose dark:prose-invert max-w-none">
      <h1>{{ consigliSEOTitle }}</h1>
      <p class="lead">{{ consigliSEODescription }}</p>

      <hr >

      <h2>Consigli per Tutti</h2>
      <ul>
        <li>
          <strong>Ascolta con attenzione:</strong> Le parole degli altri sono
          indizi preziosi. Fai caso a esitazioni, parole strane o temi
          ricorrenti per capire chi bluffa.
        </li>
        <li>
          <strong>Pensa in fretta:</strong> Non metterci troppo a dare il tuo
          indizio, potresti sembrare sospetto. La rapidità è un'arma!
        </li>
        <li>
          <strong>Leggi le espressioni:</strong> Un'occhiata nervosa o un
          sorriso troppo sicuro possono svelare molto più delle parole. Diventa
          un detective delle emozioni!
        </li>
      </ul>

      <h2>Sei un Civile? Ecco come vincere:</h2>
      <p>
        Il tuo obiettivo è semplice: scoprire chi mente e convincere gli altri
        della tua lealtà.
      </p>
      <ul>
        <li>
          <strong>Indizi intelligenti:</strong> Dai un indizio chiaro ma non
          scontato. Se la parola è "Spiaggia", "Sabbia" è un buon indizio, "Mare"
          potrebbe essere troppo generico.
        </li>
        <li>
          <strong>Varia i tuoi indizi:</strong> Non limitarti a sinonimi. Pensa
          a oggetti, azioni o luoghi collegati alla parola per mettere in
          difficoltà chi non la conosce.
        </li>
        <li>
          <strong>Tendi una trappola:</strong> Se hai un sospetto, dai un
          indizio un po' più ambiguo e osserva la reazione. Potrebbe cadere nel
          tuo tranello!
        </li>
        <li>
          <strong>Accusa con prove:</strong> Non puntare il dito a caso. Basa le
          tue accuse su indizi concreti, come una parola fuori luogo o
          un'esitazione di troppo.
        </li>
      </ul>

      <h2>Sei un Undercover o Mr. White? Sopravvivi e vinci:</h2>
      <p>
        La tua missione è bluffare, confondere gli altri e, se sei Mr. White,
        indovinare la parola segreta per la vittoria finale.
      </p>
      <ul>
        <li>
          <strong>Mimetizzati:</strong> All'inizio, ascolta gli altri per capire
          il tema generale. Usa parole generiche che possano andare bene per più
          argomenti.
        </li>
        <li>
          <strong>Fai il pappagallo (con astuzia):</strong> Ripeti o adatta le
          parole degli altri per sembrare credibile, ma non esagerare o desterai
          sospetti.
        </li>
        <li>
          <strong>Mostrati sicuro:</strong> Anche se brancoli nel buio,
          annuisci e sorridi. La sicurezza è la tua migliore maschera.
        </li>
        <li>
          <strong>Crea scompiglio:</strong> L'attenzione è su di te? Accusa
          qualcun altro con decisione, magari sottolineando una sua piccola
          incertezza.
        </li>
        <li>
          <strong>Vota per ultimo:</strong> Osserva le scelte degli altri prima
          di votare. Ti aiuterà a capire chi sospetta di chi e a chi conviene
          eliminare.
        </li>
        <li>
          <strong>Prepara il colpo di scena:</strong> Se ti scoprono, non è
          finita! Ripensa a tutti gli indizi e preparati a indovinare la parola
          segreta. La vittoria potrebbe essere ancora tua.
        </li>
      </ul>

      <hr >

      <div class="text-center mt-12">
        <p class="text-lg">
          Ora che hai le strategie giuste, sei pronto a giocare da campione!
        </p>
        <UButton
          icon="i-heroicons-play-circle"
          size="lg"
          @click="navigateTo('/#gioca')"
        >
          Gioca Ora
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
