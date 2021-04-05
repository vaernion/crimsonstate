import { Controls } from "./controls";
import { constants } from "./data/constants";
import { EntityType } from "./data/entities";
import { style } from "./data/style";
import { WeaponName } from "./data/weapons";
import { Enemy } from "./enemy";
import { MovingEntity, Vector } from "./entity";
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
  add(consumable: Consumable) {
    if (
      this.inventory[consumable] < constants.player.consumables.max[consumable]
    ) {
      this.inventory[consumable]++;
    }
  }
}

export class Player extends MovingEntity {
  public consumables = new Consumables();
  private headSize = constants.player.headSize; // placeholder until proper images
  public type = EntityType.player;

  constructor(world: World, health: number, maxHealth: number) {
    super();
    this.name = "player";

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
    this.weapon = new Weapon(WeaponName.m4);
  }

  public update(
    controls: Controls,
    frames: GameFrames,
    world: World,
    projectiles: Set<Projectile>
  ) {
    const direction = this.getDirection(controls);
    this.move(direction, frames, world);

    // check if reload is done
    if (
      this.weapon?.isReloading &&
      this.weapon?.isReloadDone(frames.gameTime)
    ) {
      this.weapon.finishReload();
    }

    if (controls.keys.mouse1) {
      this.attack(
        controls,
        frames,
        world,
        projectiles,
        controls.aim.normalize()
      );
    }
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

  public attack(
    controls: Controls,
    frames: GameFrames,
    world: World,
    projectiles: Set<Projectile>,
    direction: Vector
  ) {
    if (this.weapon?.shoot(frames.gameTime)) {
      const projectile = new Projectile(
        this.type,
        this.name,
        new Vector(this.position.x, this.position.y),
        direction,
        this.weapon.projectileVariant,
        this.weapon.damage,
        this.weapon.penetration
      );
      projectiles.add(projectile);
    }
  }

  private getDirection(controls: Controls) {
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
