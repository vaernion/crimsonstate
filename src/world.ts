import { Player } from "./player";
import { style } from "./style";

export interface VisibleArea {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  width: number;
  height: number;
}

export class World {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    (this.width = width), (this.height = height);
    this.generateWorld();
  }

  public visibleArea(canvas: HTMLCanvasElement, player: Player): VisibleArea {
    return {
      xStart: player.position.x - canvas.width / 2,
      yStart: player.position.y - canvas.height / 2,
      xEnd: player.position.x + canvas.width / 2,
      yEnd: player.position.y + canvas.height / 2,
      width: canvas.width,
      height: canvas.height,
    };
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    visibleArea: VisibleArea
  ) {
    this.drawBackground(canvas, ctx, visibleArea);
    this.drawEdge(canvas, ctx, visibleArea);
  }

  private drawBackground(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    visibleArea: VisibleArea
  ) {
    ctx.fillStyle = style.worldColor.bg;
    ctx.fillRect(0, 0, visibleArea.width, visibleArea.height);
  }

  private drawEdge(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    visibleArea: VisibleArea
  ) {
    ctx.fillStyle = style.worldColor.edge;

    // top edge
    ctx.fillRect(
      0,
      0,
      visibleArea.width,
      Math.max(0, visibleArea.height - visibleArea.yEnd)
    );

    // left edge
    ctx.fillRect(
      0,
      0,
      Math.max(0, visibleArea.width - visibleArea.xEnd),
      canvas.height
    );

    // bottom edge
    const bottomEdgeHeight = Math.min(
      visibleArea.height,
      (visibleArea.yStart - this.height) * -1
    );
    ctx.fillRect(
      0,
      bottomEdgeHeight,
      visibleArea.width,
      visibleArea.height - bottomEdgeHeight
    );

    // right edge
    const rightEdgeWidth = Math.min(
      visibleArea.width,
      (visibleArea.xStart - this.width) * -1
    );
    ctx.fillRect(
      rightEdgeWidth,
      0,
      visibleArea.width - rightEdgeWidth,
      visibleArea.height
    );
  }

  private generateWorld() {
    // PLACEHOLDER: generate random terrain and static objects
  }
}
