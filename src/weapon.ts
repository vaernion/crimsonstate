import { ProjectileVariant } from "./data/damage";
import { WeaponName, WeaponVariant, weaponVariants } from "./data/weapons";
import { Entity, Vector } from "./entity";
import { Projectile } from "./projectile";

export class Weapon implements WeaponVariant {
  lastAttackTime: number = 0;
  isReloading: boolean = false;
  reloadStartedTime: number = 0;
  reloadTime: number;

  variant: string;
  projectileVariant: ProjectileVariant;
  damage: number;
  magazineMax: number;
  magazine: number;
  ammoMax: number;
  ammo: number;
  ammoPerShot: number;
  cooldown: number;
  penetration: number;
  spread: number;

  constructor(weaponName: WeaponName, ammoFraction: number) {
    const weaponVariant = weaponVariants[weaponName];
    this.variant = weaponVariant.variant;
    this.projectileVariant = weaponVariant.projectileVariant;
    this.damage = weaponVariant.damage;
    this.magazineMax = weaponVariant.magazineMax;
    this.magazine = this.magazineMax;
    this.ammoMax = weaponVariant.ammoMax;
    this.ammo = Math.round(this.ammoMax * ammoFraction);
    this.ammoPerShot = weaponVariant.ammoPerShot;
    this.reloadTime = weaponVariant.reloadTime;
    this.cooldown = weaponVariant.cooldown;
    this.penetration = weaponVariant.penetration;
    this.spread = weaponVariant.spread;
  }

  public shoot(
    gameTime: number,
    projectiles: Set<Projectile>,
    shooter: Entity,
    direction: Vector
  ): boolean {
    if (this.isShootReady(gameTime)) {
      if (this.magazine >= this.ammoPerShot) {
        this.magazine -= this.ammoPerShot;
        this.lastAttackTime = gameTime;

        const projectile = new Projectile(
          shooter.faction,
          shooter.name,
          new Vector(shooter.position.x, shooter.position.y),
          direction,
          this.projectileVariant,
          this.damage,
          this.penetration
        );
        projectiles.add(projectile);

        return true;
      } else if (this.ammo > 0) {
        this.startReload(gameTime);
        return false;
      }
    }
    return false;
  }

  public isShootReady(gameTime: number): boolean {
    return !this.isReloading && this.lastAttackTime + this.cooldown <= gameTime;
  }

  public startReload(gameTime: number): boolean {
    if (
      this.magazine < this.magazineMax &&
      this.ammo > 0 &&
      this.isReloadDone(gameTime)
    ) {
      this.isReloading = true;
      this.reloadStartedTime = gameTime;
      return true;
    }
    return false;
  }

  public isReloadDone(gameTime: number): boolean {
    return this.reloadStartedTime + this.reloadTime <= gameTime;
  }

  public checkReload(gameTime: number): void {
    if (this.isReloading && this.isReloadDone(gameTime)) {
      this.finishReload();
    }
  }

  public finishReload(): void {
    this.isReloading = false;
    const ammoReloaded = Math.min(
      this.ammo,
      this.magazineMax,
      this.magazineMax - this.magazine
    );
    this.magazine += ammoReloaded;
    this.ammo -= ammoReloaded;
  }
}
