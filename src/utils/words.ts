// Dictionary API for validating guesses
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Curated list of 200 common 5-letter words from Datamuse API
const TARGET_WORDS = [
  'SCOWL', 'ARDOR', 'SOUGH', 'AMBLE', 'SNEER', 'SNARL', 'ADEPT', 'ALOOF',
  'SCORN', 'SHARP', 'SNORT', 'AMPLE', 'PIOUS', 'POWER', 'SHIFT', 'SCOFF',
  'SURGE', 'ACUTE', 'ASSAY', 'SHADE', 'POISE', 'ABIDE', 'ANGST', 'PITCH',
  'AGONY', 'SMIRK', 'SWOON', 'SHRUG', 'PLUCK', 'SWEAR', 'SPURN', 'PRIDE',
  'PANIC', 'SHAME', 'SPITE', 'SCRAP', 'PRIOR', 'AVOID', 'ABODE', 'PLAZA',
  'PESKY', 'SHOCK', 'ACTOR', 'ADMIT', 'ALLOW', 'ANNUL', 'SINEW', 'APACE',
  'ANGEL', 'PROXY', 'PRESS', 'ARBOR', 'AROMA', 'PIQUE', 'SNUFF', 'SCAMP',
  'PROWL', 'AGORA', 'PLUSH', 'SAPPY', 'ANTSY', 'PRONE', 'SCENE', 'AISLE',
  'PROSE', 'SIREN', 'PROVE', 'ASTER', 'PARRY', 'AGILE', 'ADORN', 'PINCH',
  'PADDY', 'SCOOT', 'PHONY', 'AUGHT', 'SASSY', 'APPLE', 'SCENT', 'SIEVE',
  'SNARE', 'PYLON', 'SCOUT', 'POLAR', 'ADAPT', 'SHOUT', 'SALLY', 'SHOVE',
  'AMOUR', 'POUND', 'PEARL', 'SIGHT', 'SHEAR', 'SHAKE', 'SERVE', 'SHOOT',
  'AGAPE', 'AUGER', 'ADOPT', 'POACH', 'ANGRY', 'SHRUB', 'ALLOT', 'ADORE',
  'PITHY', 'PROOF', 'ALIAS', 'ALLOY', 'PUPIL', 'AGATE', 'PLUMB', 'ABOUT',
  'SIEGE', 'ADDER', 'SHINE', 'SHAKY', 'SHAWL', 'SOUSE', 'SIDLE', 'SHOWY',
  'AMPLY', 'PUSHY', 'PHASE', 'PULSE', 'SHUNT', 'SATYR', 'ALARM', 'SCALE',
  'PARSE', 'ASPEN', 'ATONE', 'SHADY', 'ALIKE', 'PIXIE', 'PRUDE', 'AMISS',
  'PRISE', 'PLUNK', 'PRATE', 'AURIC', 'SCRAG', 'PATCH', 'SCREW', 'PILOT',
  'PURSE', 'PANSY', 'ALIGN', 'SHEEN', 'SHIRK', 'AMASS', 'SULLY', 'ASKEW',
  'SCARY', 'AUDIT', 'SCRUB', 'SUITE', 'PRIZE', 'PLUCK', 'SCRIM', 'ARGOT',
  'ADIEU', 'APRON', 'AWARD', 'AFTER', 'SCARF', 'ALIVE', 'SCALD', 'SUPRA',
  'AURAL', 'SHALL', 'SALVO', 'POSSE', 'APART', 'SATIN', 'SHREW', 'PINKY',
  'POSER', 'AMAZE', 'AWAIT', 'AWASH', 'ABUSE', 'ABASH', 'SCALE', 'PUNCH',
  'PLANE', 'PEACE', 'SCRIP', 'ALIBI', 'PRUNE', 'AHEAD', 'ARENA', 'PORCH',
  'PAGAN', 'PUPPY', 'SHACK', 'SHARD', 'SILKY', 'SHRED', 'SHUCK', 'SUNNY',
];

export const getRandomWord = async (): Promise<string> => {
  // Pick from curated list - all are real dictionary words
  return TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
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
