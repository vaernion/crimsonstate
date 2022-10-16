import { Controls } from "./controls";
import { constants } from "./data/constants";
import { DamageType, damageVariants } from "./data/damage";
import { EntityFaction, EntityType } from "./data/entities";
import { style } from "./data/style";
import { WeaponName } from "./data/weapons";
import { Enemy } from "./enemy";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Projectile } from "./projectile";
import { Weapon } from "./weapon";
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
  add(consumable: Consumable, count: number) {
    if (
      this.inventory[consumable] < constants.player.consumables.max[consumable]
    ) {
      this.inventory[consumable] += Math.min(
        count,
        constants.player.consumables.max[consumable] -
          this.inventory[consumable]
      );
    }
  }
}

export class Player extends Entity {
  public consumables = new Consumables();
  private headSize = constants.player.headSize; // placeholder until proper images

  constructor(healthMax: number, health: number, position: Vector) {
    super();
    this.type = EntityType.player;
    this.faction = EntityFaction.player;
    this.name = "player";

    this.position.x = position.x;
    this.position.y = position.y;
    this.acceleration = new Vector(
      constants.player.acceleration.x,
      constants.player.acceleration.y
    );
    this.maxSpeed = constants.player.maxSpeed;
    this.width = constants.player.width;
    this.height = constants.player.height;

    this.maxHealth = healthMax;
    this.health = health;
    this.weapon = new Weapon(WeaponName.minigun, 1);
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    player: Player,
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ) {
    const moveDirection = this.getMoveDirection(controls);
    this.move(moveDirection, world, player, enemies);

    // check if reload is done
    this.weapon?.checkReload(frames.gameTime);

    if (controls.keys.mouse1) {
      this.weapon?.shoot(
        frames.gameTime,
        projectiles,
        this,
        controls.aim.normalize()
      );
    }
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frames: GameFrames
  ) {
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
    ctx.fillStyle = style.playerColor.fill;
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2 - this.headSize,
      this.width / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  }

  private getMoveDirection(controls: Controls) {
    let direction = new Vector();

    // direction
    if (controls.keys.right) {
      direction.x += 1;
    }
    if (controls.keys.left) {
      direction.x -= 1;
    }
    if (controls.keys.up) {
      direction.y -= 1;
    }
    if (controls.keys.down) {
      direction.y += 1;
    }
    direction = direction.normalize();
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

  public useAbility(
    frames: GameFrames,
    world: World,
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ) {
    // bomb
    if (
      this.consumables.selected === Consumable.bomb &&
      this.consumables.use(Consumable.bomb)
    ) {
      enemies.forEach((enemy) => {
        if (
          this.position.distance(enemy.position) <=
          constants.player.consumables.range[Consumable.bomb]
        ) {
          enemy.takeDamage(
            constants.player.consumables.effect[Consumable.bomb],
            damageVariants[DamageType.explosive]
          );
        }
      });
      projectiles.forEach((projectile) => {
        if (
          this.position.distance(projectile.position) <=
          constants.player.consumables.range[Consumable.bomb]
        ) {
          projectiles.delete(projectile);
        }
      });
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
