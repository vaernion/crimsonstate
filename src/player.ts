import { constants } from "./constants";
import { Controls } from "./controls";
import { MovingEntity, Vector } from "./entity";
import { GameFrames } from "./game";
import { playerColor } from "./style";
import { World } from "./world";

export class Player extends MovingEntity {
  private headSize = constants.player.headSize; // placeholder until proper images

  constructor(world: World, health: number) {
    super();
    this.position.x = world.width / 2;
    this.position.y = world.height / 2;
    this.acceleration = new Vector(
      constants.player.acceleration.x,
      constants.player.acceleration.y
    );
    this.maxSpeed = constants.player.maxSpeed;
    this.health = health;
    this.maxHealth = health;
    this.width = constants.player.width;
    this.height = constants.player.height;
  }

  public update(controls: Controls, frames: GameFrames, world: World) {
    this.move(controls, frames, world);
    // PLACEHOLDER: shoot and stuff
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

  public move(controls: Controls, frames: GameFrames, world: World) {
    const direction = this.getDirection(controls);
    this.calculatePosition(direction, frames);
    this.fixEntityCollision();
    this.fixEdgeCollision(world);
  }

  private getDirection(controls: Controls) {
    let direction = new Vector();

    // direction
    if (controls.isMovingRight) {
      direction.x += 1;
    }
    if (controls.isMovingLeft) {
      direction.x -= 1;
    }
    if (controls.isMovingUp) {
      direction.y -= 1;
    }
    if (controls.isMovingDown) {
      direction.y += 1;
    }
    direction.normalize();
    return direction;
  }

  public useAbility() {}
}
