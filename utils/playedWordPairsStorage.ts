import type { WordPair } from '~/types/wordPairs';

const PLAYED_WORD_PAIRS_STORAGE_KEY = 'playedWordPairs';

interface PlayedWordPair extends WordPair {
  playedAt: number;
}

function getPlayedWordPairs(): PlayedWordPair[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedValue = localStorage.getItem(PLAYED_WORD_PAIRS_STORAGE_KEY);
  if (!storedValue) {
    return [];
  }
  return JSON.parse(storedValue) as PlayedWordPair[];
}

export function addPlayedWordPair(wordPair: WordPair) {
    if (typeof window === 'undefined') {
        return;
    }
  const playedWordPairs = getPlayedWordPairs();
  const newPlayedWordPair: PlayedWordPair = {
    ...wordPair,
    playedAt: Date.now(),
  };
  const updatedPlayedWordPairs = [...playedWordPairs, newPlayedWordPair];
  localStorage.setItem(PLAYED_WORD_PAIRS_STORAGE_KEY, JSON.stringify(updatedPlayedWordPairs));
}

export function getRecentlyPlayedWordPairs(): WordPair[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const playedWordPairs = getPlayedWordPairs();
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

  const recentPairs = playedWordPairs.filter(wp => wp.playedAt > twoWeeksAgo);

  localStorage.setItem(PLAYED_WORD_PAIRS_STORAGE_KEY, JSON.stringify(recentPairs));

  return recentPairs.map(({ civilian, undercover }) => ({ civilian, undercover }));
}
