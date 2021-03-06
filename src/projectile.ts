import { Controls } from "./controls";
import {
  DamageVariant,
  ProjectileType,
  ProjectileVariant,
} from "./data/damage";
import { EntityFaction, EntityType } from "./data/entities";
import { Enemy } from "./enemy";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { World } from "./world";

export class Projectile extends Entity {
  public type = EntityType.projectile;
  public variant: string;
  public projectileType: ProjectileType;
  public spawnedBy: string;

  public direction: Vector;
  public startPosition: Vector;
  public maxRange: number;

  public damageVariant: DamageVariant;
  public damage: number;
  public penetration: number;

  constructor(
    faction: EntityFaction,
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
    this.startPosition = new Vector(this.position.x, this.position.y);
    this.acceleration = new Vector(
      projectileVariant.acceleration,
      projectileVariant.acceleration
    );

    this.variant = projectileVariant.variant;
    this.projectileType = projectileVariant.projectileType;
    this.maxSpeed = projectileVariant.maxSpeed;
    this.maxRange = projectileVariant.maxRange;
    this.damageVariant = projectileVariant.damageVariant;
    this.damage = damage;
    this.penetration = penetration;
    this.width = projectileVariant.width;
    this.height = projectileVariant.height;
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    player: Player,
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ) {
    this.move(this.direction, world, player, enemies);
    // PLACEHOLDER: interact with other objects
  }

  private dealDamage(target: Entity) {
    target.takeDamage(this.damage, this.damageVariant);
    this.isDestroyed = true;
  }

  public detectCollisions(player: Player, enemies: Set<Enemy>) {
    if (this.faction !== EntityFaction.player && this.isCollidingWith(player)) {
      this.dealDamage(player);
    }

    enemies.forEach((enemy) => {
      if (this.faction !== EntityFaction.enemy && this.isCollidingWith(enemy)) {
        this.dealDamage(enemy);
      }
    });
  }
}
