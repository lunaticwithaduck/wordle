import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { LetterState } from '../types';

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

const TileWrapper = styled(motion.div)<{ $state: LetterState; $hasLetter: boolean }>`
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
`;

interface TileProps {
  letter: string;
  state: LetterState;
  position?: number;
}

export const Tile = ({ letter, state, position = 0 }: TileProps) => {
  const isRevealed = state !== 'empty';
  
  return (
    <TileWrapper
      $state={state}
      $hasLetter={letter !== ''}
      initial={false}
      animate={
        isRevealed
          ? {
              rotateX: [0, 90, 0],
              transition: {
                duration: 0.5,
                delay: position * 0.15,
                times: [0, 0.5, 1],
              },
            }
          : letter
          ? { scale: [1, 1.1, 1], transition: { duration: 0.1 } }
          : {}
      }
    >
      {letter}
    </TileWrapper>
  );
};
