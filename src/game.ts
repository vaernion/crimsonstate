import { Controls } from "./controls";
import { Player } from "./player";
import { World } from "./world";

export interface GameFrames {
  count: number;
  maxCount: number;
  lastTimestamp: number;
  dt: number;
  referenceRefresh: number;
}

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private controls: Controls = new Controls(document);
  private player: Player = new Player();
  private world: World = new World();

  private frames: GameFrames = {
    count: 0,
    maxCount: 100,
    lastTimestamp: 0,
    dt: 0,
    referenceRefresh: 1000 / 60,
  };

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      this.ctx = ctx;
    } else {
      throw new Error("canvas context is null");
    }
    canvas.width = width;
    canvas.height = height;
  }

  public initLoop() {
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(timestamp: DOMHighResTimeStamp) {
    this.update(timestamp);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  private update(timestamp: DOMHighResTimeStamp) {
    // skip every 7th frame to test delta
    if (this.frames.count > 0 && this.frames.count % 7 === 0) {
      this.frames.count++;
      return;
    }
    this.frames.dt = timestamp - this.frames.lastTimestamp;
    this.player.movePlayer(
      this.controls,
      this.frames,
      this.canvas.width,
      this.canvas.height
    );

    this.frames.lastTimestamp = timestamp;
    this.frames.count++;
  }

  private draw() {
    this.ctx.fillStyle = "teal";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log(this.player.position);

    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(
      // divide by 2 to keep x and y in center of player sprite
      this.player.position.x - this.player.width / 2,
      this.player.position.y - this.player.height / 2,
      this.player.width,
      this.player.height
    );

    this.ctx.beginPath();
    this.ctx.arc(
      this.player.position.x,
      this.player.position.y,
      this.player.width,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
  }
}
