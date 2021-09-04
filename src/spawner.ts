import { constants } from "./data/constants";
import { enemyVariants, EntityType } from "./data/entities";
import { weaponVariants } from "./data/weapons";
import { Enemy } from "./enemy";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { WeaponPickup } from "./weapon";
import { VisibleArea, World } from "./world";

class EntityTimestamps {
  public lastEnemy: number = 0; // game time
  public lastWeapon: number = 0;

  public isEnemyReady(frames: GameFrames): boolean {
    return this.lastEnemy + constants.enemy.spawnDelay < frames.gameTime;
  }

  public isWeaponReady(frames: GameFrames): boolean {
    return (
      this.lastWeapon + constants.weaponSpawns.spawnDelay < frames.gameTime
    );
  }
}

export class Spawner {
  private timestamps = new EntityTimestamps();

  public generate(
    frames: GameFrames,
    visibleArea: VisibleArea,
    world: World,
    player: Player,
    enemies: Set<Enemy>,
    staticEntities: Set<Entity>
  ) {
    this.generateEnemy(frames, visibleArea, world, enemies);
    this.generateWeapon(frames, visibleArea, world, staticEntities);
  }

  private generateEnemy(
    frames: GameFrames,
    visibleArea: VisibleArea,
    world: World,
    enemies: Set<Enemy>
  ) {
    if (
      this.timestamps.isEnemyReady(frames) &&
      enemies.size < constants.enemy.maxCount
    ) {
      for (
        let i = 0;
        enemies.size < constants.enemy.maxCount &&
        i < constants.enemy.spawnGroup;
        i++
      ) {
        // PLACEHOLDER: unweighted random enemy selection
        const enemyVariant =
          Object.values(enemyVariants)[
            Math.floor(Math.random() * Object.keys(enemyVariants).length)
          ];
        // const enemyVariant = enemyVariants.slow;
        const position = this.randomPosition(world);
        const enemy = new Enemy(enemyVariant, position);

        // force visible enemies outside visible range
        // MovingEntity.fixEdgeCollision() will ensure they remain in-bounds
        if (enemy.isVisible(visibleArea)) {
          enemy.position.x += Math.random() > 0.5 ? world.width : -world.width;
          enemy.position.y +=
            Math.random() > 0.5 ? world.height : -world.height;
        }

        enemies.add(enemy);
      }

      this.timestamps.lastEnemy = frames.gameTime;
    }
  }

  private generateWeapon(
    frames: GameFrames,
    visibleArea: VisibleArea,
    world: World,
    staticEntities: Set<Entity>
  ) {
    if (
      this.timestamps.isWeaponReady(frames) &&
      Array.from(staticEntities.values()).filter(
        (e) => e.type === EntityType.weaponPickup
      ).length < constants.weaponSpawns.maxCount
    ) {
      // TODO: weapon rarity weighting or other spawn criteria
      const weaponVariant =
        Object.values(weaponVariants)[
          Math.floor(Math.random() * Object.keys(weaponVariants).length)
        ];
      const ammoFraction = 0.5;
      const position = this.randomPosition(world);
      const weaponPickup = new WeaponPickup(
        weaponVariant.name,
        ammoFraction,
        position
      );

      staticEntities.add(weaponPickup);
      this.timestamps.lastWeapon = frames.gameTime;
    }
  }

  public randomPosition(world: World) {
    return new Vector(
      Math.random() * world.width,
      Math.random() * world.height
    );
  }
}
