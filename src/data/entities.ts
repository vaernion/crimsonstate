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
    acceleration: 0.8,
    maxSpeed: 9,
    width: 20,
    height: 20,
    health: 50,
    damage: 10,
    color: style.enemyColor.normal,
    weapon: WeaponName.hk45,
  },
  fast: {
    variant: "fast",
    acceleration: 1.2,
    maxSpeed: 11,
    width: 10,
    height: 10,
    health: 30,
    damage: 5,
    color: style.enemyColor.fast,
    weapon: WeaponName.hk45,
  },
  slow: {
    variant: "slow",
    acceleration: 0.25,
    maxSpeed: 7,
    width: 30,
    height: 30,
    health: 200,
    damage: 25,
    color: style.enemyColor.slow,
    weapon: WeaponName.m4,
  },
};
