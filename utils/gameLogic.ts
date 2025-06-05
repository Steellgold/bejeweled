import { GRID_X_SIZE, GRID_Y_SIZE, JEWEL_IMAGES } from "../constants";
import { MatchResult, Match, Hint } from "../types";

export const initializeGrid = (): (number | null)[][] => {
  const newGrid: (number | null)[][] = [];

  for (let row = 0; row < GRID_Y_SIZE; row++) {
    newGrid[row] = [];
    for (let col = 0; col < GRID_X_SIZE; col++) {
      let jewel: number;
      do {
        jewel = Math.floor(Math.random() * JEWEL_IMAGES.length);
      } while (
        (col >= 2 && newGrid[row][col - 1] === jewel && newGrid[row][col - 2] === jewel) ||
        (row >= 2 && newGrid[row - 1][col] === jewel && newGrid[row - 2][col] === jewel)
      );
      newGrid[row][col] = jewel;
    }
  }

  return newGrid;
};

export const findMatches = (grid: (number | null)[][]): MatchResult => {
  const matches: Match[] = [];
  const matchedPositions = new Set<string>();

  // -
  for (let row = 0; row < GRID_Y_SIZE; row++) {
    for (let col = 0; col < GRID_X_SIZE - 2; col++) {
      const jewel = grid[row][col];
      if (jewel !== null && grid[row][col + 1] === jewel && grid[row][col + 2] === jewel) {
        let matchLength = 3;
        const positions = [`${row},${col}`, `${row},${col + 1}`, `${row},${col + 2}`];

        while (col + matchLength < GRID_X_SIZE && grid[row][col + matchLength] === jewel) {
          positions.push(`${row},${col + matchLength}`);
          matchLength++;
        }

        positions.forEach(pos => matchedPositions.add(pos));
        matches.push({ type: "horizontal", row, col, length: matchLength, direction: "horizontal", positions });
        col += matchLength - 1;
      }
    }
  }

  // |
  for (let col = 0; col < GRID_X_SIZE; col++) {
    for (let row = 0; row < GRID_Y_SIZE - 2; row++) {
      const jewel = grid[row][col];
      if (jewel !== null && grid[row + 1][col] === jewel && grid[row + 2][col] === jewel) {
        let matchLength = 3;
        const positions = [`${row},${col}`, `${row + 1},${col}`, `${row + 2},${col}`];

        while (row + matchLength < GRID_Y_SIZE && grid[row + matchLength][col] === jewel) {
          positions.push(`${row + matchLength},${col}`);
          matchLength++;
        }

        positions.forEach(pos => matchedPositions.add(pos));
        matches.push({ type: "vertical", row, col, length: matchLength, direction: "vertical", positions });
        row += matchLength - 1;
      }
    }
  }

  return { matches, matchedPositions };
};

export const findHint = (grid: (number | null)[][]): Hint | null => {
  for (let row = 0; row < GRID_Y_SIZE; row++) {
    for (let col = 0; col < GRID_X_SIZE; col++) {
      if (col < GRID_X_SIZE - 1) {
        const testGrid = grid.map(r => [...r]);
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row][col + 1];
        testGrid[row][col + 1] = temp;

        if (findMatches(testGrid).matches.length > 0) {
          return { from: { row, col }, to: { row, col: col + 1 } };
        }
      }

      if (row < GRID_Y_SIZE - 1) {
        const testGrid = grid.map(r => [...r]);
        const temp = testGrid[row][col];
        testGrid[row][col] = testGrid[row + 1][col];
        testGrid[row + 1][col] = temp;

        if (findMatches(testGrid).matches.length > 0) {
          return { from: { row, col }, to: { row: row + 1, col } };
        }
      }
    }
  }
  return null;
};

export const generateGoldenCells = (): Set<string> => {
  const goldenCells = new Set<string>();
  
  for (let row = 0; row < GRID_Y_SIZE; row++) {
    for (let col = 0; col < GRID_X_SIZE; col++) {
      if (Math.random() < 0.03) {
        goldenCells.add(`${row},${col}`);
      }
    }
  }
  
  return goldenCells;
};

export function canSwap(grid: (number | null)[][], row1: number, col1: number, row2: number, col2: number): boolean {
  // Vérification Cases adjacentes
  if (Math.abs(row1 - row2) + Math.abs(col1 - col2) !== 1) return false;

  // Swap possible ou pas
  const temp = grid[row1][col1];
  grid[row1][col1] = grid[row2][col2];
  grid[row2][col2] = temp;

  // tinder
  const hasMatches = findMatches(grid).matches.length > 0;

  // Revenir OG
  grid[row2][col2] = grid[row1][col1];
  grid[row1][col1] = temp;

  return hasMatches;
}

export function removeMatches(grid: (number | null)[][], matches: Match[]): void {
  for (const match of matches) {
    if (match.type === 'horizontal') {
      for (let i = 0; i < match.length; i++) {
        grid[match.row][match.col + i] = null;
      }
    } else {
      for (let i = 0; i < match.length; i++) {
        grid[match.row + i][match.col] = null;
      }
    }
  }
}

export function applyGravity(grid: (number | null)[][]): void {
  for (let col = 0; col < GRID_X_SIZE; col++) {
    for (let row = GRID_Y_SIZE - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        // Trouver la première case non vide au-dessus
        // et déplacer la valeur vers le bas
        let sourceRow = row - 1;
        while (sourceRow >= 0 && grid[sourceRow][col] === null) {
          sourceRow--;
        }
        if (sourceRow >= 0) {
          grid[row][col] = grid[sourceRow][col];
          grid[sourceRow][col] = null;
        }
      }
    }
  }
}

export function fillEmptyCells(grid: (number | null)[][]): void {
  for (let row = 0; row < GRID_Y_SIZE; row++) {
    for (let col = 0; col < GRID_X_SIZE; col++) {
      if (grid[row][col] === null) {
        grid[row][col] = Math.floor(Math.random() * JEWEL_IMAGES.length);
      }
    }
  }
} 