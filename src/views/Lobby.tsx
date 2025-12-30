import { useState } from 'react';
import {
  LobbyContainer,
  Header,
  Button,
  Input,
  WaitingMessage,
} from '../components';
import styled from 'styled-components';

interface LobbyProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
  error: string | null;
  loading: boolean;
}

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  background-color: ${({ $active }) => ($active ? '#538d4e' : '#3a3a3c')};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ $active }) => ($active ? '#4a7d45' : '#4a4a4c')};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;

export const Lobby = ({ onCreateRoom, onJoinRoom, error, loading }: LobbyProps) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) return;
    
    if (activeTab === 'create') {
      onCreateRoom(playerName.trim());
    } else {
      if (!roomCode.trim()) return;
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <>
      <Header>
        <h1>1v1 WORDLE</h1>
      </Header>
      
      <LobbyContainer>
        <WaitingMessage>
          Compete head-to-head to guess the word first!
        </WaitingMessage>
        
        <TabContainer>
          <Tab
            $active={activeTab === 'create'}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </Tab>
          <Tab
            $active={activeTab === 'join'}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </Tab>
        </TabContainer>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={15}
            required
          />
          
          {activeTab === 'join' && (
            <Input
              type="text"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : activeTab === 'create' ? 'Create Room' : 'Join Room'}
          </Button>
        </Form>
      </LobbyContainer>
    </>
  );
};
