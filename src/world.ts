export class World {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    (this.width = width), (this.height = height);
  }
}
