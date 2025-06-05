import { useState, useCallback } from "react";
import { Position } from "../types";
import { ANIMATION_DURATION } from "../constants";

export const useAnimations = () => {
  const [hintCells, setHintCells] = useState<Set<string>>(new Set());
  const [hintAnimation, setHintAnimation] = useState<boolean>(false);

  const showHint = useCallback((hint: Position[]) => {
    const hintSet = new Set(hint.map(pos => `${pos.row},${pos.col}`));
    setHintCells(hintSet);
    setHintAnimation(true);

    setTimeout(() => {
      setHintAnimation(false);
      setTimeout(() => {
        setHintCells(new Set());
      }, ANIMATION_DURATION);
    }, 1000);
  }, []);

  return {
    hintCells,
    hintAnimation,
    showHint
  };
}; 