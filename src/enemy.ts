import { Controls } from "./controls";
import { EnemyVariant, EntityFaction, EntityType } from "./data/entities";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Weapon } from "./weapon";
import { World } from "./world";

export class Enemy extends Entity {
  constructor(enemyVariant: EnemyVariant, public position: Vector) {
    super();
    this.type = EntityType.enemy;
    this.faction = EntityFaction.enemy;
    this.name = `enemy_${enemyVariant.variant}${this.id}`;

    this.acceleration = new Vector(
      enemyVariant.acceleration,
      enemyVariant.acceleration
    );
    this.maxSpeed = enemyVariant.maxSpeed;
    this.width = enemyVariant.width;
    this.height = enemyVariant.height;
    this.color = enemyVariant.color;

    this.health = enemyVariant.health;
    this.maxHealth = enemyVariant.health;
    this.weapon = new Weapon(enemyVariant.weapon, 1);
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    projectiles: Set<Projectile>,
    player: Player
  ) {
    // default direction == player.position
    const moveDirection = Vector.directionToTarget(
      this.position,
      player.position
    );
    this.move(moveDirection, world);

    // check if reload is done
    this.weapon?.checkReload(frames.gameTime);

    // default target: player
    const aimDirection = Vector.directionToTarget(
      this.position,
      player.position
    );

    // decide when to attack?
    if (Math.random() < 0.1) {
      this.weapon?.shoot(frames.gameTime, projectiles, this, aimDirection);
    }
  }
}
