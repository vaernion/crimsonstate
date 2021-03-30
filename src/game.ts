import { canvasHeightFraction, canvasWidthFraction } from ".";
import { Controls } from "./controls";
import { Debug } from "./debug";
import { Menu } from "./menu";
import { Player } from "./player";
import { hudColor, playerColor, worldColor } from "./style";
import { World } from "./world";

export interface GameFrames {
  count: number;
  lastTimestamp: number;
  dt: number;
  referenceRefresh: number;
}
export interface GameState {
  paused: boolean;
  hasStarted: boolean;
  timeSpeed: number;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private debug = new Debug();

  private menu: Menu = new Menu();
  private controls: Controls = new Controls(document);
  private world: World;
  private player: Player;

  private state: GameState = {
    paused: true,
    hasStarted: false,
    timeSpeed: 2.0, // for slow motion & configurable game speed
  };
  private frames: GameFrames = {
    count: 0,
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
    this.player = new Player(this.world);
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
    this.world = new World(this.world.width, this.world.height);
    this.player = new Player(this.world);
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
      this.world,
      this.restart.bind(this)
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
    world: World,
    restart: () => void
  ): void {
    // skip certain frames mod 10 for delta time testing
    // if ([0, 1, 3, 5, 6, 7].includes(this.frames.count % 10)) {
    //   this.frames.count++;
    //   return;
    // }

    if (controls.isRestarting) {
      restart();
    }

    if (controls.isSpeeding) {
      state.timeSpeed = state.timeSpeed > 1 ? 1.0 : 2.0;
      controls.isSpeeding = false;
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

    // delta time
    frames.dt = (timestamp - frames.lastTimestamp) * state.timeSpeed;

    // player movement
    player.move(controls, world, frames);

    // other entitites movement

    // calculate damage

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

    // canvas x600y400
    // world 1000x1000
    // player x500 y500 (center)
    // top left - x: 500 - canvas.x/2 == 200, y: 500 - canvas.y/2 == 300
    // bottom right: x: 500 + canvas.x/2 = 800, y: 500 + canvas.y/2 = 700
    // desired visible area: x200y300 to x800y700

    // used for centering camera on player
    const visibleArea = world.visibleArea(canvas, player);

    // background
    ctx.fillStyle = worldColor.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // world edge
    ctx.fillStyle = worldColor.edge;

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
      (visibleArea.yStart - world.height) * -1
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
      (visibleArea.xStart - world.width) * -1
    );
    ctx.fillRect(
      rightEdgeWidth,
      0,
      visibleArea.width - rightEdgeWidth,
      visibleArea.height
    );

    // debug info
    if (controls.showDebug) {
      debug.drawDebug(canvas, ctx, state, controls, player, world);
    }

    // player
    ctx.fillStyle = playerColor.fill;
    ctx.fillRect(
      // divide by 2 to keep x and y in center of player sprite
      canvas.width / 2 - player.width / 2,
      canvas.height / 2 - player.height / 2,
      player.width,
      player.height
    );

    // player outline
    ctx.beginPath();
    ctx.strokeStyle = playerColor.outline;
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      player.width / 2,
      0,
      2 * Math.PI
    );
    ctx.stroke();

    // HUD
    // health (display around player?)
    ctx.fillStyle = hudColor.health;
    ctx.fillRect(
      canvas.width * 0.03,
      canvas.height * 0.03,
      canvas.width * 0.03,
      canvas.width * 0.03
    );
    ctx.fillText(
      player.health.toFixed(0),
      canvas.width * 0.03,
      canvas.height * 0.03 + canvas.width * 0.05
    );
    // weapon
    //ability?
  }
}
