import { style } from "./style";
import { WeaponName } from "./weapons";

export enum EntityType {
  default = "default",
  player = "player",
  enemy = "enemy",
  projectile = "projectile",
  static = "static",
  hazard = "hazard",
}

export enum EntityFaction {
  neutral = "neutral",
  player = "player",
  enemy = "enemy",
  chaos = "chaos", // hostile to all
}

export interface EnemyVariant {
  variant: string;
  maxSpeed: number;
  acceleration: number;
  width: number;
  height: number;
  health: number;
  damage: number;
  color: string;
  weapon: WeaponName;
}

export const enemyVariants: { [k: string]: EnemyVariant } = {
  normal: {
    variant: "normal",
    acceleration: 0.5,
    maxSpeed: 2.5,
    width: 20,
    height: 20,
    health: 30,
    damage: 10,
    color: style.enemyColor.normal,
    weapon: WeaponName.hk45,
  },
  fast: {
    variant: "fast",
    acceleration: 0.7,
    maxSpeed: 3,
    width: 15,
    height: 15,
    health: 20,
    damage: 5,
    color: style.enemyColor.fast,
    weapon: WeaponName.hk45,
  },
  slow: {
    variant: "slow",
    acceleration: 0.22,
    maxSpeed: 1.8,
    width: 30,
    height: 30,
    health: 150,
    damage: 25,
    color: style.enemyColor.slow,
    weapon: WeaponName.collisionTest,
  },
};
