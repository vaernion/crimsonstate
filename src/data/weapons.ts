import { ProjectileVariant, projectileVariants } from "./damage";

export enum WeaponName {
  hk45 = "hk45",
  m4 = "m4",
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
  hk45: {
    variant: "hk45",
    projectileVariant: projectileVariants.pistol,
    damage: 10,
    magazineMax: 10,
    ammoMax: 25,
    ammoPerShot: 1,
    reloadTime: 1200,
    cooldown: 1000 / 2,
    penetration: 0,
    spread: 0,
  },
  m4: {
    variant: "m4",
    projectileVariant: projectileVariants.rifle,
    damage: 15,
    magazineMax: 30,
    ammoMax: 150,
    ammoPerShot: 1,
    reloadTime: 2000,
    cooldown: 1000 / (800 / 60),
    penetration: 2,
    spread: 5,
  },
};
