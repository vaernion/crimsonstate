import { constants } from "./data/constants";
import { enemyVariants } from "./data/entities";
import { Enemy } from "./enemy";
import { Vector } from "./entity";
import { GameFrames } from "./game";
import { Player } from "./player";
import { VisibleArea, World } from "./world";

class EntityTimestamps {
  public lastEnemy: number = 0; // game time

  public isEnemyReady(frames: GameFrames): boolean {
    return this.lastEnemy + constants.enemy.spawnDelay < frames.gameTime;
  }
}

export class Spawner {
  private timestamps = new EntityTimestamps();

  public generate(
    frames: GameFrames,
    visibleArea: VisibleArea,
    world: World,
    player: Player,
    enemies: Set<Enemy>
  ) {
    this.generateEnemy(frames, visibleArea, world, enemies);
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
        let enemyVariant = Object.values(enemyVariants)[
          Math.floor(Math.random() * Object.keys(enemyVariants).length)
        ];
        let position = this.randomPosition(world);
        let enemy = new Enemy(enemyVariant, position);

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

  public randomPosition(world: World) {
    return new Vector(
      Math.random() * world.width,
      Math.random() * world.height
    );
  }
}
