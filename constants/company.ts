export const mediaFolder = "/_vercel/image?url=%2F";

export const companyName = "Undercover Mr. White";
export const companyUrl = "https://mrwhite.fun";
export const companySEOTitle = `${companyName} Gioco Online di Parole`;
export const companySEODescription =
  `Scopri chi ha la parola diversa in questo divertente party game di bluff italiano. Gioca ora con i tuoi amici!`;
export const companyLogo = `${companyUrl}${mediaFolder}logo.png&w=1536&q=100`;
export const companyMainStructuredData = {
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
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "@id": `${companyUrl}#website`,
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
};
