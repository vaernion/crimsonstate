import { ProjectileVariant, projectileVariants } from "./damage";

export enum WeaponName {
  collisionTest = "collisonTest",
  hk45 = "hk45",
  m4 = "m4",
  minigun = "mini",
}

export interface WeaponVariant {
  variant: string;
  projectileVariant: ProjectileVariant;
  damage: number;
  magazineMax: number;
  ammoMax: number;
  ammoPerShot: number;
  reloadTime: number;
  cooldown: number;
  penetration: number;
  spread: number;
}

export const weaponVariants: Record<WeaponName, WeaponVariant> = {
  [WeaponName.collisionTest]: {
    variant: "collisionTest",
    projectileVariant: projectileVariants.rocket,
    damage: 10,
    magazineMax: 1,
    ammoMax: 1,
    ammoPerShot: 1,
    reloadTime: 5000,
    cooldown: 0,
    penetration: 0,
    spread: 0,
  },
  [WeaponName.hk45]: {
    variant: "hk45",
    projectileVariant: projectileVariants.pistol,
    damage: 20,
    magazineMax: 10,
    ammoMax: Infinity, // 60
    ammoPerShot: 1,
    reloadTime: 1200,
    cooldown: 1000 / 2,
    penetration: 0,
    spread: 0,
  },
  [WeaponName.m4]: {
    variant: "m4",
    projectileVariant: projectileVariants.rifle,
    damage: 15,
    magazineMax: 30,
    ammoMax: Infinity, // 150
    ammoPerShot: 1,
    reloadTime: 2000,
    cooldown: 1000 / (800 / 60),
    penetration: 2,
    spread: 5,
  },
  [WeaponName.minigun]: {
    variant: "collisionTest",
    projectileVariant: projectileVariants.rifle,
    damage: 30,
    magazineMax: 1500,
    ammoMax: 10000,
    ammoPerShot: 1,
    reloadTime: 4000,
    cooldown: 1000 / (2500 / 60),
    penetration: 2,
    spread: 10,
  },
};
