import { Controls } from "./controls";
import { constants } from "./data/constants";
import { EntityType } from "./data/entities";
import { style } from "./data/style";
import { GameFrames } from "./game";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Weapon } from "./weapon";
import { VisibleArea, World } from "./world";

export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  public normalize() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    const normalized = new Vector(this.x, this.y);
    if (magnitude) normalized.x /= magnitude;
    if (magnitude) normalized.y /= magnitude;
    return normalized;
  }

  static directionToTarget(source: Vector, target: Vector) {
    let distance = new Vector(target.x - source.x, target.y - source.y);
    let direction = distance.normalize();
    return direction;
  }
}

export class Entity {
  static nextId = 0;
  public id: number;
  public type: EntityType = EntityType.default;
  public name: string = "";
  public position = new Vector();
  public width: number = 0;
  public height: number = 0;
  public health: number = 0;
  public maxHealth: number = 0;
  public isDestroyed: boolean = false;
  public isInvincible: boolean = false;
  public color: string = "";
  public weapon?: Weapon;

  constructor() {
    this.id = ++Entity.nextId;
  }

  public isVisible(visibleArea: VisibleArea) {
    return (
      this.position.x + this.width / 2 >= visibleArea.xStart &&
      this.position.x - this.width / 2 <= visibleArea.xEnd &&
      this.position.y + this.height / 2 >= visibleArea.yStart &&
      this.position.y - this.height / 2 <= visibleArea.yEnd
    );
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    projectiles: Set<Projectile>,
    player: Player
  ) {
    // damage nearby stuff if hazard
    // destroy self if certain conditions met (timer?)
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    world: World,
    player: Player
  ) {
    const visibleArea = world.visibleArea(canvas, player);
    if (this.isVisible(visibleArea)) {
      ctx.fillStyle = this.color || style.entityColor.default;
      ctx.fillRect(
        this.position.x - visibleArea.xStart - this.width / 2,
        this.position.y - visibleArea.yStart - this.height / 2,
        this.width,
        this.height
      );
    }
  }
}

export class MovingEntity extends Entity {
  public velocity: Vector = new Vector();
  public acceleration: Vector = new Vector(1, 1);
  public maxSpeed: number = 1;

  public speed() {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
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
    this.move(moveDirection, frames, world);
    // PLACEHOLDER: interact with other objects
  }

  public move(direction: Vector, frames: GameFrames, world: World) {
    this.calculatePosition(direction, frames);
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }

  public calculatePosition(direction: Vector, frames: GameFrames) {
    const dtFactor = frames.dt / frames.dtFixed;

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

    this.position.x += this.velocity.x * dtFactor;
    this.position.y += this.velocity.y * dtFactor;
  }

  public fixEntityCollision() {}

  public fixEdgeCollision(world: World) {
    // left edge
    if (this.position.x - this.width / 2 <= 0) {
      this.position.x = this.width / 2;
      this.velocity.x = 0;
    }
    // top edge
    if (this.position.y - this.height / 2 <= 0) {
      this.position.y = this.height / 2;
      this.velocity.y = 0;
    }
    // right edge
    if (this.position.x + this.width / 2 >= world.width) {
      this.position.x = world.width - this.width / 2;
      this.velocity.x = 0;
    }
    // bottom edge
    if (this.position.y + this.height / 2 >= world.height) {
      this.position.y = world.height - this.height / 2;
      this.velocity.y = 0;
    }
  }
}
