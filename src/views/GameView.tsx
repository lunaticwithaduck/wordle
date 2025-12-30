import { useEffect, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Keyboard,
  Header,
  Message,
  Button,
  PlayerSection,
  PlayerName,
  WinnerBanner,
  getLetterStates,
} from '../components';
import type { GameRoom, LetterState } from '../types';
import { isValidWord } from '../utils/words';
import { submitGuess, resetGame } from '../firebase';

interface GameViewProps {
  room: GameRoom;
  playerId: string;
  onLeaveRoom: () => void;
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const PlayArea = styled.div`
  display: flex;
  gap: 40px;
  padding: 20px;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 900px) {
    gap: 20px;
  }
`;

const OpponentSection = styled(PlayerSection)`
  opacity: 0.7;
  transform: scale(0.85);
  
  @media (max-width: 900px) {
    transform: scale(0.7);
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  margin: 10px;
`;

const StatusItem = styled.span<{ $highlight?: boolean }>`
  font-size: 0.9rem;
  color: ${({ $highlight }) => ($highlight ? '#538d4e' : '#818384')};
`;

export const GameView = ({ room, playerId, onLeaveRoom }: GameViewProps) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [message, setMessage] = useState('');
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  const currentPlayer = room.players[playerId];
  const opponent = Object.values(room.players).find(p => p.id !== playerId);
  const isGameOver = room.status === 'finished' || currentPlayer?.gameOver;
  
  // Normalize guesses to always be an array (Firebase doesn't store empty arrays)
  // Use useMemo to prevent new array references on every render
  const playerGuesses = useMemo(() => currentPlayer?.guesses || [], [currentPlayer?.guesses]);
  const opponentGuesses = useMemo(() => opponent?.guesses || [], [opponent?.guesses]);
  
  // Update letter states when guesses change
  useEffect(() => {
    if (!currentPlayer) return;
    
    const newStates: Record<string, LetterState> = {};
    
    playerGuesses.forEach(guess => {
      const states = getLetterStates(guess, room.targetWord);
      guess.split('').forEach((letter, i) => {
        const currentState = newStates[letter];
        const newState = states[i];
        
        if (
          !currentState ||
          (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
          (currentState === 'present' && newState === 'correct')
        ) {
          newStates[letter] = newState;
        }
      });
    });
    
    setLetterStates(newStates);
  }, [playerGuesses, room.targetWord, currentPlayer]);

  const handleKeyPress = useCallback(async (key: string) => {
    if (isGameOver || !currentPlayer) return;

    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setMessage('');
      return;
    }

    if (key === 'Enter' || key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setMessage('Not enough letters');
        setShakeRow(playerGuesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      const valid = await isValidWord(currentGuess);
      if (!valid) {
        setMessage('Not in word list');
        setShakeRow(playerGuesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      const newGuesses = [...playerGuesses, currentGuess];
      const won = currentGuess.toUpperCase() === room.targetWord.toUpperCase();
      const gameOver = won || newGuesses.length >= 6;

      await submitGuess(
        room.id,
        playerId,
        currentGuess,
        newGuesses,
        gameOver,
        won
      );

      if (won) {
        setMessage('You won! 🎉');
      } else if (gameOver) {
        setMessage(`Game over! The word was ${room.targetWord}`);
      }

      setCurrentGuess('');
      return;
    }

    // Regular letter input
    if (currentGuess.length < 5 && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => (prev + key.toUpperCase()).slice(0, 5));
      setMessage('');
    }
  }, [currentGuess, currentPlayer, isGameOver, playerId, room.id, room.targetWord]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handlePlayAgain = async () => {
    await resetGame(room.id);
    setCurrentGuess('');
    setMessage('');
    setLetterStates({});
  };

  if (!currentPlayer) {
    return <div>Loading...</div>;
  }

  const winner = room.winner ? room.players[room.winner] : null;
  const playerWon = room.winner === playerId;

  return (
    <GameContainer>
      <Header>
        <h1>1v1 WORDLE</h1>
      </Header>

      <StatusBar>
        <StatusItem>Room: {room.id}</StatusItem>
        {opponent && (
          <StatusItem $highlight={opponent.gameOver && opponent.won}>
            {opponent.name}: {opponentGuesses.length}/6 guesses
            {opponent.gameOver && (opponent.won ? ' ✓' : ' ✗')}
          </StatusItem>
        )}
      </StatusBar>

      <AnimatePresence>
        {room.status === 'finished' && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <WinnerBanner $won={playerWon}>
              {playerWon ? '🎉 You Won!' : `${winner.name} Won!`}
              <br />
              <span style={{ fontSize: '1rem' }}>The word was: {room.targetWord}</span>
            </WinnerBanner>
          </motion.div>
        )}
      </AnimatePresence>

      <PlayArea>
        <PlayerSection $isCurrentPlayer>
          <PlayerName>{currentPlayer.name} (You)</PlayerName>
          <Grid
            guesses={playerGuesses}
            currentGuess={currentGuess}
            targetWord={room.targetWord}
            shakeRow={shakeRow}
          />
        </PlayerSection>

        {opponent && (
          <OpponentSection>
            <PlayerName>{opponent.name}</PlayerName>
            <Grid
              guesses={opponentGuesses}
              currentGuess=""
              targetWord={room.targetWord}
              hideLetters={true}
            />
          </OpponentSection>
        )}
      </PlayArea>

      <BottomSection>
        <Message>{message}</Message>
        
        <Keyboard
          onKeyPress={handleKeyPress}
          letterStates={letterStates}
          disabled={isGameOver}
        />

        <ButtonGroup>
          {room.status === 'finished' && room.host === playerId && (
            <Button onClick={handlePlayAgain}>
              Play Again
            </Button>
          )}
          <Button
            onClick={onLeaveRoom}
            style={{ backgroundColor: '#b59f3b' }}
          >
            Leave Game
          </Button>
        </ButtonGroup>
      </BottomSection>
    </GameContainer>
  );
};
