// Fetch random 5-letter word from API
const WORD_API_URL = 'https://random-word-api.herokuapp.com/word?length=5';
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Fallback words if API fails
const FALLBACK_WORDS = [
  'CRANE', 'SLATE', 'AUDIO', 'RAISE', 'ARISE', 'STARE', 'SHARE', 'HEART',
  'HOUSE', 'HORSE', 'LIGHT', 'NIGHT', 'FIGHT', 'RIGHT', 'TIGHT', 'SIGHT',
  'BRAIN', 'TRAIN', 'GRAIN', 'DRAIN', 'PLAIN', 'CHAIN', 'CHAIR', 'CHARM',
  'WORLD', 'WOULD', 'COULD', 'SHOULD', 'PLANT', 'PLACE', 'PLANE', 'PLATE',
];

export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch(WORD_API_URL);
    if (!response.ok) throw new Error('API failed');
    
    const [word] = await response.json();
    return word.toUpperCase();
  } catch (error) {
    console.warn('Word API failed, using fallback:', error);
    return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
  }
};

export const isValidWord = async (word: string): Promise<boolean> => {
  try {
    const response = await fetch(`${DICTIONARY_API_URL}${word.toLowerCase()}`);
    return response.ok;
  } catch {
    // If API fails, accept the word
    return true;
  }
};
