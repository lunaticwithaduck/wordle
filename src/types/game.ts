export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface TileData {
  letter: string;
  state: LetterState;
}

export interface PlayerState {
  id: string;
  name: string;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  lastUpdated: number;
}

export interface GameRoom {
  id: string;
  host: string;
  targetWord: string;
  players: {
    [playerId: string]: PlayerState;
  };
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  winner: string | null;
}

export interface KeyboardKey {
  key: string;
  state: LetterState;
  width?: 'normal' | 'wide';
}
