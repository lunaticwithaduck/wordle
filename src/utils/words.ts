// Using Random Word API for both getting target word and validating guesses
const RANDOM_WORD_API = 'https://random-word-api.herokuapp.com/word?length=5';
const RANDOM_WORD_API_ALL = 'https://random-word-api.herokuapp.com/all?length=5';

// Cache of valid words from the API
let validWordsCache: Set<string> | null = null;

// Fallback words only if API completely fails
const FALLBACK_WORDS = [
  'CRANE', 'SLATE', 'AUDIO', 'RAISE', 'ARISE', 'STARE', 'SHARE', 'HEART',
  'HOUSE', 'HORSE', 'LIGHT', 'NIGHT', 'FIGHT', 'RIGHT', 'TIGHT', 'SIGHT',
];

// Load all valid words from API into cache
const loadValidWords = async (): Promise<Set<string>> => {
  if (validWordsCache) return validWordsCache;
  
  try {
    const response = await fetch(RANDOM_WORD_API_ALL);
    if (!response.ok) throw new Error('API failed');
    
    const words: string[] = await response.json();
    validWordsCache = new Set(words.map(w => w.toUpperCase()));
    return validWordsCache;
  } catch (error) {
    console.warn('Failed to load word list:', error);
    validWordsCache = new Set(FALLBACK_WORDS);
    return validWordsCache;
  }
};

export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch(RANDOM_WORD_API);
    if (!response.ok) throw new Error('API failed');
    
    const [word] = await response.json();
    return word.toUpperCase();
  } catch (error) {
    console.warn('Random word API failed, using fallback:', error);
    return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
  }
};

export const isValidWord = async (word: string): Promise<boolean> => {
  try {
    const validWords = await loadValidWords();
    return validWords.has(word.toUpperCase());
  } catch {
    // If everything fails, accept the word
    return true;
  }
};
