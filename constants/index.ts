import { BoostersConfig } from "../types";
import { BoosterTypeEnum } from '@/types';

export const GRID_Y_SIZE = 8;
export const GRID_X_SIZE = 8;

export const ANIMATION_DURATION = 200;

export const JEWEL_IMAGES: string[] = [
  "/assets/gems/gem_1.png", // Diamant
  "/assets/gems/gem_3.png", // Émeraude
  "/assets/gems/gem_4.png", // Ruby
  "/assets/gems/gem_9.png", // Saphir
  "/assets/gems/gem_10.png", // Amethyst
  "/assets/gems/gem_11.png", // Topaze
  "/assets/gems/gem_12.png", // Perle
  "/assets/gems/gem_13.png" // Crystal
];

export const BOOSTERS: BoostersConfig = {
  HAMMER: { name: "Hammer", src: "/assets/boosters/hammer.png", count: 0 },
  BOMB: { name: "Bomb", src: "/assets/boosters/bomb.png", count: 0 },
  LASER: { name: "Laser", src: "/assets/boosters/laser.png", count: 0 }
};

export const BOOSTER_COLORS: Record<BoosterTypeEnum, string> = {
  [BoosterTypeEnum.LINE_CLEAR]: 'bg-blue-500 hover:bg-blue-600',
  [BoosterTypeEnum.COLOR_BOMB]: 'bg-purple-500 hover:bg-purple-600',
  [BoosterTypeEnum.SHUFFLE]: 'bg-green-500 hover:bg-green-600',
} as const; 