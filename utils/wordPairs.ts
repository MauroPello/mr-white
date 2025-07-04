import { wordPairs } from "~/constants/wordPairs";
import type { WordPair } from "~/types/wordPairs";
import { getRecentlyPlayedWordPairs } from './playedWordPairsStorage';

export function getRandomWordPair(): WordPair {
  const recentlyPlayed = getRecentlyPlayedWordPairs();
  const availableWordPairs = wordPairs.filter(wp =>
    !recentlyPlayed.some(rp => rp.civilian === wp.civilian && rp.undercover === wp.undercover)
  );

  if (availableWordPairs.length === 0) {
    // If all word pairs have been played recently, just return any random word pair
    const randomIndex = Math.floor(Math.random() * wordPairs.length);
    if (!wordPairs[randomIndex])
      throw new Error("No word pair found at the generated index");
    return wordPairs[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * availableWordPairs.length);
  if (!availableWordPairs[randomIndex])
    throw new Error("No word pair found at the generated index");

  return availableWordPairs[randomIndex];
}
