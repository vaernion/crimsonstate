import { constants } from "./constants";
import { Controls } from "./controls";
import { GameFrames } from "./game";
import { Player } from "./player";
import { entityColor } from "./style";
import { VisibleArea, World } from "./world";

export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  public normalize() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    if (magnitude) this.x /= magnitude;
    if (magnitude) this.y /= magnitude;
  }
}

export class Entity {
  static nextId = 0;
  public id: number;
  public type: string = "";
  public position = new Vector();
  public width: number = 0;
  public height: number = 0;
  public health: number = 0;
  public maxHealth: number = 0;
  public isInvincible: boolean = false;
  public color: string = "";

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

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    world: World,
    player: Player
  ) {
    ctx.fillStyle = entityColor.default;
    // PLACEHOLDER: draw position relative to visible area (if visible)

    // enemy actual x300y200 visiblearea x200y100 to x700y300 canvas x500y200
    // actual-visiblestart == x100y100
    // enemy actual x0y0 visiblearea x-200y-100 to x300y200 canvas x500y300
    // should be at canvas x200y100
    // actual-visiblestart == x0y0 - x(-200)y(-200) = x-200y-200

    const visibleArea = world.visibleArea(canvas, player);
    if (this.isVisible(visibleArea)) {
      ctx.fillStyle = this.color || entityColor.default;
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

  public update(controls: Controls, world: World, frames: GameFrames) {
    this.move(controls, frames, world);
    // PLACEHOLDER: interact with other objects
  }

  public move(controls: Controls, frames: GameFrames, world: World) {
    const direction = new Vector(); // PLACEHOLDER - should target player
    this.calculatePosition(direction, frames);
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }

  public calculatePosition(direction: Vector, frames: GameFrames) {
    const dtFactor = frames.dt / frames.referenceRefresh;

    // accelerate
    this.velocity.x += this.acceleration.x * direction.x;
    this.velocity.y += this.acceleration.y * direction.y;
    // friction
    this.velocity.x *= constants.friction;
    this.velocity.y *= constants.friction;

    // restrict to max speed
    if (this.speed() > this.maxSpeed) {
      this.velocity.normalize();
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
