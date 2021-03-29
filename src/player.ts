import { Controls } from "./controls";
import { GameFrames } from "./game";
import { World } from "./world";

export class Player {
  public health = 100;
  private movementSpeed = 5; // pixels?
  public width = 5;
  public height = 5;
  public position = {
    x: 0,
    y: 0,
  };
  public movement = {
    x: 0,
    y: 0,
  };

  constructor() {}

  private calculateMovement(controls: Controls, frames: GameFrames) {
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

    this.movement.x = movement.x;
    this.movement.y = movement.y;

    // if (frames.count % 60 === 0) {
    //   // console.log("mag", magnitude);
    //   console.log("movFixed", movement);
    // }
  }

  private calculateCollision() {}

  public movePlayer(
    controls: Controls,
    world: World,
    frames: GameFrames,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.calculateMovement(controls, frames);
    this.position.x += this.movement.x;
    this.position.y += this.movement.y;
    if (this.position.x - this.width <= 0) {
      this.position.x = this.width;
    }
    if (this.position.y - this.height <= 0) {
      this.position.y = this.height;
    }
    if (this.position.x + this.width >= world.width) {
      this.position.x = world.width - this.width;
    }
    if (this.position.y + this.height >= world.height) {
      this.position.y = world.height - this.height;
    }
  }
}
