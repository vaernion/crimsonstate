export class Entity {
  public position = {
    x: 0,
    y: 0,
  };
}

export class MovingEntity extends Entity {
  public movement = {
    x: 0,
    y: 0,
  };
  public movementSpeed = 5; // pixels?
}
