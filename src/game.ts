import { constants } from "./constants";
import { Controls, ControlsKeys } from "./controls";
import { Debug } from "./debug";
import { Enemy } from "./enemy";
import { HUD } from "./hud";
import { Menu } from "./menu";
import { Player } from "./player";
import { Spawner } from "./spawner";
import { World } from "./world";

export class GameState {
  public paused: boolean = true;
  public hasStarted: boolean = false;
  public timeSpeed: number = 1.0;
}
export class GameFrames {
  public count: number = 0; // total number
  public realTimestamp: DOMHighResTimeStamp = 0; // real world
  public gameTimestamp: number = 0; // ingame time
  public dt: number = 0; // ms
  public referenceRefresh: number = 1000 / 60; // 16.67ms 60fps
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameRequestId: number = 0;

  private debug: Debug = new Debug();
  private state: GameState = new GameState();
  private frames: GameFrames = new GameFrames();

  private menu: Menu = new Menu();
  private hud: HUD = new HUD();
  private controls: Controls = new Controls(document);
  private world: World;
  private player: Player;
  private spawner: Spawner = new Spawner();
  private enemies: Set<Enemy> = new Set();

  constructor(
    canvas: HTMLCanvasElement,
    canvasWidth: number,
    canvasHeight: number,
    worldWidth: number,
    worldHeight: number
  ) {
    this.world = new World(worldWidth, worldHeight);
    this.player = new Player(this.world, constants.player.health);
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
    this.controls.specialKeyBuffer = "";
  }

  restart() {
    this.debug = new Debug();
    this.state = new GameState();
    this.frames = new GameFrames();
    this.menu = new Menu();
    this.hud = new HUD();
    this.world = new World(this.world.width, this.world.height);
    this.player = new Player(this.world, constants.player.health);
    this.spawner = new Spawner();
    this.enemies = new Set();
  }

  public initLoop() {
    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
  }

  private cancelLoop() {
    cancelAnimationFrame(this.animationFrameRequestId);
  }

  private loop(timestamp: DOMHighResTimeStamp): void {
    // cancelAnimationFrame() does not work if request is at end
    this.animationFrameRequestId = requestAnimationFrame(this.loop.bind(this));
    this.update(
      timestamp,
      this.frames,
      this.state,
      this.menu,
      this.controls,
      this.world,
      this.player,
      this.spawner,
      this.enemies
    );
    this.draw(
      this.canvas,
      this.ctx,
      this.debug,
      this.state,
      this.frames,
      this.menu,
      this.hud,
      this.controls,
      this.world,
      this.player,
      this.enemies
    );
  }

  private update(
    timestamp: DOMHighResTimeStamp,
    frames: GameFrames,
    state: GameState,
    menu: Menu,
    controls: Controls,
    world: World,
    player: Player,
    spawner: Spawner,
    enemies: Set<Enemy>
  ): void {
    // skip certain frames mod 10 for delta time testing
    // if ([0, 1, 3, 5, 6, 7].includes(this.frames.count % 10)) {
    //   this.frames.count++;
    //   return;
    // }

    // update delta time each update
    // syncs game time to actual time passed * time speed
    // and ensures game doesn't progress while paused
    frames.dt = (timestamp - frames.realTimestamp) * state.timeSpeed;
    const gameSpeedDelta = (timestamp - frames.realTimestamp) * state.timeSpeed;
    frames.realTimestamp = timestamp;

    const visibleArea = world.visibleArea(this.canvas, player);

    // ---------- PAUSE ----------
    if (controls.specialKeyBuffer === ControlsKeys.p && !menu.isShowingMenu) {
      this.pause();
    }

    // ---------- START ----------
    else if (menu.isStartingGame) {
      this.start();
    }

    // ---------- HANDLE SPECIALKEYBUFFER ----------
    if (!menu.isShowingMenu) {
      this.handleSpecialKeys(timestamp, state, menu, controls, player);
    }
    // ---------- HANDLE MENU ----------
    else {
      menu.update(controls, timestamp, state);
      return; // prevents timing bugs caused if specialKeyBuffer is emptied
    }

    // ---------- PLAYING ----------
    if (!state.paused) {
      frames.gameTimestamp += gameSpeedDelta;
      frames.count++;

      // player movement/actions
      player.update(controls, frames, world);

      // generates new entitites if appropiate
      spawner.generate(frames, visibleArea, world, enemies);

      // other entitites movement/actions/triggers
      enemies.forEach((enemy) => {
        enemy.update(controls, frames, world, player);
      });

      // calculate ability

      // calculate damage
      // player.calculateDamage() ?
      // for (const projectile in projectiles) {}
      // for (const entity in staticEntities) {}
      // for (const entity in movingEntitites) {}
    }

    controls.specialKeyBuffer = "";
  }

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    debug: Debug,
    state: GameState,
    frames: GameFrames,
    menu: Menu,
    hud: HUD,
    controls: Controls,
    world: World,
    player: Player,
    enemies: Set<Enemy>
  ): void {
    // dynamic canvas resize
    canvas.width = window.innerWidth * constants.canvasWidthFraction;
    canvas.height = window.innerHeight * constants.canvasHeightFraction;

    // menu screen
    if (menu.isShowingMenu) {
      menu.draw(canvas, ctx, state);
      // show debug over menu
      if (controls.showDebug) {
        debug.drawDebug(
          canvas,
          ctx,
          state,
          frames,
          controls,
          world,
          player,
          enemies
        );
      }
      return;
    }

    // used for centering camera on player
    const visibleArea = world.visibleArea(canvas, player);

    // world background and edge
    world.draw(canvas, ctx, visibleArea);

    // static entitities

    // moving entitites

    // let i = 0;
    enemies.forEach((enemy) => {
      enemy.draw(canvas, ctx, world, player);
      // if (enemy.isVisible(visibleArea)) {
      //   i++;
      // }
    });
    // console.log("visible:", i);

    // console.log(enemies);
    // cancelAnimationFrame(this.animationFrameRequestId);

    // player
    player.draw(canvas, ctx);

    // HUD
    hud.draw(canvas, ctx, state, player);

    // debug info on top
    if (controls.showDebug) {
      debug.drawDebug(
        canvas,
        ctx,
        state,
        frames,
        controls,
        world,
        player,
        enemies
      );
    }
  }

  private handleSpecialKeys(
    timestamp: DOMHighResTimeStamp,
    state: GameState,
    menu: Menu,
    controls: Controls,
    player: Player
  ) {
    // console.log(controls.specialKeyBuffer);
    if (controls.specialKeyBuffer === ControlsKeys.v) {
      this.restart();
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
      if (state.hasStarted) {
        state.paused = true;
        menu.isShowingMenu = true;
        controls.specialKeyBuffer = "";
        // close level up & resume
      } else if (false) {
        // state.paused = false
        // state.isShowingLevelUp = false
      }
    }
    // cancel loop, for debugging
    else if (controls.specialKeyBuffer === ControlsKeys.zero) {
      this.cancelLoop();
      console.log("world", this.world);
      console.log("player", this.player);
      console.table(this.enemies);
    }
    // show enemies, for debugging
    else if (controls.specialKeyBuffer === ControlsKeys.one) {
      console.log(this.enemies);
    }
    controls.specialKeyBuffer = "";
  }
}
