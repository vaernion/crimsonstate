import { Controls } from "./controls";
import { MovingEntity } from "./entity";
import { GameFrames } from "./game";
import { World } from "./world";

export class Player extends MovingEntity {
  public health = 100;
  public width = 20;
  public height = 30;

  constructor(world: World) {
    super();
    this.position.x = world.width / 2;
    this.position.y = world.height / 2;
    this.movementSpeed = 15;
  }

  private calculateVelocity(controls: Controls, frames: GameFrames) {
    const dtFactor = frames.dt / 1000;
    const movement = { x: 0, y: 0 };

    if (controls.isMovingRight) {
      movement.x += dtFactor;
    }
    if (controls.isMovingLeft) {
      movement.x -= dtFactor;
    }
    if (controls.isMovingUp) {
      movement.y -= dtFactor;
    }
    if (controls.isMovingDown) {
      movement.y += dtFactor;
    }

    // if (frames.count % 60 === 0) {
    //   console.clear();
    //   console.log("dt", frames.dt, "dtFactor", dtFactor);
    //   console.log("controls", controls);
    //   console.log("movRaw", movement);
    // }

    const magnitude = Math.sqrt(movement.x ** 2 + movement.y ** 2);
    if (magnitude) movement.x /= magnitude;
    if (magnitude) movement.y /= magnitude;
    movement.x *= (this.movementSpeed * frames.dt) / frames.referenceRefresh;
    movement.y *= (this.movementSpeed * frames.dt) / frames.referenceRefresh;

    this.velocity.x = movement.x;
    this.velocity.y = movement.y;

    // if (frames.count % 60 === 0) {
    //   // console.log("mag", magnitude);
    //   console.log("movFixed", movement);
    // }
  }

  private fixEntityCollision() {}

  private fixEdgeCollision(world: World) {
    // left edge
    if (this.position.x + this.width / 2 - this.width <= 0) {
      this.position.x = this.width / 2;
    }
    // top edge
    if (this.position.y - this.height / 2 <= 0) {
      this.position.y = this.height / 2;
    }
    // right edge
    if (this.position.x + this.width / 2 >= world.width) {
      this.position.x = world.width - this.width / 2;
    }
    // bottom edge
    if (this.position.y + this.height / 2 >= world.height) {
      this.position.y = world.height - this.height / 2;
    }
  }

  public move(controls: Controls, world: World, frames: GameFrames) {
    this.calculateVelocity(controls, frames);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }
}
