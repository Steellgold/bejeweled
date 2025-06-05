import React from "react";
import { Booster } from '@/types';
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
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive
            ? 'bg-[#2E2E2E] hover:bg-[#2E2E2E]/80'
            : 'bg-[#1E1E1E]/30 hover:bg-[#1E1E1E]/50'}
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
    </button>
  );
}; 