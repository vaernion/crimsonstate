import { enemyColor } from "./style";

export const constants = {
  canvasWidthFraction: 0.7,
  canvasHeightFraction: 0.65,
  friction: 0.89,
  world: {
    width: 2000,
    height: 1000,
  },
  player: {
    width: 20,
    height: 45,
    headSize: 15,
    health: 100,
    acceleration: {
      x: 1.3,
      y: 1.3,
    },
    maxSpeed: 10,
  },
  enemy: {
    maxCount: 100,
    spawnDelay: 500,
  },
};

export interface EnemyType {
  type: string;
  width: number;
  height: number;
  health: number;
  damage: number;
  color: string;
}

export const enemyTypes: { [k: string]: EnemyType } = {
  normal: {
    type: "normal",
    width: 20,
    height: 20,
    health: 50,
    damage: 10,
    color: enemyColor.normal,
  },
  fast: {
    type: "fast",
    width: 10,
    height: 10,
    health: 30,
    damage: 5,
    color: enemyColor.fast,
  },
  slow: {
    type: "slow",
    width: 30,
    height: 30,
    health: 200,
    damage: 25,
    color: enemyColor.slow,
  },
};
