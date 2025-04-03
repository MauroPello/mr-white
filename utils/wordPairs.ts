export interface WordPair {
  civilian: string;
  undercover: string;
}

// Translated Word Pairs (Italiano)
export const wordPairs: WordPair[] = [
  { civilian: "Mela", undercover: "Pera" },
  { civilian: "Cane", undercover: "Lupo" },
  { civilian: "Sole", undercover: "Luna" },
  { civilian: "Sedia", undercover: "Sgabello" },
  { civilian: "Caffè", undercover: "Tè" },
  { civilian: "Auto", undercover: "Bicicletta" },
  { civilian: "Libro", undercover: "Rivista" },
  { civilian: "Pizza", undercover: "Hamburger" },
  { civilian: "Oceano", undercover: "Lago" },
  { civilian: "Chitarra", undercover: "Violino" },
  { civilian: "Estate", undercover: "Inverno" },
  { civilian: "Dottore", undercover: "Infermiere" },
  { civilian: "Film", undercover: "Serie TV" },
  { civilian: "Password", undercover: "Username" },
  { civilian: "Latte", undercover: "Acqua" },
  { civilian: "Spiaggia", undercover: "Deserto" },
  { civilian: "Gatto", undercover: "Topo" },
  { civilian: "Letto", undercover: "Divano" },
  { civilian: "Calcio", undercover: "Basket" },
  { civilian: "Pioggia", undercover: "Neve" },
  { civilian: "Pasta", undercover: "Riso" },
  { civilian: "Telefono", undercover: "Computer" },
  { civilian: "Forchetta", undercover: "Cucchiaio" },
  // Aggiungi altre coppie!
];

// Helper function to get a random pair
export function getRandomWordPair(): WordPair {
  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  return wordPairs[randomIndex];
}