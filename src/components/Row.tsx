import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Tile } from './Tile';
import type { TileData } from '../types';

const RowWrapper = styled(motion.div)`
  display: flex;
  gap: 5px;
`;

interface RowProps {
  tiles: TileData[];
  shake?: boolean;
  animate?: boolean;
}

export const Row = ({ tiles, shake = false }: RowProps) => {
  return (
    <RowWrapper
      animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          letter={tile.letter}
          state={tile.state}
          position={index}
        />
      ))}
    </RowWrapper>
  );
};
