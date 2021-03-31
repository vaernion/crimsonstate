import { constants } from "./constants";
import { Controls } from "./controls";
import { Debug } from "./debug";
import { HUD } from "./hud";
import { Menu } from "./menu";
import { Player } from "./player";
import { World } from "./world";

export class GameState {
  public paused: boolean = true;
  public hasStarted: boolean = false;
  public timeSpeed: number = 2.0;
}
export class GameFrames {
  public count: number = 0;
  public lastTimestamp: DOMHighResTimeStamp = 0;
  public dt: number = 0; // ms
  public referenceRefresh: number = 1000 / 60; // 16.67ms 60fps
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private debug: Debug = new Debug();
  private state: GameState = new GameState();
  private frames: GameFrames = new GameFrames();

  private menu: Menu = new Menu();
  private hud: HUD = new HUD();
  private controls: Controls = new Controls(document);
  private world: World;
  private player: Player;

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
    this.debug = new Debug();
    this.state = new GameState();
    this.frames = new GameFrames();
    this.menu = new Menu();
    this.hud = new HUD();
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
      this.menu,
      this.controls,
      this.world,
      this.player
    );
    this.draw(
      this.canvas,
      this.ctx,
      this.debug,
      this.state,
      this.menu,
      this.hud,
      this.controls,
      this.world,
      this.player
    );
    requestAnimationFrame(this.loop.bind(this));
  }

  private update(
    timestamp: DOMHighResTimeStamp,
    canvas: HTMLCanvasElement,
    frames: GameFrames,
    state: GameState,
    menu: Menu,
    controls: Controls,
    world: World,
    player: Player
  ): void {
    // skip certain frames mod 10 for delta time testing
    // if ([0, 1, 3, 5, 6, 7].includes(this.frames.count % 10)) {
    //   this.frames.count++;
    //   return;
    // }

    if (controls.isRestarting) {
      return this.restart();
    }

    if (controls.isSpeeding) {
      state.timeSpeed = state.timeSpeed > 1 ? 1.0 : 2.0;
      controls.isSpeeding = false;
    }

    // pause or exit menu depending on context
    if (controls.isEscaping) {
      // open pause menu
      if (state.hasStarted && !state.paused) {
        state.paused = true;
        menu.isShowingMenu = true;
        controls.isActivatingAbility = false;
        // navigate menu
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

    // update delta time
    frames.dt = (timestamp - frames.lastTimestamp) * state.timeSpeed;

    // player movement
    player.update(controls, world, frames);

    // other entitites movement
    // for (const entity in staticEntities) {}
    // for (const entity in movingEntitites) {}

    // calculate damage
    // player.calculateDamage() ?
    // for (const projectile in projectiles) {}
    // for (const entity in staticEntities) {}
    // for (const entity in movingEntitites) {}

    frames.lastTimestamp = timestamp;
    frames.count++;
  }

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    debug: Debug,
    state: GameState,
    menu: Menu,
    hud: HUD,
    controls: Controls,
    world: World,
    player: Player
  ): void {
    // dynamic canvas resize
    canvas.width = window.innerWidth * constants.canvasWidthFraction;
    canvas.height = window.innerHeight * constants.canvasHeightFraction;

    // menu screen
    if (menu.isShowingMenu) {
      menu.draw(canvas, ctx, state);
      if (controls.showDebug) {
        debug.drawDebug(canvas, ctx, state, controls, player, world);
      }
      return;
    }

    // used for centering camera on player
    const visibleArea = world.visibleArea(canvas, player);

    // world background and edge
    world.draw(canvas, ctx, visibleArea);

    // debug info
    if (controls.showDebug) {
      debug.drawDebug(canvas, ctx, state, controls, player, world);
    }

    // static entitities

    // moving entitites

    // player
    player.draw(canvas, ctx);

    // HUD
    hud.draw(canvas, ctx, player);
  }
}
