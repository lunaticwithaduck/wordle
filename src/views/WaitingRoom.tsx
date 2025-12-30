import {
  LobbyContainer,
  Header,
  Button,
  RoomCode,
  WaitingMessage,
} from '../components';
import type { GameRoom } from '../types';

interface WaitingRoomProps {
  room: GameRoom;
  playerId: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const WaitingRoom = ({ room, playerId, onStartGame, onLeaveRoom }: WaitingRoomProps) => {
  const players = Object.values(room.players);
  const isHost = room.host === playerId;
  const canStart = players.length === 2;

  return (
    <>
      <Header>
        <h1>1v1 WORDLE</h1>
      </Header>
      
      <LobbyContainer>
        <WaitingMessage>Room Code</WaitingMessage>
        <RoomCode>{room.id}</RoomCode>
        
        <WaitingMessage>
          Players ({players.length}/2):
        </WaitingMessage>
        
        {players.map(player => (
          <WaitingMessage key={player.id} style={{ color: '#fff' }}>
            {player.name} {player.id === room.host && '👑'}
          </WaitingMessage>
        ))}
        
        {!canStart && (
          <WaitingMessage>
            Waiting for another player to join...
          </WaitingMessage>
        )}
        
        {isHost && canStart && (
          <Button onClick={onStartGame}>
            Start Game
          </Button>
        )}
        
        {!isHost && canStart && (
          <WaitingMessage>
            Waiting for host to start the game...
          </WaitingMessage>
        )}
        
        <Button
          onClick={onLeaveRoom}
          style={{ backgroundColor: '#b59f3b', marginTop: '20px' }}
        >
          Leave Room
        </Button>
      </LobbyContainer>
    </>
  );
};
