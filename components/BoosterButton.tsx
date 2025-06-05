import React from "react";
import { Booster } from '@/types';
import { BOOSTER_COLORS } from '@/constants';
import Image from 'next/image';

interface BoosterButtonProps {
  booster: Booster;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const BoosterButton = ({ booster, isActive, onClick, disabled }: BoosterButtonProps) => {
  const isButtonDisabled = booster.count === 0 || disabled;

  return (
    <button
      onClick={isButtonDisabled ? undefined : onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-16 h-16 rounded-xl
        transition-all duration-200
        ${isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'}
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${BOOSTER_COLORS[booster.type]}
      `}
      title={booster.description}
    >
      <div className="relative w-8 h-8 mb-1">
        <Image
          src={`/assets/boosters/${booster.type.toLowerCase()}.png`}
          alt={`${booster.name} booster`}
          fill
          className="object-contain"
        />
      </div>

      <span className="text-white text-sm font-bold">{booster.count}</span>
      {isActive && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full" />}
    </button>
  );
}; 