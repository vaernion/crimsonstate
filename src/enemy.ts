import { EnemyType } from "./constants";
import { MovingEntity, Vector } from "./entity";

export class Enemy extends MovingEntity {
  constructor(
    enemyType: EnemyType,
    public name: string,
    public position: Vector
  ) {
    super();
    this.type = "enemy_" + enemyType.type;
    this.width = enemyType.width;
    this.height = enemyType.height;
    this.health = enemyType.health;
    this.maxHealth = enemyType.health;
    this.color = enemyType.color;
  }
}
