import { constants, enemyTypes } from "./constants";
import { Enemy } from "./enemy";
import { Entity, Vector } from "./entity";
import { GameFrames } from "./game";
import { VisibleArea, World } from "./world";

class EntityTimestamps {
  public lastEnemy: number = 0; // game time

  public isEnemyReady(frames: GameFrames): boolean {
    return this.lastEnemy + constants.enemy.spawnDelay < frames.gameTimestamp;
  }
}

export class Spawner {
  private timestamps = new EntityTimestamps();

  public generate(
    frames: GameFrames,
    visibleArea: VisibleArea,
    world: World,
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
        let enemyType = Object.values(enemyTypes)[
          Math.floor(Math.random() * Object.keys(enemyTypes).length)
        ];
        let name = `${enemyType.type}${Entity.nextId}`;
        let position = this.randomPosition(world);
        let enemy = new Enemy(enemyType, name, position);

        // force visible enemies outside visible range
        // MovingEntity.fixEdgeCollision() will ensure they remain in-bounds
        if (enemy.isVisible(visibleArea)) {
          enemy.position.x += Math.random() > 0.5 ? world.width : -world.width;
          enemy.position.y +=
            Math.random() > 0.5 ? world.height : -world.height;
        }

        enemies.add(enemy);
      }

      this.timestamps.lastEnemy = frames.gameTimestamp;
    }
  }

  public randomPosition(world: World) {
    return new Vector(
      Math.random() * world.width,
      Math.random() * world.height
    );
  }
}
