import { ref, set, get, onValue, update, remove, off } from 'firebase/database';
import { database } from './config';
import type { GameRoom, PlayerState } from '../types';
import { getRandomWord } from '../utils/words';

// Generate a random 6-character room code
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate a random player ID
export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Create a new game room
export const createRoom = async (playerName: string): Promise<{ roomId: string; playerId: string }> => {
  const roomId = generateRoomCode();
  const playerId = generatePlayerId();
  const targetWord = await getRandomWord();

  const playerState: PlayerState = {
    id: playerId,
    name: playerName,
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
    lastUpdated: Date.now(),
  };

  const gameRoom: GameRoom = {
    id: roomId,
    host: playerId,
    targetWord,
    players: {
      [playerId]: playerState,
    },
    status: 'waiting',
    createdAt: Date.now(),
    winner: null,
  };

  const roomRef = ref(database, `rooms/${roomId}`);
  await set(roomRef, gameRoom);

  return { roomId, playerId };
};

// Join an existing room
export const joinRoom = async (roomId: string, playerName: string): Promise<{ playerId: string; success: boolean; error?: string }> => {
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return { playerId: '', success: false, error: 'Room not found' };
  }

  const room = snapshot.val() as GameRoom;
  const playerCount = Object.keys(room.players).length;

  if (playerCount >= 2) {
    return { playerId: '', success: false, error: 'Room is full' };
  }

  if (room.status !== 'waiting') {
    return { playerId: '', success: false, error: 'Game already in progress' };
  }

  const playerId = generatePlayerId();
  const playerState: PlayerState = {
    id: playerId,
    name: playerName,
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
    lastUpdated: Date.now(),
  };

  await update(ref(database, `rooms/${roomId}/players`), {
    [playerId]: playerState,
  });

  return { playerId, success: true };
};

// Start the game (host only)
export const startGame = async (roomId: string): Promise<void> => {
  await update(ref(database, `rooms/${roomId}`), {
    status: 'playing',
  });
};

// Submit a guess
export const submitGuess = async (
  roomId: string,
  playerId: string,
  _guess: string,
  guesses: string[],
  gameOver: boolean,
  won: boolean
): Promise<void> => {
  const updates: Partial<PlayerState> = {
    guesses,
    currentGuess: '',
    gameOver,
    won,
    lastUpdated: Date.now(),
  };

  await update(ref(database, `rooms/${roomId}/players/${playerId}`), updates);

  // If player won, update room winner
  if (won) {
    await update(ref(database, `rooms/${roomId}`), {
      winner: playerId,
      status: 'finished',
    });
  }
};

// Update current guess (for live preview)
export const updateCurrentGuess = async (
  roomId: string,
  playerId: string,
  currentGuess: string
): Promise<void> => {
  await update(ref(database, `rooms/${roomId}/players/${playerId}`), {
    currentGuess,
    lastUpdated: Date.now(),
  });
};

// Subscribe to room changes
export const subscribeToRoom = (
  roomId: string,
  callback: (room: GameRoom | null) => void
): (() => void) => {
  const roomRef = ref(database, `rooms/${roomId}`);
  
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as GameRoom);
    } else {
      callback(null);
    }
  });

  return () => off(roomRef);
};

// Leave room
export const leaveRoom = async (roomId: string, playerId: string): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) return;

  const room = snapshot.val() as GameRoom;
  const playerCount = Object.keys(room.players).length;

  if (playerCount <= 1) {
    // Last player leaving, delete room
    await remove(roomRef);
  } else {
    // Remove player from room
    await remove(ref(database, `rooms/${roomId}/players/${playerId}`));
    
    // If host left, assign new host
    if (room.host === playerId) {
      const remainingPlayers = Object.keys(room.players).filter(id => id !== playerId);
      if (remainingPlayers.length > 0) {
        await update(roomRef, { host: remainingPlayers[0] });
      }
    }
  }
};

// Check room status
export const checkRoomStatus = async (roomId: string): Promise<GameRoom | null> => {
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  return snapshot.exists() ? (snapshot.val() as GameRoom) : null;
};

// Mark player as game over
export const setPlayerGameOver = async (
  roomId: string,
  playerId: string,
  won: boolean
): Promise<void> => {
  await update(ref(database, `rooms/${roomId}/players/${playerId}`), {
    gameOver: true,
    won,
    lastUpdated: Date.now(),
  });

  // Check if both players are done
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  
  if (snapshot.exists()) {
    const room = snapshot.val() as GameRoom;
    const players = Object.values(room.players);
    const allDone = players.every(p => p.gameOver);
    
    if (allDone) {
      await update(roomRef, { status: 'finished' });
    }
  }
};

// Reset game (start new round)
export const resetGame = async (roomId: string): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  
  if (!snapshot.exists()) return;

  const room = snapshot.val() as GameRoom;
  const newTargetWord = await getRandomWord();
  
  const resetPlayers: { [key: string]: PlayerState } = {};
  Object.values(room.players).forEach(player => {
    resetPlayers[player.id] = {
      ...player,
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
      lastUpdated: Date.now(),
    };
  });

  await update(roomRef, {
    targetWord: newTargetWord,
    players: resetPlayers,
    status: 'playing',
    winner: null,
  });
};
