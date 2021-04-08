import { Controls } from "./controls";
import { EnemyVariant, EntityType } from "./data/entities";
import { MovingEntity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Weapon } from "./weapon";
import { World } from "./world";

export class Enemy extends MovingEntity {
  public type = EntityType.enemy;

  constructor(
    enemyVariant: EnemyVariant,
    name: string,
    public position: Vector
  ) {
    super();
    this.name = "enemy_" + name;
    this.acceleration = new Vector(
      enemyVariant.acceleration,
      enemyVariant.acceleration
    );
    this.maxSpeed = enemyVariant.maxSpeed;
    this.width = enemyVariant.width;
    this.height = enemyVariant.height;
    this.health = enemyVariant.health;
    this.maxHealth = enemyVariant.health;
    this.color = enemyVariant.color;
    this.weapon = new Weapon(enemyVariant.weapon);
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
    if (true) {
      this.attack(controls, frames, world, projectiles, aimDirection);
    }
  }

  public attack(
    controls: Controls,
    frames: GameFrames,
    world: World,
    projectiles: Set<Projectile>,
    direction: Vector
  ) {
    if (this.weapon?.shoot(frames.gameTime)) {
      const projectile = new Projectile(
        this.type,
        this.name,
        new Vector(this.position.x, this.position.y),
        direction,
        this.weapon.projectileVariant,
        this.weapon.damage,
        this.weapon.penetration
      );
      projectiles.add(projectile);
    }
  }
}
