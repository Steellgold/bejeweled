import React from "react";
import { BoosterTypeEnum } from '@/types';
import { BOOSTER_COLORS } from '@/constants';
import { useGameLogic } from '@/hooks/useGameLogic';
import Image from 'next/image';

interface BoosterButtonProps {
  type: BoosterTypeEnum;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const BoosterButton = ({ type, count, isActive, onClick, disabled }: BoosterButtonProps) => {
  const { canUseBooster } = useGameLogic();
  const isDisabled = count === 0 || !canUseBooster(type) || disabled;

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-16 h-16 rounded-xl
        transition-all duration-200
        ${isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${BOOSTER_COLORS[type]}
      `}
    >
      <div className="relative w-8 h-8 mb-1">
        <Image
          src={`/assets/boosters/${type.toLowerCase()}.png`}
          alt={`${type} booster`}
          fill
          className="object-contain"
        />
      </div>

      <span className="text-white text-sm font-bold">{count}</span>
      {isActive && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full" />}
    </button>
  );
}; 