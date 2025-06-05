export interface Position {
  row: number;
  col: number;
}

export interface SwapData {
  transform: string;
}

export interface SwappingCells {
  from: Position & SwapData;
  to: Position & SwapData;
}

export interface Match {
  type: string;
  row: number;
  col: number;
  length: number;
  direction: "horizontal" | "vertical";
  positions: string[];
}

export interface MatchResult {
  matches: Match[];
  matchedPositions: Set<string>;
}

export interface Hint {
  from: Position;
  to: Position;
}

export interface Booster {
  name: string;
  src: string;
  count: number;
}

export interface BoostersConfig {
  HAMMER: Booster;
  BOMB: Booster;
  LASER: Booster;
}

export enum BoosterTypeEnum {
  LINE_CLEAR = 'LINE_CLEAR',
  COLOR_BOMB = 'COLOR_BOMB',
  SHUFFLE = 'SHUFFLE'
}

export type BoosterType = keyof BoostersConfig;

export interface JewelCellProps {
  jewel: number;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
  isSwapping: SwapData | null;
  isFalling: boolean;
  isMatched: boolean;
  isHighlighted: boolean;
  isGolden: boolean;
}

export interface BoosterButtonProps {
  type: BoosterType;
  booster: Booster;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
} 