import { canvasHeightFraction, canvasWidthFraction } from ".";
import { Controls } from "./controls";
import { Debug } from "./debug";
import { Menu } from "./menu";
import { Player } from "./player";
import { World } from "./world";

export interface GameFrames {
  count: number;
  // maxCount: number;
  lastTimestamp: number;
  dt: number;
  referenceRefresh: number;
}
export interface GameState {
  paused: boolean;
  hasStarted: boolean;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private debug = new Debug();

  private menu: Menu = new Menu();
  private controls: Controls = new Controls(document);
  private player: Player = new Player();
  private world: World;

  private state: GameState = {
    paused: true,
    hasStarted: false,
  };
  private frames: GameFrames = {
    count: 0,
    // maxCount: 100,
    lastTimestamp: 0,
    dt: 0,
    referenceRefresh: 1000 / 60,
  };

  constructor(
    canvas: HTMLCanvasElement,
    canvasWidth: number,
    canvasHeight: number,
    worldWidth: number,
    worldHeight: number
  ) {
    this.world = new World(worldWidth, worldHeight);
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      this.ctx = ctx;
    } else {
      throw new Error("canvas context is null");
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  pause() {
    this.state.paused = !this.state.paused;
  }

  restart() {
    this.controls = new Controls(document);
    this.player = new Player();
    this.world = new World(this.world.width, this.world.height);
  }

  public initLoop() {
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(timestamp: DOMHighResTimeStamp): void {
    this.update(
      timestamp,
      this.canvas,
      this.frames,
      this.state,
      this.controls,
      this.menu,
      this.player,
      this.world
    );
    this.draw(
      this.canvas,
      this.ctx,
      this.debug,
      this.state,
      this.controls,
      this.menu,
      this.player,
      this.world
    );
    requestAnimationFrame(this.loop.bind(this));
  }

  private update(
    timestamp: DOMHighResTimeStamp,
    canvas: HTMLCanvasElement,
    frames: GameFrames,
    state: GameState,
    controls: Controls,
    menu: Menu,
    player: Player,
    world: World
  ): void {
    // skip certain frames mod 10 for delta time testing
    // if ([0, 1, 3, 5, 6, 7].includes(this.frames.count % 10)) {
    //   this.frames.count++;
    //   return;
    // }

    if (controls.isRestarting) {
      this.restart();
    }

    if (controls.isEscaping) {
      // open pause menu
      if (state.hasStarted && !state.paused) {
        state.paused = true;
        menu.isShowingMenu = true;
        controls.isActivatingAbility = false;
      } else if (state.paused && menu.isShowingMenu) {
        // go back one step here, add condition in previous block
        controls.isEscaping = false;
      }
    }

    // redundant check to ensure game wont run in background
    if (state.paused && menu.isShowingMenu) {
      menu.update(controls, timestamp);
      if (menu.isStartingGame) {
        state.hasStarted = true;
        state.paused = false;
        menu.isStartingGame = false;
        menu.isShowingMenu = false;
        controls.isEscaping = false;
      }
      return;
    }

    // player movement
    frames.dt = timestamp - frames.lastTimestamp;
    player.movePlayer(controls, world, frames, canvas.width, canvas.height);

    frames.lastTimestamp = timestamp;
    frames.count++;
  }

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    debug: Debug,
    state: GameState,
    controls: Controls,
    menu: Menu,
    player: Player,
    world: World
  ): void {
    // dynamic resize
    canvas.width = window.innerWidth * canvasWidthFraction;
    canvas.height = window.innerHeight * canvasHeightFraction;

    // menu screen
    if (menu.isShowingMenu) {
      menu.draw(canvas, ctx, state);
      if (controls.showDebug) {
        debug.drawDebug(canvas, ctx, state, controls, player, world);
      }
      return;
    }
    // background
    ctx.fillStyle = "teal";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // world edge
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 0, 0); // top
    ctx.fillRect(0, world.height, world.width, world.height); // bottom
    ctx.fillRect(0, 0, 0, 0); // left
    ctx.fillRect(world.width, 0, 10000, 10000); // right

    // debug info
    if (controls.showDebug) {
      debug.drawDebug(canvas, ctx, state, controls, player, world);
    }

    // player
    ctx.fillStyle = "yellow";
    ctx.fillRect(
      // divide by 2 to keep x and y in center of player sprite
      player.position.x - player.width / 2,
      player.position.y - player.height / 2,
      player.width,
      player.height
    );

    // player outline
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(player.position.x, player.position.y, player.width, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
