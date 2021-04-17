import { Controls } from "./controls";
import { constants } from "./data/constants";
import { DamageVariant } from "./data/damage";
import { EntityFaction, EntityType } from "./data/entities";
import { style } from "./data/style";
import { Enemy } from "./enemy";
import { GameFrames } from "./game";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Weapon } from "./weapon";
import { VisibleArea, World } from "./world";

export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  public normalize(): Vector {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    const normalized = new Vector(this.x, this.y);
    if (magnitude) normalized.x /= magnitude;
    if (magnitude) normalized.y /= magnitude;
    return normalized;
  }

  public distance(target: Vector): number {
    return Math.hypot(this.x - target.x, this.y - target.y);
  }

  /**
   * https://gamedev.stackexchange.com/questions/69241/how-to-optimize-the-distance-function
   * @param target Vector
   * @returns number
   */
  public distanceApproximate(target: Vector): number {
    const dx = Math.abs(this.x - target.x);
    const dy = Math.abs(this.y - target.y);
    return (1007 / 1024) * Math.max(dx, dy) + (441 / 1024) * Math.min(dx, dy);
  }

  static directionToTarget(source: Vector, target: Vector): Vector {
    let distance = new Vector(target.x - source.x, target.y - source.y);
    let direction = distance.normalize();
    return direction;
  }
}

export class Entity {
  static nextId = 0;
  public id: number;
  public type: EntityType = EntityType.default;
  public faction: EntityFaction = EntityFaction.neutral;
  public name: string = "";

  public position = new Vector();
  public velocity: Vector = new Vector();
  public acceleration: Vector = new Vector(0, 0);
  public maxSpeed: number = 0;
  public width: number = 0;
  public height: number = 0;
  public color: string = "";

  public health: number = 0;
  public maxHealth: number = 0;
  public isDestroyed: boolean = false; // used by cleanup/entity removal task
  public isInvincible: boolean = false;
  public weapon?: Weapon;

  constructor() {
    this.id = Entity.nextId++;
  }

  public speed() {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
  }

  public isVisible(visibleArea: VisibleArea) {
    return (
      this.position.x + this.width / 2 >= visibleArea.xStart &&
      this.position.x - this.width / 2 <= visibleArea.xEnd &&
      this.position.y + this.height / 2 >= visibleArea.yStart &&
      this.position.y - this.height / 2 <= visibleArea.yEnd
    );
  }

  public leftSide(): number {
    return this.position.x - this.width / 2;
  }
  public rightSide(): number {
    return this.position.x + this.width / 2;
  }
  public topSide(): number {
    return this.position.y - this.height / 2;
  }
  public bottomSide(): number {
    return this.position.y + this.height / 2;
  }

  // Axis-Aligned Bounding Box
  public isCollidingWith(other: Entity): boolean {
    return (
      this.leftSide() <= other.rightSide() &&
      this.rightSide() >= other.leftSide() &&
      this.topSide() <= other.bottomSide() &&
      this.bottomSide() >= other.topSide()
    );
  }

  private isCollidingLeft(other: Entity): boolean {
    return (
      this.rightSide() - this.velocity.x < other.leftSide() &&
      this.rightSide() >= other.leftSide()
    );
  }
  private isCollidingRight(other: Entity): boolean {
    return (
      this.leftSide() - this.velocity.x >= other.rightSide() &&
      this.leftSide() < other.rightSide()
    );
  }
  private isCollidingTop(other: Entity): boolean {
    return (
      this.bottomSide() - this.velocity.y < other.topSide() &&
      this.bottomSide() >= other.topSide()
    );
  }
  private isCollidingBottom(other: Entity): boolean {
    return (
      this.topSide() - this.velocity.y >= other.bottomSide() &&
      this.topSide() < other.bottomSide()
    );
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    player: Player,
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ) {
    // default direction == player.position
    const moveDirection = Vector.directionToTarget(
      this.position,
      player.position
    );
    this.move(moveDirection, world, player, enemies);

    // PLACEHOLDER: interact with other objects
    // damage nearby stuff if hazard
    // destroy self if certain conditions met (timer?)
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
    }
  }

  public takeDamage(damage: number, damageVariant: DamageVariant) {
    // TODO: armor types/damage resistance vs damagetype and armor
    this.health -= damage;
  }

  public move(
    direction: Vector,
    world: World,
    player: Player,
    enemies: Set<Enemy>
  ) {
    if (this.maxSpeed > 0) {
      this.calculatePosition(direction);
    }
    this.detectCollisions(player, enemies);

    const collidedWithEdge = this.handleWorldEdgeCollision(world);
    if (collidedWithEdge && this.type === EntityType.projectile)
      this.isDestroyed = true;
  }

  public calculatePosition(direction: Vector) {
    // accelerate
    this.velocity.x += this.acceleration.x * direction.x;
    this.velocity.y += this.acceleration.y * direction.y;
    // friction
    this.velocity.x *= constants.friction;
    this.velocity.y *= constants.friction;

    // restrict to max speed
    if (this.speed() > this.maxSpeed) {
      this.velocity = this.velocity.normalize();
      this.velocity.x *= this.maxSpeed;
      this.velocity.y *= this.maxSpeed;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  public detectCollisions(player: Player, enemies: Set<Enemy>) {
    // colliding with player
    if (this.type !== EntityType.player && this.isCollidingWith(player)) {
      this.handleEntityCollision(player);
    }

    // colliding with enemies
    for (const enemy of enemies.values()) {
      if (this.isCollidingWith(enemy)) {
        this.handleEntityCollision(enemy);
      }
    }
  }

  protected handleEntityCollision(other: Entity) {
    if (this.isCollidingLeft(other) || this.isCollidingRight(other)) {
      this.velocity.x = -this.velocity.x;
      this.position.x += this.velocity.x;
    }
    if (this.isCollidingTop(other) || this.isCollidingBottom(other)) {
      this.velocity.y = -this.velocity.y;
      this.position.y += this.velocity.y;
    }
  }

  public handleWorldEdgeCollision(world: World): boolean {
    let collided = false;
    // left edge
    if (this.leftSide() <= 0) {
      this.position.x = this.width / 2;
      this.velocity.x = 0;
      collided = true;
    }
    // top edge
    if (this.topSide() <= 0) {
      this.position.y = this.height / 2;
      this.velocity.y = 0;
      collided = true;
    }
    // right edge
    if (this.rightSide() >= world.width) {
      this.position.x = world.width - this.width / 2;
      this.velocity.x = 0;
      collided = true;
    }
    // bottom edge
    if (this.bottomSide() >= world.height) {
      this.position.y = world.height - this.height / 2;
      this.velocity.y = 0;
      collided = true;
    }
    return collided;
  }
}
