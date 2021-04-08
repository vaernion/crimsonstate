export enum DamageType {
  normal = "normal",
  penetrating = "penetrating",
  impact = "impact",
  explosive = "explosive",
  elemental = "elemental",
}

export interface DamageVariant {
  type: DamageType;
  armorIgnore: number;
}

export const damageVariants: Record<DamageType, DamageVariant> = {
  normal: {
    type: DamageType.normal,
    armorIgnore: 0,
  },
  penetrating: {
    type: DamageType.penetrating,
    armorIgnore: 0.9,
  },
  impact: {
    type: DamageType.impact,
    armorIgnore: 0,
  },
  explosive: {
    type: DamageType.explosive,
    armorIgnore: 0.1,
  },
  elemental: {
    type: DamageType.elemental,
    armorIgnore: 0.3,
  },
};

export enum ProjectileType {
  bullet = "bullet",
  rocket = "rocket",
  laser = "laser",
}

export enum ProjectileName {
  pistol = "pistol",
  rifle = "rifle",
  slugshot = "slugshot",
  rocket = "rocket",
  laser = "laser",
}

export interface ProjectileVariant {
  variant: string;
  projectileType: ProjectileType;
  acceleration: number;
  maxSpeed: number;
  damageVariant: DamageVariant;
  width: number;
  height: number;
}

export const projectileVariants: Record<ProjectileName, ProjectileVariant> = {
  pistol: {
    variant: "pistol",
    projectileType: ProjectileType.bullet,
    acceleration: 7,
    maxSpeed: 7,
    damageVariant: damageVariants.normal,
    width: 2,
    height: 3,
  },
  rifle: {
    variant: "rifle",
    projectileType: ProjectileType.bullet,
    acceleration: 10,
    maxSpeed: 10,
    damageVariant: damageVariants.penetrating,
    width: 3,
    height: 7,
  },
  slugshot: {
    variant: "slugshot",
    projectileType: ProjectileType.bullet,
    acceleration: 5,
    maxSpeed: 5,
    damageVariant: damageVariants.impact,
    width: 6,
    height: 6,
  },
  rocket: {
    variant: "rocket",
    projectileType: ProjectileType.rocket,
    acceleration: 1.5,
    maxSpeed: 12,
    damageVariant: damageVariants.explosive,
    width: 8,
    height: 12,
  },
  laser: {
    variant: "laser",
    projectileType: ProjectileType.laser,
    acceleration: 99,
    maxSpeed: 99,
    damageVariant: damageVariants.elemental,
    width: 1,
    height: 1,
  },
};
