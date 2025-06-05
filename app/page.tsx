"use client";

import { useEffect } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import { useAnimations } from "../hooks/useAnimations";
import { findHint, findMatches } from "../utils/gameLogic";
import { GRID_X_SIZE, GRID_Y_SIZE } from "../constants";
import { BoosterType } from "../types";
import { BoosterButton } from "@/components/BoosterButton";
import { JewelCell } from "@/components/JewelCell";

export default function Home() {
  const {
    grid,
    goldenCells,
    level,
    score,
    selectedCell,
    swappingCells,
    fallingCells,
    matchedCells,
    boosters,
    activeBooster,
    boosterNotification,
    setGrid,
    setSelectedCell,
    setBoosters,
    setActiveBooster,
    initializeGame,
    animateSwap,
    removeMatches,
    checkCascadingMatches,
    useBooster,
    canUseBooster
  } = useGameLogic();

  const { hintCells, showHint } = useAnimations();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCellClick = async (row: number, col: number) => {
    if (activeBooster) {
      const booster = boosters[activeBooster];
      if (canUseBooster(booster)) {
        useBooster(booster, { row, col });
      }
      return;
    }

    if (selectedCell) {
      if (
        (Math.abs(selectedCell.row - row) === 1 && selectedCell.col === col) ||
        (Math.abs(selectedCell.col - col) === 1 && selectedCell.row === row)
      ) {
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[selectedCell.row][selectedCell.col];
        newGrid[selectedCell.row][selectedCell.col] = newGrid[row][col];
        newGrid[row][col] = temp;

        await animateSwap(selectedCell, { row, col });
        setGrid(newGrid);

        const { matches, matchedPositions } = findMatches(newGrid);
        if (matches.length > 0) {
          const updatedGrid = await removeMatches(newGrid, matches, matchedPositions);
          setGrid(updatedGrid);
          checkCascadingMatches(updatedGrid);
        } else {
          const revertGrid = grid.map(row => [...row]);
          setGrid(revertGrid);
          await animateSwap({ row, col }, selectedCell);
        }
      }
      setSelectedCell(null);
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleHintClick = () => {
    const hint = findHint(grid);
    if (hint) showHint([hint.from, hint.to]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b bg-[#1a1a1a] from-[#0d0d0d] to-[#1a1a1a] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Bejeweled</h1>
            <div className="flex gap-4 items-center">
              <div>
                <span className="text-yellow-300">Score: </span>
                <span className="text-xl">{score}</span>
              </div>
              <div>
                <span className="text-yellow-300">Level: </span>
                <span className="text-xl">{level}</span>
              </div>

              <button
                onClick={handleHintClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Indice
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.entries(boosters).map(([type, booster]) => (
              <BoosterButton
                key={type}
                booster={booster}
                isActive={activeBooster === type}
                onClick={() => setActiveBooster(type as BoosterType)}
                disabled={!canUseBooster(booster)}
              />
            ))}
          </div>
        </div>

        {boosterNotification && (
          <div className="bg-yellow-500/10 text-black p-3 rounded-lg mb-4">
            <p className="text-lg font-semibold">
              {boosterNotification} obtenu !
            </p>
          </div>
        )}

        <div className="grid gap-1" style={{ 
          gridTemplateColumns: `repeat(${GRID_X_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_Y_SIZE}, minmax(0, 1fr))`
        }}>
          {grid.map((row, i) => (
            row.map((cell, j) => (
              <JewelCell
                key={`${i}-${j}`}
                jewel={cell}
                row={i}
                col={j}
                isSelected={selectedCell?.row === i && selectedCell?.col === j}
                isHighlighted={hintCells.has(`${i},${j}`)}
                isGolden={goldenCells.has(`${i},${j}`)}
                onClick={() => handleCellClick(i, j)}
                isSwapping={swappingCells?.from.row === i && swappingCells?.from.col === j ? swappingCells.from : 
                           swappingCells?.to.row === i && swappingCells?.to.col === j ? swappingCells.to : null}
                isFalling={fallingCells.has(`${i},${j}`)}
                isMatched={matchedCells.has(`${i},${j}`)}
              />
            ))
          ))}
        </div>
      </div>
    </main>
  );
}