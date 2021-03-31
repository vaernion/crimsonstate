import { constants } from "./constants";
import { Controls, ControlsKeys } from "./controls";
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

  start() {
    this.state.hasStarted = true;
    this.state.paused = false;
    this.menu.isStartingGame = false;
    this.menu.isShowingMenu = false;
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

    // restart
    if (controls.specialKeyBuffer === ControlsKeys.v) {
      return this.restart();
    }

    // change speed (time factor)
    else if (controls.specialKeyBuffer === ControlsKeys.z) {
      state.timeSpeed = state.timeSpeed > 1 ? 1.0 : 3.0;
    }
    // use ability
    else if (
      !menu.isShowingMenu &&
      !state.paused &&
      controls.specialKeyBuffer === ControlsKeys.space
    ) {
      player.useAbility();
    }
    // open level up screen
    else if (false) {
      // state.paused = true
      // state.isShowingLevelUp = true
    }
    // open menu or close level up screen
    else if (
      controls.specialKeyBuffer === ControlsKeys.esc &&
      !menu.isShowingMenu &&
      !menu.isCoolingDown(timestamp)
    ) {
      // open menu & pause
      if (state.hasStarted && !menu.isShowingMenu) {
        state.paused = true;
        menu.isShowingMenu = true;
        controls.specialKeyBuffer = "";
        menu.update(controls, timestamp, state);
        // close level up & resume
      } else if (false) {
        // state.paused = false
        // state.isShowingLevelUp = false
      }
    }
    // start
    else if (menu.isStartingGame) {
      this.start();
      return;
    }
    // menu navigation, check to ensure game wont run in background
    else if (state.paused && menu.isShowingMenu) {
      // console.count("men uupdate");
      menu.update(controls, timestamp, state);
      return;
    }

    // update delta time
    frames.dt = (timestamp - frames.lastTimestamp) * state.timeSpeed;

    // player movement
    player.update(controls, world, frames);

    // other entitites movement or triggers
    // for (const entity in staticEntities) {}
    // for (const entity in movingEntitites) {}

    // calculate ability

    // calculate damage
    // player.calculateDamage() ?
    // for (const projectile in projectiles) {}
    // for (const entity in staticEntities) {}
    // for (const entity in movingEntitites) {}

    frames.lastTimestamp = timestamp;
    frames.count++;
    controls.specialKeyBuffer = "";
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
