import { wordPairs } from "~/constants/wordPairs";
import type { WordPair } from "~/types/wordPairs";

export function getRandomWordPair(): WordPair {
  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  if (!wordPairs[randomIndex])
    throw new Error("No word pair found at the generated index");

  return wordPairs[randomIndex];
}
