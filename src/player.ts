import { Controls } from "./controls";
import { MovingEntity, Vector } from "./entity";
import { GameFrames } from "./game";
import { playerColor } from "./style";
import { World } from "./world";

export class Player extends MovingEntity {
  public health = 100;
  public width = 20;
  public height = 45;
  private headSize = 15;

  constructor(world: World) {
    super();
    this.position.x = world.width / 2;
    this.position.y = world.height / 2;
    this.acceleration = new Vector(0.1, 0.1);
    this.maxSpeed = 5;
  }

  public update(controls: Controls, world: World, frames: GameFrames) {
    this.move(controls, frames, world);
    // shoot
  }

  public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = playerColor.fill;
    ctx.fillRect(
      // divide by 2 to keep x and y in center of player sprite
      canvas.width / 2 - this.width / 2,
      canvas.height / 2 - this.height / 2 + this.headSize,
      this.width,
      this.height - this.headSize
    );

    // player head placeholder
    ctx.beginPath();
    ctx.strokeStyle = playerColor.outline;
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2 - this.headSize,
      this.width / 2,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  private move(controls: Controls, frames: GameFrames, world: World) {
    this.calculatePosition(controls, frames);
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }

  private calculatePosition(controls: Controls, frames: GameFrames) {
    const dtFactor = frames.dt / frames.referenceRefresh;
    const velocity = new Vector(this.velocity.x, this.velocity.y);

    // accelerate
    if (controls.isMovingRight) {
      velocity.x += this.acceleration.x;
    }
    if (controls.isMovingLeft) {
      velocity.x -= this.acceleration.x;
    }
    if (controls.isMovingUp) {
      velocity.y -= this.acceleration.y;
    }
    if (controls.isMovingDown) {
      velocity.y += this.acceleration.y;
    }

    // if (!controls.isMovingRight && !controls.isMovingLeft) {
    //   velocity.x -= Math.abs(this.acceleration.x) * Number(velocity.x >= 0);
    // }

    // if (!controls.isMovingDown && !controls.isMovingUp) {
    //   velocity.y -= Math.abs(this.acceleration.y) * Number(velocity.y >= 0);
    // }

    // console.log("velocity accelerated", velocity);

    // restrict to max speed
    if (velocity.x > this.maxSpeed) {
      velocity.x = this.maxSpeed;
    } else if (velocity.x < this.maxSpeed * -1) {
      velocity.x = this.maxSpeed * -1;
    }
    if (velocity.y > this.maxSpeed) {
      velocity.y = this.maxSpeed;
    } else if (velocity.y < this.maxSpeed * -1) {
      velocity.y = this.maxSpeed * -1;
    }

    // console.log("velocity limited", velocity);

    const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    // console.log("magnitude", magnitude);
    if (magnitude) velocity.x /= magnitude;
    if (magnitude) velocity.y /= magnitude;

    this.velocity.x = velocity.x * dtFactor * this.maxSpeed;
    this.velocity.y = velocity.y * dtFactor * this.maxSpeed;

    // console.log("velocity final", this.velocity);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
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

  public useAbility() {}
}
