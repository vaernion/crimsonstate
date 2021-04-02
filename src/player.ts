import { constants } from "./constants";
import { Controls } from "./controls";
import { Enemy } from "./enemy";
import { MovingEntity, Vector } from "./entity";
import { GameFrames } from "./game";
import { style } from "./style";
import { World } from "./world";

enum Consumable {
  bomb = "bomb",
  medpack = "medpack",
}

class Consumables {
  public selected: Consumable = Consumable.bomb;
  public inventory = {
    bomb: constants.player.consumables.initial.bomb,
    medpack: constants.player.consumables.initial.medpack,
  };

  use(consumable: Consumable) {
    if (this.inventory[consumable] > 0) {
      this.inventory[consumable]--;
      return true;
    }
    return false;
  }
  add(consumable: Consumable) {
    if (
      this.inventory[consumable] < constants.player.consumables.max[consumable]
    ) {
      this.inventory[consumable]++;
    }
  }
}

export class Player extends MovingEntity {
  private headSize = constants.player.headSize; // placeholder until proper images
  public consumables = new Consumables();

  constructor(world: World, health: number, maxHealth: number) {
    super();
    this.position.x = world.width / 2;
    this.position.y = world.height / 2;
    this.acceleration = new Vector(
      constants.player.acceleration.x,
      constants.player.acceleration.y
    );
    this.maxSpeed = constants.player.maxSpeed;
    this.health = health;
    this.maxHealth = maxHealth;
    this.width = constants.player.width;
    this.height = constants.player.height;
  }

  public update(controls: Controls, frames: GameFrames, world: World) {
    this.move(controls, frames, world);
    // PLACEHOLDER: shoot and stuff
  }

  public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = style.playerColor.fill;
    ctx.fillRect(
      // divide by 2 to keep x and y in center of player sprite
      canvas.width / 2 - this.width / 2,
      canvas.height / 2 - this.height / 2 + this.headSize,
      this.width,
      this.height - this.headSize
    );

    // player head placeholder
    ctx.beginPath();
    ctx.strokeStyle = style.playerColor.outline;
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

  public selectNextAbility() {
    const consumables = Object.keys(this.consumables.inventory) as Consumable[];
    const consumableIndex = consumables.indexOf(this.consumables.selected);
    const nextConsumable: Consumable =
      consumables[
        consumableIndex === consumables.length - 1 ? 0 : consumableIndex + 1
      ];
    this.consumables.selected = nextConsumable;
  }

  public useAbility(frames: GameFrames, world: World, enemies: Set<Enemy>) {
    // bomb
    if (
      this.consumables.selected === Consumable.bomb &&
      this.consumables.use(Consumable.bomb)
    ) {
      enemies.clear();
      // PLACEHOLDER: screen clear ability visuals/feedback
      // add effect to set of effects
      // include gameTimestamp as effect property so it can be removed later
      // world.effects.add(new Particle/Explosion/Something, )
    }
    // medpack
    else if (
      this.consumables.selected === Consumable.medpack &&
      this.health < this.maxHealth && // be nice and avoid wasted medpacks
      this.consumables.use(Consumable.medpack)
    ) {
      this.health += constants.player.consumables.effect.medpack;
      if (this.health > this.maxHealth) this.health = this.maxHealth;
    }
  }
}
