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
    spawnDelay: 200,
  },
};

export interface EnemyType {
  type: string;
  maxSpeed: number;
  acceleration: number;
  width: number;
  height: number;
  health: number;
  damage: number;
  color: string;
}

export const enemyTypes: { [k: string]: EnemyType } = {
  normal: {
    type: "normal",
    acceleration: 1,
    maxSpeed: 10,
    width: 20,
    height: 20,
    health: 50,
    damage: 10,
    color: enemyColor.normal,
  },
  fast: {
    type: "fast",
    acceleration: 1.4,
    maxSpeed: 13,
    width: 10,
    height: 10,
    health: 30,
    damage: 5,
    color: enemyColor.fast,
  },
  slow: {
    type: "slow",
    acceleration: 0.3,
    maxSpeed: 8,
    width: 30,
    height: 30,
    health: 200,
    damage: 25,
    color: enemyColor.slow,
  },
};
