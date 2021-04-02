import { style } from "./style";

export const constants = {
  canvas: {
    ratio: 16 / 9,
    // widthFraction: 0.9, // unused
    heightFraction: 0.75,
  },
  friction: 0.89,
  world: {
    width: 2000,
    height: 1000,
  },
  player: {
    width: 20,
    height: 45,
    headSize: 15,
    health: 50,
    maxHealth: 200,
    acceleration: {
      x: 1.3,
      y: 1.3,
    },
    maxSpeed: 10,
    consumables: {
      initial: {
        bomb: 3,
        medpack: 4,
      },
      max: {
        bomb: 6,
        medpack: 6,
      },
      effect: {
        medpack: 60,
      },
    },
  },
  enemy: {
    maxCount: 100,
    spawnDelay: 2000,
    spawnGroup: 15,
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
    acceleration: 0.8,
    maxSpeed: 9,
    width: 20,
    height: 20,
    health: 50,
    damage: 10,
    color: style.enemyColor.normal,
  },
  fast: {
    type: "fast",
    acceleration: 1.2,
    maxSpeed: 11,
    width: 10,
    height: 10,
    health: 30,
    damage: 5,
    color: style.enemyColor.fast,
  },
  slow: {
    type: "slow",
    acceleration: 0.25,
    maxSpeed: 7,
    width: 30,
    height: 30,
    health: 200,
    damage: 25,
    color: style.enemyColor.slow,
  },
};
