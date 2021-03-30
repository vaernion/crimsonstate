import { Player } from "./player";

export class World {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    (this.width = width), (this.height = height);
  }

  public visibleArea(canvas: HTMLCanvasElement, player: Player) {
    return {
      xStart: player.position.x - canvas.width / 2,
      yStart: player.position.y - canvas.height / 2,
      xEnd: player.position.x + canvas.width / 2,
      yEnd: player.position.y + canvas.height / 2,
      width: canvas.width,
      height: canvas.height,
    };
  }
}
