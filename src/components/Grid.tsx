import { Row } from './Row';
import { GridContainer } from './styles';
import type { TileData, LetterState } from '../types';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  maxGuesses?: number;
  wordLength?: number;
  currentRow?: number;
  shakeRow?: number | null;
  hideLetters?: boolean; // For opponent view - show colors only
}

const getLetterStates = (guess: string, target: string): LetterState[] => {
  const states: LetterState[] = Array(guess.length).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');
  
  // First pass: mark correct letters
  guessChars.forEach((char, i) => {
    if (char === targetChars[i]) {
      states[i] = 'correct';
      targetChars[i] = '';
    }
  });
  
  // Second pass: mark present letters
  guessChars.forEach((char, i) => {
    if (states[i] !== 'correct') {
      const targetIndex = targetChars.indexOf(char);
      if (targetIndex !== -1) {
        states[i] = 'present';
        targetChars[targetIndex] = '';
      }
    }
  });
  
  return states;
};

export const Grid = ({
  guesses,
  currentGuess,
  targetWord,
  maxGuesses = 6,
  wordLength = 5,
  shakeRow = null,
  hideLetters = false,
}: GridProps) => {
  const rows: { tiles: TileData[]; animate: boolean; shake: boolean }[] = [];
  
  for (let i = 0; i < maxGuesses; i++) {
    const tiles: TileData[] = [];
    
    if (i < guesses.length) {
      // Completed guess
      const guess = guesses[i];
      const states = getLetterStates(guess, targetWord);
      
      for (let j = 0; j < wordLength; j++) {
        tiles.push({
          letter: hideLetters ? '' : (guess[j] || ''),
          state: states[j],
        });
      }
      
      rows.push({ tiles, animate: false, shake: false });
    } else if (i === guesses.length) {
      // Current guess
      for (let j = 0; j < wordLength; j++) {
        tiles.push({
          letter: hideLetters ? '' : (currentGuess[j] || ''),
          state: 'empty',
        });
      }
      
      rows.push({ tiles, animate: false, shake: shakeRow === i });
    } else {
      // Empty row
      for (let j = 0; j < wordLength; j++) {
        tiles.push({
          letter: '',
          state: 'empty',
        });
      }
      
      rows.push({ tiles, animate: false, shake: false });
    }
  }
  
  return (
    <GridContainer>
      {rows.map((row, index) => (
        <Row
          key={index}
          tiles={row.tiles}
          animate={row.animate}
          shake={row.shake}
        />
      ))}
    </GridContainer>
  );
};

export { getLetterStates };
