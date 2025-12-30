import styled, { css, keyframes } from 'styled-components';
import type { LetterState } from '../types';

const flipIn = keyframes`
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
`;

const pop = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

const getBackgroundColor = (state: LetterState) => {
  switch (state) {
    case 'correct':
      return '#538d4e';
    case 'present':
      return '#b59f3b';
    case 'absent':
      return '#3a3a3c';
    default:
      return 'transparent';
  }
};

const getBorderColor = (state: LetterState, hasLetter: boolean) => {
  if (state !== 'empty') {
    return getBackgroundColor(state);
  }
  return hasLetter ? '#565758' : '#3a3a3c';
};

interface TileProps {
  $state: LetterState;
  $hasLetter: boolean;
  $delay?: number;
  $animate?: boolean;
}

export const TileContainer = styled.div<TileProps>`
  width: 62px;
  height: 62px;
  border: 2px solid ${({ $state, $hasLetter }) => getBorderColor($state, $hasLetter)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background-color: ${({ $state }) => getBackgroundColor($state)};
  transition: background-color 0.1s;
  
  ${({ $animate, $delay }) =>
    $animate &&
    css`
      animation: ${flipIn} 0.5s ease forwards;
      animation-delay: ${$delay || 0}ms;
    `}
  
  ${({ $hasLetter, $state }) =>
    $hasLetter &&
    $state === 'empty' &&
    css`
      animation: ${pop} 0.1s ease;
    `}
`;

export const RowContainer = styled.div<{ $shake?: boolean }>`
  display: flex;
  gap: 5px;
  
  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shake} 0.5s ease;
    `}
`;

export const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
`;

export const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
`;

export const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

interface KeyProps {
  $state: LetterState;
  $width?: 'normal' | 'wide';
}

export const Key = styled.button<KeyProps>`
  height: 58px;
  min-width: ${({ $width }) => ($width === 'wide' ? '65px' : '43px')};
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $state }) =>
    $state === 'empty' ? '#818384' : getBackgroundColor($state)};
  color: white;
  font-size: ${({ $width }) => ($width === 'wide' ? '12px' : '1.25rem')};
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const Header = styled.header`
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #3a3a3c;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 0.2rem;
    margin: 0;
  }
`;

export const PlayArea = styled.div`
  display: flex;
  gap: 40px;
  padding: 20px;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const PlayerSection = styled.div<{ $isCurrentPlayer?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ $isCurrentPlayer }) =>
    $isCurrentPlayer ? 'rgba(83, 141, 78, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${({ $isCurrentPlayer }) =>
    $isCurrentPlayer ? '#538d4e' : 'transparent'};
`;

export const PlayerName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #fff;
`;

export const Message = styled.div`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  color: white;
  min-height: 40px;
`;

export const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  background-color: #538d4e;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4a7d45;
  }
  
  &:disabled {
    background-color: #3a3a3c;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 15px;
  font-size: 1.1rem;
  border: 2px solid #3a3a3c;
  border-radius: 5px;
  background-color: #121213;
  color: white;
  text-align: center;
  text-transform: uppercase;
  
  &:focus {
    outline: none;
    border-color: #538d4e;
  }
`;

export const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  max-width: 400px;
  margin: 0 auto;
`;

export const RoomCode = styled.div`
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
  padding: 15px 30px;
  background-color: #3a3a3c;
  border-radius: 10px;
`;

export const WaitingMessage = styled.p`
  font-size: 1.2rem;
  color: #818384;
  text-align: center;
`;

export const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #121213;
  color: white;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
`;

export const WinnerBanner = styled.div<{ $won: boolean }>`
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  background-color: ${({ $won }) => ($won ? '#538d4e' : '#b59f3b')};
  border-radius: 10px;
  margin: 20px;
`;

export const OpponentGrid = styled.div`
  transform: scale(0.6);
  transform-origin: top center;
  opacity: 0.8;
`;
