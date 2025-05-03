export const mediaFolder = "/_vercel/image?url=%2F";

export const companyName = "Undercover Mr. White";
export const companyUrl = "https://www.undercovergioco.it";
export const companySEOTitle = `${companyName} - Gioco Online di Parole`;
export const companySEODescription = `Scopri chi ha la parola diversa in questo divertente party game di bluff italiano. Gioca ora con i tuoi amici!`;
export const companyLogo = `${companyUrl}${mediaFolder}logo.png&w=1536&q=100`; // This will now use the new companyUrl
export const companyMainStructuredData = {
  title: companySEOTitle,
  meta: [
    // Essential Meta Tags
    { name: "description", content: companySEODescription },
    {
      name: "keywords",
      content: [
        "l'infiltrato",
        "infiltrato",
        "undercover",
        "undercover game", // Added 'undercover' variations
        "mr white",
        "mr. white",
        "mrwhite",
        "mr white gioco",
        "gioco della spia",
        "spia",
        "spia gioco",
        "l'infiltrato gioco",
        "undercover gioco",
        "mr white gioco",
        "gioco della spia gioco",
        // Combinations: {GameName} + Gioco Online
        "l'infiltrato gioco online",
        "undercover gioco online",
        "mr white gioco online",
        "spia gioco online",
        "gioco della spia online",
        // Combinations: {GameName} + Gioco Italiano
        "l'infiltrato gioco italiano",
        "undercover gioco italiano",
        "mr white gioco italiano",
        "spia gioco italiano",
        "gioco della spia italiano",
        // Combinations: {GameName} + Gioco Online Italiano (Variations)
        "l'infiltrato gioco online italiano",
        "undercover gioco online italiano",
        "mr white gioco online italiano",
        "spia gioco online italiano",
        "l'infiltrato gioco italiano online",
        "undercover gioco italiano online",
        "mr white gioco italiano online",
        "spia gioco italiano online",
        // Combinations: {GameName} + Gioco di Parole
        "l'infiltrato gioco di parole",
        "undercover gioco di parole",
        "mr white gioco di parole",
        "spia gioco di parole",
        "gioco della spia parole",
        "l'infiltrato gioco parole",
        "undercover gioco parole",
        "mr white gioco parole",
        "spia gioco parole",
        // Combinations: {GameName} + Gioco Online di Parole
        "l'infiltrato gioco online di parole",
        "undercover gioco online di parole",
        "mr white gioco online di parole",
        "spia gioco online di parole",
        "l'infiltrato gioco online parole",
        "undercover gioco online parole",
        "mr white gioco online parole",
        "spia gioco online parole",
        // Combinations: {GameName} + Gioco Italiano di Parole
        "l'infiltrato gioco italiano di parole",
        "undercover gioco italiano di parole",
        "mr white gioco italiano di parole",
        "spia gioco italiano di parole",
        "l'infiltrato gioco italiano parole",
        "undercover gioco italiano parole",
        "mr white gioco italiano parole",
        "spia gioco italiano parole",
        // Combinations: {GameName} + Gioco Italiano Online di Parole (Variations)
        "l'infiltrato gioco italiano online di parole",
        "undercover gioco italiano online parole",
        "mr white gioco italiano online parole",
        "l'infiltrato gioco online italiano di parole",
        "undercover gioco online italiano parole",
        "mr white gioco online italiano parole",
        // Combinations: {GameName} + Gioco da Tavolo / Società
        "l'infiltrato gioco da tavolo",
        "undercover gioco da tavolo",
        "mr white gioco da tavolo",
        "spia gioco da tavolo",
        "l'infiltrato gioco società",
        "undercover gioco società",
        "mr white gioco società",
        "spia gioco società",
        // Combinations: {GameName} + Gioco Online da Tavolo / Società
        "l'infiltrato gioco online da tavolo",
        "undercover gioco online da tavolo",
        "mr white gioco online da tavolo",
        "spia gioco online società",
        // Combinations: {GameName} + Gioco Italiano da Tavolo / Società
        "l'infiltrato gioco italiano da tavolo",
        "undercover gioco italiano da tavolo",
        "mr white gioco italiano da tavolo",
        "spia gioco italiano società",
        // Combinations: {GameName} + Gioco Italiano Online da Tavolo / Società (Variations)
        "l'infiltrato gioco italiano online da tavolo",
        "undercover gioco italiano online società",
        "mr white gioco italiano online società",
        "l'infiltrato gioco online italiano da tavolo",
        "undercover gioco online italiano società",
        "mr white gioco online italiano società",
        // General Terms
        "gioco di gruppo",
        "party game",
        "gioco bluff",
        "giocare online",
        "un telefono",
        "web app gioco",
      ].join(", "),
    },

    // --- Open Graph Tags ---
    { property: "og:title", content: companySEOTitle },
    { property: "og:description", content: companySEODescription },
    { property: "og:type", content: "website" },
    { property: "og:url", content: companyUrl },
    { property: "og:image", content: companyLogo },
    { property: "og:image:width", content: "900" },
    { property: "og:image:height", content: "900" },
    { property: "og:locale", content: "it_IT" },
    {
      property: "og:site_name",
      content: companyName,
    },

    // --- Twitter Card Tags ---
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: companySEOTitle }, // Title now includes "Undercover"
    { name: "twitter:description", content: companySEODescription }, // Description now includes "Undercover"
    { name: "twitter:image", content: companyLogo },
    // { name: 'twitter:site', content: '@TuoHandleTwitter' },
  ],

  // --- Structured Data Script (JSON-LD) ---
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          // WebApplication Schema
          {
            "@type": "WebApplication",
            "@id": `${companyUrl}#website`,
            name: companySEOTitle, // Includes Undercover
            description: companySEODescription, // Includes Undercover
            url: companyUrl,
            sameAs: [
              "https://www.mrwhitegioco.it",
              "https://www.mrwhite.fun",
              "https://www.undercover.website"
            ],
            applicationCategory: "GameApplication",
            operatingSystem: "Web Browser",
            browserRequirements: "Requires JavaScript",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 5,
              bestRating: 5,
              ratingCount: 2304,
            },
            inLanguage: "it-IT",
            keywords: [
              "l'infiltrato",
              "undercover",
              "mr white",
              "spia",
              "gioco online",
              "gioco italiano",
              "web app",
              "party game",
              "un telefono", // Added Undercover
            ],
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            subjectOf: { "@id": `${companyUrl}#game` },
          },
          // Game Schema
          {
            "@type": "Game",
            "@id": `${companyUrl}#game`,
            name: companyName, // Includes Undercover
            alternateName: [
              "Mr. White Gioco",
              "Mr White",
              "Mr.White",
              "MrWhite",
              "Gioco della Spia",
              "Spia Gioco",
              "Undercover Gioco",
              "Undercover Gioco Online",
              "Mr White Gioco Online",
              "Mr White Gioco",
              "L'Infiltrato Gioco Online", // Added Undercover variations
            ],
            description: `Gioca online a ${companyName} in italiano. Un party game di parole, bluff e deduzione sociale per gruppi. Si gioca facilmente con un solo telefono. Scopri l'infiltrato prima che sia troppo tardi!`,
            url: companyUrl,
            inLanguage: "it-IT",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 5,
              bestRating: 5,
              ratingCount: 2304,
            },
            genre: [
              "Party game",
              "Word game",
              "Bluffing game",
              "Gioco di società",
              "Gioco di parole",
              "Gioco da tavolo",
              "Social deduction game",
              "Undercover Game", // Added genre
            ],
            keywords: [
              // Added Undercover keywords here too
              "l'infiltrato",
              "undercover",
              "mr white",
              "spia",
              "gioco online",
              "gioco italiano",
              "gioco di parole",
              "gioco da tavolo",
              "gioco società",
              "bluff",
              "deduzione",
              "un telefono",
              "parole nascoste",
            ].join(", "),
            numberOfPlayers: { "@type": "QuantitativeValue", minValue: 3 },
            playMode: "MultiPlayer",
            gamePlatform: ["Browser", "WebApplication"],
          },
        ],
      }),
    },
  ],
};
