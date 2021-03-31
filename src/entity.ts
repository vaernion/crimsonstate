export class Vector {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Entity {
  public position = {
    x: 0,
    y: 0,
  };
}

export class MovingEntity extends Entity {
  public velocity: Vector = new Vector();
  public acceleration: Vector = new Vector(1, 1);
  public maxSpeed = 1;
}
