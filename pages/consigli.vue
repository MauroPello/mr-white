<script setup lang="ts">
import {
  companyName,
  companyUrl,
  companyLogo,
  companySEOTitle,
  companySEODescription,
} from "~/constants/company";

const consigliSEOTitle = `Consigli e Strategie - ${companyName}`;
const consigliSEODescription = `Diventa un maestro di ${companyName}! Scopri strategie avanzate e consigli divertenti per dominare il gioco, che tu sia Civile, Undercover o il misterioso Mr. White.`;
const consigliPageUrl = `${companyUrl}/consigli`;

const articleBodyContent = `
  L'Arte del Sospetto: Consigli per Tutti i Giocatori
  - L'ascolto è il tuo superpotere: Non distrarti! Le parole degli altri sono un tesoro di indizi. Un'esitazione, una parola troppo strana... tutto può smascherare un impostore.
  - Il tempo è tuo nemico (o alleato): Rispondi con naturalezza. Se ci metti troppo, sembrerai sospetto. Se sei troppo veloce, potresti tradirti.
  - Diventa un lettore di menti (o quasi): Le parole non sono tutto. Un'occhiata nervosa, un sorriso tirato... impara a leggere il linguaggio del corpo.
  - Divertiti! L'obiettivo è passare una bella serata. Una risata può essere la migliore delle strategie.

  La Via del Civile: Diventa un Detective Infallibile
  - L'indizio perfetto: Né troppo ovvio, né troppo oscuro. Se la parola è "Pizza", "Margherita" è un indizio da manuale. "Cibo" è da principianti e ti farà accusare!
  - Varia il tuo gioco: Non usare solo sinonimi. Pensa a luoghi, azioni o sensazioni collegate alla parola. Spiazzerai gli impostori.
  - Tendi una trappola: Sospetti di qualcuno? Lancia un indizio leggermente ambiguo e osserva la sua reazione. Potrebbe cadere dritto nel tuo tranello.
  - Accusa con stile (e prove): Non puntare il dito a caso. "Ti accuso perché il tuo indizio 'tonda' è sospetto!" è molto più efficace di un "Sei tu!".

  Il Manuale del Bluff: Strategie per Undercover e Mr. White
  - L'arte della mimetizzazione: All'inizio, stai zitto e ascolta. Cerca di capire il tema generale e poi lancia un indizio vago che possa funzionare.
  - Il pappagallo intelligente: Ripetere un indizio altrui può salvarti, ma non abusarne. Prova a rielaborarlo con parole tue per sembrare più credibile.
  - Sicurezza, anche nel panico: Anche se non hai idea di quale sia la parola, mostrati sicuro. Un'espressione serena è la tua migliore maschera.
  - Attacca per difenderti: Se l'attenzione è su di te, sposta i riflettori. Accusa qualcun altro con decisione, magari sfruttando una sua piccola esitazione.
  - Il voto strategico: Osserva chi vota per chi. Unisciti alla maggioranza per non destare sospetti, o prova a salvare un altro impostore se ti senti audace.
  - L'ultima spiaggia di Mr. White: Ti hanno scoperto? Niente panico. Hai un'ultima, gloriosa possibilità. Ripensa a tutti gli indizi e spara la tua ipotesi. La vittoria ha un sapore migliore quando è inaspettata!
`;

