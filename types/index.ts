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

export enum BoosterType {
  HAMMER = 'HAMMER',
  BOMB = 'BOMB',
  LASER = 'LASER'
}

export interface Booster {
  type: BoosterType;
  name: string;
  description: string;
  count: number;
  requiresSelection: boolean;
}

export interface BoostersState {
  [BoosterType.HAMMER]: Booster;
  [BoosterType.BOMB]: Booster;
  [BoosterType.LASER]: Booster;
}

export interface JewelCellProps {
  jewel: number | null;
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
  booster: Booster;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
} 