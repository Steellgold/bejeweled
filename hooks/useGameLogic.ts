import { useState, useCallback } from "react";
import { Position, SwappingCells, BoostersState, BoosterType, Match, Booster } from "../types";
import { GRID_X_SIZE, GRID_Y_SIZE, JEWEL_IMAGES, ANIMATION_DURATION, BOOSTERS } from "../constants";
import { initializeGrid, findMatches, findHint, generateGoldenCells } from "../utils/gameLogic";

export const useGameLogic = () => {
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [goldenCells, setGoldenCells] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [swappingCells, setSwappingCells] = useState<SwappingCells | null>(null);
  const [fallingCells, setFallingCells] = useState<Set<string>>(new Set());
  const [matchedCells, setMatchedCells] = useState<Set<string>>(new Set());
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [boosters, setBoosters] = useState<BoostersState>(BOOSTERS);
  const [activeBooster, setActiveBooster] = useState<BoosterType | null>(null);
  const [boosterNotification, setBoosterNotification] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fallingMap, setFallingMap] = useState<{ [key: string]: number }>({});

  const initializeGame = useCallback(() => {
    const newGrid = initializeGrid();
    const newGoldenCells = generateGoldenCells();

    setGrid(
      newGrid.map(
        row => row.map(cell => cell === null
          ? Math.floor(Math.random() * JEWEL_IMAGES.length)
          : cell
        )
      )
    );
    
    setGoldenCells(newGoldenCells);
  }, []);

  const animateMatches = (matchedPositions: Set<string>): Promise<void> => {
    setMatchedCells(matchedPositions);
    return new Promise(resolve => {
      setTimeout(() => {
        setMatchedCells(new Set());
        resolve();
      }, ANIMATION_DURATION);
    });
  };

  const giveRandomBooster = useCallback((): void => {
    const boosterTypes = Object.keys(boosters) as BoosterType[];
    const randomBooster = boosterTypes[Math.floor(Math.random() * boosterTypes.length)];

    setBoosters(prev => ({
      ...prev,
      [randomBooster]: {
        ...prev[randomBooster],
        count: prev[randomBooster].count + 1
      }
    }));

    setBoosterNotification(boosters[randomBooster].name);
    setTimeout(() => {
      setBoosterNotification(null);
    }, 1000);
  }, [boosters]);

  const removeMatches = async (
    grid: (number | null)[][], 
    matches: Match[], 
    matchedPositions: Set<string>
  ): Promise<(number | null)[][]> => {
    await animateMatches(matchedPositions);

    const newGrid = grid.map(row => [...row]);
    const columnsToUpdate = new Set<number>();
    const droppingCells = new Set<string>();
    const newGoldenCells = new Set(goldenCells);
    let goldenCellsDestroyed = 0;

    const matchCount = matchedPositions.size;
    setScore(prev => prev + matchCount * 10 * level);

    matchedPositions.forEach(cellKey => {
      if (goldenCells.has(cellKey)) {
        goldenCellsDestroyed++;
        newGoldenCells.delete(cellKey);
      }
    });

    matches.forEach(match => {
      if (match.direction === "horizontal") {
        for (let i = 0; i < match.length; i++) {
          newGrid[match.row][match.col + i] = null as any;
          columnsToUpdate.add(match.col + i);
        }
      } else {
        for (let i = 0; i < match.length; i++) {
          newGrid[match.row + i][match.col] = null as any;
          columnsToUpdate.add(match.col);
        }
      }
    });

    columnsToUpdate.forEach(col => {
      let nullCount = 0;
      for (let row = GRID_Y_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col] === null) {
          nullCount++;
          newGoldenCells.delete(`${row},${col}`);
        } else if (nullCount > 0) {
          newGrid[row + nullCount][col] = newGrid[row][col];
          newGrid[row][col] = null as any;
          droppingCells.add(`${row + nullCount},${col}`);

          if (newGoldenCells.has(`${row},${col}`)) {
            newGoldenCells.delete(`${row},${col}`);
            newGoldenCells.add(`${row + nullCount},${col}`);
          }
        }
      }

      for (let row = 0; row < nullCount; row++) {
        newGrid[row][col] = Math.floor(Math.random() * JEWEL_IMAGES.length);
        droppingCells.add(`${row},${col}`);

        if (Math.random() < 0.05) {
          newGoldenCells.add(`${row},${col}`);
        }
      }
    });

    setGoldenCells(newGoldenCells);
    setFallingCells(droppingCells);
    setTimeout(() => {
      setFallingCells(new Set());
    }, ANIMATION_DURATION);

    for (let i = 0; i < goldenCellsDestroyed; i++) {
      setTimeout(() => giveRandomBooster(), 300 + (i * 100));
    }

    return newGrid;
  };

  const animateSwap = (from: Position, to: Position): Promise<void> => {
    const fromX = (to.col - from.col) * 100;
    const fromY = (to.row - from.row) * 100;

    setSwappingCells({
      from: { ...from, transform: `translate(${fromX}%, ${fromY}%)` },
      to: { ...to, transform: `translate(${-fromX}%, ${-fromY}%)` }
    });

    return new Promise(resolve => {
      setTimeout(() => {
        setSwappingCells(null);
        resolve();
      }, ANIMATION_DURATION);
    });
  };

  const checkCascadingMatches = async (currentGrid: (number | null)[][]): Promise<void> => {
    const { matches, matchedPositions } = findMatches(currentGrid);
    if (matches.length > 0) {
      const updatedGrid = await removeMatches(currentGrid, matches, matchedPositions);
      setGrid(updatedGrid);

      setTimeout(() => {
        checkCascadingMatches(updatedGrid);
      }, ANIMATION_DURATION);
    } else {
      if (Math.floor(score / 1000) > level - 1) {
        setLevel(prevLevel => prevLevel + 1);
      }
    }
  };

  const canUseBooster = (booster: Booster): boolean => {
    if (isAnimating || isProcessing) return false;
    if (booster.count === 0) return false;
    return true;
  };

  const useBooster = (booster: Booster, position: Position) => {
    if (!canUseBooster(booster)) return;

    setIsProcessing(true);
    const newGrid = [...grid];
    const cellsToHighlight = new Set<string>();

    switch (booster.type) {
      case BoosterType.HAMMER:
        newGrid[position.row][position.col] = null;
        cellsToHighlight.add(`${position.row},${position.col}`);
        setBoosters((prev: BoostersState) => ({
          ...prev,
          [BoosterType.HAMMER]: {
            ...prev[BoosterType.HAMMER],
            count: prev[BoosterType.HAMMER].count - 1
          }
        }));
        break;

      case BoosterType.BOMB:
        const { row, col } = position;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < GRID_Y_SIZE && newCol >= 0 && newCol < GRID_X_SIZE) {
              newGrid[newRow][newCol] = null;
              cellsToHighlight.add(`${newRow},${newCol}`);
            }
          }
        }
        setBoosters((prev: BoostersState) => ({
          ...prev,
          [BoosterType.BOMB]: {
            ...prev[BoosterType.BOMB],
            count: prev[BoosterType.BOMB].count - 1
          }
        }));
        break;

      case BoosterType.LASER:
        const { row: laserRow, col: laserCol } = position;
        const isOnEdge = laserRow === 0 || laserRow === GRID_Y_SIZE - 1 || laserCol === 0 || laserCol === GRID_X_SIZE - 1;
        
        if (isOnEdge) {
          // Horizontal
          for (let i = 0; i < GRID_X_SIZE; i++) {
            newGrid[laserRow][i] = null;
            cellsToHighlight.add(`${laserRow},${i}`);
          }
          // Vertical
          for (let i = 0; i < GRID_Y_SIZE; i++) {
            newGrid[i][laserCol] = null;
            cellsToHighlight.add(`${i},${laserCol}`);
          }
        } else {
          // Horizontal
          for (let i = 0; i < GRID_X_SIZE; i++) {
            newGrid[laserRow][i] = null;
            cellsToHighlight.add(`${laserRow},${i}`);
          }
        }
        
        setBoosters((prev: BoostersState) => ({
          ...prev,
          [BoosterType.LASER]: {
            ...prev[BoosterType.LASER],
            count: prev[BoosterType.LASER].count - 1
          }
        }));
        break;
    }

    setHighlightedCells(cellsToHighlight);
    setTimeout(() => setHighlightedCells(new Set()), 500);

    setGrid(newGrid);
    applyGravity();
    setActiveBooster(null);
    setIsProcessing(false);
    checkCascadingMatches(newGrid);
  };

  const applyGravity = useCallback(() => {
    const newGrid = [...grid];
    const newFallingMap: { [key: string]: number } = {};

    for (let col = 0; col < GRID_X_SIZE; col++) {
      let emptySpots = 0;
      for (let row = GRID_Y_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col] === null) {
          emptySpots++;
        } else if (emptySpots > 0) {
          newGrid[row + emptySpots][col] = newGrid[row][col];
          newGrid[row][col] = null;
          newFallingMap[`${row + emptySpots},${col}`] = emptySpots;
        }
      }
      for (let row = 0; row < emptySpots; row++) {
        newGrid[row][col] = Math.floor(Math.random() * JEWEL_IMAGES.length);
        newFallingMap[`${row},${col}`] = emptySpots - row;
      }
    }

    setGrid(newGrid);
    setFallingMap(newFallingMap);
    setTimeout(() => setFallingMap({}), 300);
  }, [grid]);

  return {
    // State
    grid,
    goldenCells,
    level,
    score,
    selectedCell,
    swappingCells,
    fallingCells,
    matchedCells,
    highlightedCells,
    boosters,
    activeBooster,
    boosterNotification,
    fallingMap,
    
    // Setters
    setGrid,
    setGoldenCells,
    setSelectedCell,
    setSwappingCells,
    setFallingCells,
    setMatchedCells,
    setHighlightedCells,
    setBoosters,
    setActiveBooster,
    setBoosterNotification,
    setScore,
    
    // Functions
    initializeGame,
    animateSwap,
    removeMatches,
    checkCascadingMatches,
    giveRandomBooster,
    canUseBooster,
    useBooster,
    applyGravity
  };
}; 