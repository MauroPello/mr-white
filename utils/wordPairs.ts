import { wordPacks } from "~/constants/wordPacks";
import type { WordPair } from "~/types/wordPairs";
import { getRecentlyPlayedWordPairs } from "./playedWordPairsStorage";

export function getRandomWordPair(packNames?: string[]): WordPair {
  const recentlyPlayed = getRecentlyPlayedWordPairs();

  let wordPairs: WordPair[];

  if (packNames && packNames.length > 0) {
    wordPairs = wordPacks
      .filter(pack => packNames.includes(pack.name))
      .flatMap(pack => pack.pairs);
  } else {
    wordPairs = wordPacks.flatMap(pack => pack.pairs);
  }

  if (wordPairs.length === 0) {
    wordPairs = wordPacks.flatMap(pack => pack.pairs);
  }

  const availableWordPairs = wordPairs.filter(
    wp =>
      !recentlyPlayed.some(
        rp => rp.civilian === wp.civilian && rp.undercover === wp.undercover,
      ),
  );

  if (availableWordPairs.length === 0) {
    // If all word pairs in the selected pack have been played, use any from that pack
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