useHead({
  title: consigliSEOTitle,
  meta: [
    { name: "description", content: consigliSEODescription },
    {
      name: "keywords",
      content: `consigli ${companyName}, strategie ${companyName}, come vincere ${companyName}, trucchi ${companyName}, guida ${companyName}, undercover, mr white, gioco società, gioco bluff, strategie avanzate`,
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
            articleBody: articleBodyContent,
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
  <div class="min-h-screen">
    <UContainer class="py-12">
      <div class="prose dark:prose-invert mx-auto">
        <h1>Consigli e Strategie Avanzate</h1>
        <p class="lead !text-xl !mb-8">
          {{ consigliSEODescription }}
        </p>

        <UAlert
          icon="i-heroicons-book-open"
          color="primary"
          variant="subtle"
          title="Non conosci le regole del gioco?"
          description="Prima di tuffarti nelle strategie, assicurati di conoscere le basi. Leggi le regole complete per non perderti neanche un dettaglio!"
          :actions="[{ label: 'Vai alle Regole', to: '/regole', variant: 'link', color: 'primary', size: 'lg' }]"
          class="not-prose mb-12"
          :ui="{ description: 'text-base', title: 'text-lg font-medium', icon: { base: 'size-6' } }"
        />

        <h2>L'Arte del Sospetto: Consigli per Tutti i Giocatori</h2>
        <ul>
          <li>
            <strong>L'ascolto è il tuo superpotere:</strong> Non distrarti! Le
            parole degli altri sono un tesoro di indizi. Un'esitazione, una
            parola troppo strana... tutto può smascherare un impostore.
          </li>
          <li>
            <strong>Il tempo è tuo nemico (o alleato):</strong> Rispondi con
            naturalezza. Se ci metti troppo, sembrerai sospetto. Se sei troppo
            veloce, potresti tradirti.
          </li>
          <li>
            <strong>Diventa un lettore di menti (o quasi):</strong> Le parole
            non sono tutto. Un'occhiata nervosa, un sorriso tirato... impara a
            leggere il linguaggio del corpo.
          </li>
          <li>
            <strong>Divertiti!</strong> L'obiettivo è passare una bella serata.
            Una risata può essere la migliore delle strategie.
          </li>
        </ul>

        <h2>La Via del Civile: Diventa un Detective Infallibile</h2>
        <p>
          Il tuo obiettivo è semplice: scoprire chi mente e convincere gli altri
          della tua lealtà.
        </p>
        <ul>
          <li>
            <strong>L'indizio perfetto:</strong> Né troppo ovvio, né troppo
            oscuro. Se la parola è "Pizza", "Margherita" è un indizio da
            manuale. "Cibo" è da principianti e ti farà accusare!
          </li>
          <li>
            <strong>Varia il tuo gioco:</strong> Non usare solo sinonimi. Pensa
            a luoghi, azioni o sensazioni collegate alla parola. Spiazzerai gli
            impostori.
          </li>
          <li>
            <strong>Tendi una trappola:</strong> Sospetti di qualcuno? Lancia
            un indizio leggermente ambiguo e osserva la sua reazione. Potrebbe
            cadere dritto nel tuo tranello.
          </li>
          <li>
            <strong>Accusa con stile (e prove):</strong> Non puntare il dito a
            caso. "Ti accuso perché il tuo indizio 'tonda' è sospetto!" è molto
            più efficace di un "Sei tu!".
          </li>
        </ul>

        <h2>Il Manuale del Bluff: Strategie per Undercover e Mr. White</h2>
        <p>
          La tua missione è bluffare, confondere gli altri e, se sei Mr. White,
          indovinare la parola segreta per la vittoria finale.
        </p>
        <ul>
          <li>
            <strong>L'arte della mimetizzazione:</strong> All'inizio, stai
            zitto e ascolta. Cerca di capire il tema generale e poi lancia un
            indizio vago che possa funzionare.
          </li>
          <li>
            <strong>Il pappagallo intelligente:</strong> Ripetere un indizio
            altrui può salvarti, ma non abusarne. Prova a rielaborarlo con
            parole tue per sembrare più credibile.
          </li>
          <li>
            <strong>Sicurezza, anche nel panico:</strong> Anche se non hai idea
            di quale sia la parola, mostrati sicuro. Un'espressione serena è la
            tua migliore maschera.
          </li>
          <li>
            <strong>Attacca per difenderti:</strong> Se l'attenzione è su di te,
            sposta i riflettori. Accusa qualcun altro con decisione, magari
            sfruttando una sua piccola esitazione.
          </li>
          <li>
            <strong>Il voto strategico:</strong> Osserva chi vota per chi.
            Unisciti alla maggioranza per non destare sospetti, o prova a
            salvare un altro impostore se ti senti audace.
          </li>
          <li>
            <strong>L'ultima spiaggia di Mr. White:</strong> Ti hanno scoperto?
            Niente panico. Hai un'ultima, gloriosa possibilità. Ripensa a tutti
            gli indizi e spara la tua ipotesi. La vittoria ha un sapore migliore
            quando è inaspettata!
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
            to="/#gioca"
          >
            Gioca Ora
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
