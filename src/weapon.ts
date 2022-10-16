import { ProjectileVariant } from "./data/damage";
import { EntityType } from "./data/entities";
import { style } from "./data/style";
import { WeaponName, WeaponVariant, weaponVariants } from "./data/weapons";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { World } from "./world";

export class WeaponPickup extends Entity {
  public weapon: Weapon;
  constructor(
    weaponName: WeaponName,
    ammoFraction: number,
    public position: Vector
  ) {
    super();
    this.type = EntityType.weaponPickup;
    this.weapon = new Weapon(weaponName, ammoFraction);
    this.name = this.weapon.name;
    this.width = this.weapon.width;
    this.height = this.weapon.height;
    this.color = this.weapon.color;
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frames: GameFrames,
    world: World,
    player: Player
  ) {
    const visibleArea = world.visibleArea(canvas, player);
    if (this.isVisible(visibleArea)) {
      // PLACEHOLDER: weapon hitbox
      ctx.strokeStyle = this.color || style.entityColor.default;
      ctx.strokeRect(
        this.position.x -
          visibleArea.xStart -
          this.width / 2 +
          this.velocity.x * frames.lagFraction,
        this.position.y -
          visibleArea.yStart -
          this.height / 2 +
          this.velocity.y * frames.lagFraction,
        this.width,
        this.height
      );

      // PLACEHOLDER: weapon name
      ctx.fillStyle = this.color || style.entityColor.weapon;
      ctx.font = style.canvasFonts.itemPickup;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        `${this.name}`,
        this.position.x - visibleArea.xStart,
        this.position.y - visibleArea.yStart
      );
    }
  }

  protected handleEntityCollision(other: Entity) {
    if (other.type === EntityType.player) {
      other.weapon = this.weapon;
      this.isDestroyed = true;
    }
  }
}

export class Weapon implements WeaponVariant {
  lastAttackTime: number = Number.MIN_SAFE_INTEGER;
  isReloading: boolean = false;
  reloadStartedTime: number = Number.MIN_SAFE_INTEGER;
  reloadTime: number;

  name: WeaponName;
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
  width: number;
  height: number;
  color: string;

  constructor(weaponName: WeaponName, ammoFraction: number = 1) {
    const weaponVariant = weaponVariants[weaponName];
    this.name = weaponVariant.name;
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
    this.width = weaponVariant.width;
    this.height = weaponVariant.height;
    this.color = weaponVariant.color;
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
      } else {
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

  public checkReload(gameTime: number): boolean {
    if (this.isReloading && this.isReloadDone(gameTime)) {
      this.isReloading = false;
      const ammoReloaded = Math.min(
        this.ammo,
        this.magazineMax,
        this.magazineMax - this.magazine
      );
      this.magazine += ammoReloaded;
      this.ammo -= ammoReloaded;
      return true;
    }
    return false;
  }
}
