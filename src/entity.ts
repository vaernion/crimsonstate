import { Controls } from "./controls";
import { GameFrames } from "./game";
import { enemyColor } from "./style";
import { World } from "./world";

export class Vector {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Entity {
  public position = {
    x: 0,
    y: 0,
  };
  public width: number = 0;
  public height: number = 0;
  public health: number = 0;
  public maxHealth: number = 0;
  public isInvincible: boolean = false;
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

  public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = enemyColor.fill;
    // PLACEHOLDER: draw position relative to visible area (if visible)
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  public move(controls: Controls, frames: GameFrames, world: World) {
    const direction = new Vector(); // PLACEHOLDER - should target player
    this.calculatePosition(direction, frames);
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }

  public calculatePosition(direction: Vector, frames: GameFrames) {
    const dtFactor = frames.dt / frames.referenceRefresh;

    // friction

    // if (!controls.isMovingRight && !controls.isMovingLeft) {
    //   velocity.x -= Math.abs(this.acceleration.x) * Number(velocity.x >= 0);
    // }

    // if (!controls.isMovingDown && !controls.isMovingUp) {
    //   velocity.y -= Math.abs(this.acceleration.y) * Number(velocity.y >= 0);
    // }

    // accelerate
    this.velocity.x += this.acceleration.x * direction.x;
    this.velocity.y += this.acceleration.y * direction.y;

    // restrict to max speed
    if (this.speed() > this.maxSpeed) {
      const restrictedVector = this.normalizeVectorMagnitude(this.velocity);
      restrictedVector.x *= this.maxSpeed;
      restrictedVector.y *= this.maxSpeed;
      this.velocity = restrictedVector;
    }

    this.position.x += this.velocity.x * dtFactor;
    this.position.y += this.velocity.y * dtFactor;
  }

  public fixEntityCollision() {}

  public fixEdgeCollision(world: World) {
    // left edge
    if (this.position.x + this.width / 2 - this.width <= 0) {
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

  public normalizeVectorMagnitude(vector: Vector) {
    const newVector = new Vector();
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    // console.log("magnitude", magnitude);
    if (magnitude) newVector.x = vector.x / magnitude;
    if (magnitude) newVector.y = vector.y / magnitude;
    return newVector;
  }
}
