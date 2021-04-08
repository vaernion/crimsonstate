import { Controls } from "./controls";
import {
  DamageVariant,
  ProjectileType,
  ProjectileVariant,
} from "./data/damage";
import { EntityType } from "./data/entities";
import { MovingEntity, Vector } from "./entity";
import { GameFrames } from "./game";
import { World } from "./world";

export class Projectile extends MovingEntity {
  public type = EntityType.projectile;
  public variant: string;
  public projectileType: ProjectileType;
  public faction: EntityType;
  public spawnedBy: string;

  public direction: Vector;

  public damageVariant: DamageVariant;
  public damage: number;
  public penetration: number;

  constructor(
    faction: EntityType,
    spawnedBy: string,
    position: Vector,
    direction: Vector,
    projectileVariant: ProjectileVariant,
    damage: number,
    penetration: number
  ) {
    super();
    this.faction = faction;
    this.spawnedBy = spawnedBy;

    this.position = position;
    this.direction = direction;
    this.acceleration = new Vector(
      projectileVariant.acceleration,
      projectileVariant.acceleration
    );

    this.variant = projectileVariant.variant;
    this.projectileType = projectileVariant.projectileType;
    this.maxSpeed = projectileVariant.maxSpeed;
    this.damageVariant = projectileVariant.damageVariant;
    this.damage = damage;
    this.penetration = penetration;
    this.width = projectileVariant.width;
    this.height = projectileVariant.height;
  }

  public update(controls: Controls, frames: GameFrames, world: World) {
    this.move(this.direction, world);
    // PLACEHOLDER: interact with other objects
  }
}
