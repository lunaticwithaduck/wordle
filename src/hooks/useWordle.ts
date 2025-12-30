import { useState, useCallback, useEffect } from 'react';
import type { LetterState } from '../types';
import { isValidWord } from '../utils/words';
import { getLetterStates } from '../components/Grid';

interface UseWordleProps {
  targetWord: string;
  maxGuesses?: number;
  onGuess?: (guess: string) => void;
  onWin?: () => void;
  onLose?: () => void;
}

interface UseWordleReturn {
  guesses: string[];
  currentGuess: string;
  letterStates: Record<string, LetterState>;
  gameOver: boolean;
  won: boolean;
  shakeRow: number | null;
  message: string;
  handleKeyPress: (key: string) => void;
}

export const useWordle = ({
  targetWord,
  maxGuesses = 6,
  onGuess,
  onWin,
  onLose,
}: UseWordleProps): UseWordleReturn => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const updateLetterStates = useCallback((guess: string, target: string) => {
    const states = getLetterStates(guess, target);
    
    setLetterStates(prev => {
      const newStates = { ...prev };
      
      guess.split('').forEach((letter, i) => {
        const currentState = newStates[letter];
        const newState = states[i];
        
        // Only upgrade state: absent -> present -> correct
        if (
          !currentState ||
          (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
          (currentState === 'present' && newState === 'correct')
        ) {
          newStates[letter] = newState;
        }
      });
      
      return newStates;
    });
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return;

    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setMessage('');
      return;
    }

    if (key === 'Enter' || key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setMessage('Not enough letters');
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      if (!isValidWord(currentGuess)) {
        setMessage('Not in word list');
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      updateLetterStates(currentGuess, targetWord);
      onGuess?.(currentGuess);

      if (currentGuess.toUpperCase() === targetWord.toUpperCase()) {
        setGameOver(true);
        setWon(true);
        setMessage('You won! 🎉');
        onWin?.();
      } else if (newGuesses.length >= maxGuesses) {
        setGameOver(true);
        setWon(false);
        setMessage(`Game over! The word was ${targetWord}`);
        onLose?.();
      }

      setCurrentGuess('');
      return;
    }

    // Regular letter input
    if (currentGuess.length < 5 && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => (prev + key.toUpperCase()).slice(0, 5));
      setMessage('');
    }
  }, [currentGuess, gameOver, guesses, maxGuesses, onGuess, onLose, onWin, targetWord, updateLetterStates]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return {
    guesses,
    currentGuess,
    letterStates,
    gameOver,
    won,
    shakeRow,
    message,
    handleKeyPress,
  };
};
