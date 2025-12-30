import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppContainer } from './components';
import { Lobby, WaitingRoom, GameView } from './views';
import {
  createRoom,
  joinRoom,
  startGame,
  leaveRoom,
  subscribeToRoom,
} from './firebase';
import type { GameRoom } from './types';

type AppState = 'lobby' | 'waiting' | 'playing';

function App() {
  const [appState, setAppState] = useState<AppState>('lobby');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        
        // Update app state based on room status
        if (updatedRoom.status === 'playing' || updatedRoom.status === 'finished') {
          setAppState('playing');
        } else if (updatedRoom.status === 'waiting') {
          setAppState('waiting');
        }
      } else {
        // Room was deleted
        handleLeaveRoom();
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleCreateRoom = async (playerName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { roomId: newRoomId, playerId: newPlayerId } = await createRoom(playerName);
      setRoomId(newRoomId);
      setPlayerId(newPlayerId);
      setAppState('waiting');
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await joinRoom(roomCode, playerName);
      
      if (!result.success) {
        setError(result.error || 'Failed to join room');
        return;
      }
      
      setRoomId(roomCode);
      setPlayerId(result.playerId);
      setAppState('waiting');
    } catch (err) {
      setError('Failed to join room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!roomId) return;
    
    try {
      await startGame(roomId);
    } catch (err) {
      setError('Failed to start game');
      console.error(err);
    }
  };

  const handleLeaveRoom = useCallback(async () => {
    if (roomId && playerId) {
      try {
        await leaveRoom(roomId, playerId);
      } catch (err) {
        console.error('Error leaving room:', err);
      }
    }
    
    setRoom(null);
    setRoomId(null);
    setPlayerId(null);
    setAppState('lobby');
    setError(null);
  }, [roomId, playerId]);

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {appState === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Lobby
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              error={error}
              loading={loading}
            />
          </motion.div>
        )}
        
        {appState === 'waiting' && room && playerId && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WaitingRoom
              room={room}
              playerId={playerId}
              onStartGame={handleStartGame}
              onLeaveRoom={handleLeaveRoom}
            />
          </motion.div>
        )}
        
        {appState === 'playing' && room && playerId && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GameView
              room={room}
              playerId={playerId}
              onLeaveRoom={handleLeaveRoom}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
