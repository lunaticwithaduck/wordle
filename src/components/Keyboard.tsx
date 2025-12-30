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
      return '#818384';
  }
};

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

const KeyButton = styled(motion.button)<{ $state: LetterState; $width?: 'normal' | 'wide' }>`
  height: 58px;
  min-width: ${({ $width }) => ($width === 'wide' ? '65px' : '43px')};
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $state }) => getBackgroundColor($state)};
  color: white;
  font-size: ${({ $width }) => ($width === 'wide' ? '12px' : '1.25rem')};
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export const Keyboard = ({ onKeyPress, letterStates, disabled = false }: KeyboardProps) => {
  const handleClick = (key: string) => {
    if (disabled) return;
    
    if (key === '⌫') {
      onKeyPress('Backspace');
    } else {
      onKeyPress(key);
    }
  };
  
  return (
    <KeyboardContainer>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <KeyboardRow key={rowIndex}>
          {row.map((key) => {
            const isSpecialKey = key === 'ENTER' || key === '⌫';
            const state = isSpecialKey ? 'empty' : (letterStates[key] || 'empty');
            
            return (
              <KeyButton
                key={key}
                $state={state}
                $width={isSpecialKey ? 'wide' : 'normal'}
                onClick={() => handleClick(key)}
                disabled={disabled}
                whileTap={{ scale: 0.95 }}
                whileHover={{ opacity: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {key}
              </KeyButton>
            );
          })}
        </KeyboardRow>
      ))}
    </KeyboardContainer>
  );
};
