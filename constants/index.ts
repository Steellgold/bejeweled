import { BoostersState, BoosterType } from "../types";

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

export const BOOSTERS: BoostersState = {
  [BoosterType.HAMMER]: {
    type: BoosterType.HAMMER,
    name: "Hammer",
    description: "Détruit une cellule",
    count: 0,
    requiresSelection: true
  },
  [BoosterType.BOMB]: {
    type: BoosterType.BOMB,
    name: "Bomb",
    description: "Détruit une zone 3x3",
    count: 0,
    requiresSelection: true
  },
  [BoosterType.LASER]: {
    type: BoosterType.LASER,
    name: "Laser",
    description: "Détruit une ligne entière",
    count: 0,
    requiresSelection: true
  }
};