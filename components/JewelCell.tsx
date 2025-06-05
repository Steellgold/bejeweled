"use client";

import React, { useState, useEffect } from "react";
import { JewelCellProps } from "../types";
import { JEWEL_IMAGES, ANIMATION_DURATION } from "../constants";

export const JewelCell: React.FC<JewelCellProps> = ({
  jewel,
  isSelected,
  onClick,
  isSwapping,
  isFalling,
  isMatched,
  isHighlighted,
  isGolden
}) => {
  const [animationClass, setAnimationClass] = useState<string>("");

  useEffect(() => {
    if (isFalling) {
      setAnimationClass("animate-fall");
      const timer = setTimeout(() => setAnimationClass(""), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isFalling]);

  return (
    <button
      onClick={onClick}
      className={`
        aspect-square flex items-center justify-center
        transition-all duration-200 rounded-xl relative overflow-hidden
        bg-[#1E1E1E]/30 hover:bg-[#1E1E1E]/30

        ${isSelected ? "ring-1 ring-yellow300 shadow-yellow-300/30" : ""}
        ${isHighlighted ? "ring-1 bg-red-500/20 ring-red-500 animate-pulse" : ""}
        ${isSwapping ? "animate-swap right-0" : ""}
        ${isMatched ? "animate-match right-0" : ""}
        ${animationClass}
      `}
      style={{
        transform: isSwapping ? isSwapping.transform : undefined,
        zIndex: isSwapping ? 10 : 1,
      }}
    >
      {isGolden && <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-yellow-500/10" />}

      {jewel !== null ? (
        <img
          src={JEWEL_IMAGES[jewel]}
          alt={`Jewel ${jewel}`}
          className={`w-9 h-9 object-cover z-10 ${isGolden ? "drop-shadow-md" : ""}`}
          style={{
            filter: isGolden ? "brightness(1.1) drop-shadow(0 0 4px gold)" : "none"
          }}
        />
      ) : (
        <>
          {JSON.stringify(jewel)}
        </>
      )}
    </button>
  );
};