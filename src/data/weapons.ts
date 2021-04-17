import { ProjectileVariant, projectileVariants } from "./damage";

export enum WeaponName {
  collisionTest = "collisonTest",
  hk45 = "hk45",
  m4 = "m4",
  minigun = "minigun",
}

export interface WeaponVariant {
  name: WeaponName;
  projectileVariant: ProjectileVariant;
  damage: number;
  magazineMax: number;
  ammoMax: number;
  ammoPerShot: number;
  reloadTime: number;
  cooldown: number;
  penetration: number;
  spread: number;
  width: number;
  height: number;
  color: string;
}

export const weaponVariants: Record<WeaponName, WeaponVariant> = {
  [WeaponName.collisionTest]: {
    name: WeaponName.collisionTest,
    projectileVariant: projectileVariants.rocket,
    damage: 10,
    magazineMax: 1,
    ammoMax: 1,
    ammoPerShot: 1,
    reloadTime: 5000,
    cooldown: 0,
    penetration: 0,
    spread: 0,
    width: 30,
    height: 30,
    color: "",
  },
  [WeaponName.hk45]: {
    name: WeaponName.hk45,
    projectileVariant: projectileVariants.pistol,
    damage: 20,
    magazineMax: 10,
    ammoMax: 60,
    ammoPerShot: 1,
    reloadTime: 1200,
    cooldown: 1000 / 2,
    penetration: 0,
    spread: 0,
    width: 25,
    height: 15,
    color: "#2a3439", // gun metal
  },
  [WeaponName.m4]: {
    name: WeaponName.m4,
    projectileVariant: projectileVariants.rifle,
    damage: 15,
    magazineMax: 30,
    ammoMax: Infinity, // 150
    ammoPerShot: 1,
    reloadTime: 2000,
    cooldown: 1000 / (800 / 60),
    penetration: 2,
    spread: 5,
    width: 30,
    height: 20,
    color: "#46473E", // heavy metal
  },
  [WeaponName.minigun]: {
    name: WeaponName.minigun,
    projectileVariant: projectileVariants.rifle,
    damage: 30,
    magazineMax: 1500,
    ammoMax: 10000,
    ammoPerShot: 1,
    reloadTime: 4000,
    cooldown: 1000 / (2500 / 60),
    penetration: 2,
    spread: 10,
    width: 50,
    height: 25,
    color: "purple",
  },
};
