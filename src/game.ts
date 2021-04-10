import { Controls, InputsActive } from "./controls";
import { constants } from "./data/constants";
import { Debug } from "./debug";
import { Enemy } from "./enemy";
import { HUD } from "./hud";
import { Menu } from "./menu";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Spawner } from "./spawner";
import { World } from "./world";

export class GameState {
  public paused: boolean = true;
  public hasStarted: boolean = false;
  public timeSpeedCustom: number = 1.0;
  public timeSpeedWorld: number = 1.0;
  public timeSpeed = () => this.timeSpeedWorld * this.timeSpeedCustom;
}
export class GameFrames {
  public realFrames: number = 0; // total number of frames rendered
  public gameFrames: number = 0; // total number of frames simulated
  public realTime: number = 0; // real world
  public gameTime: number = 0; // ingame time
  public dt: number = 1000 / 60; // 16.67ms (60fps) per logic update
  public lag: number = 0; // accumulated dt
  public lagFraction: number = 0; // 0-0.99 into next frame
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
  private controls: Controls;
  private world: World;
  private player: Player;
  private spawner: Spawner = new Spawner();
  private enemies: Set<Enemy> = new Set();
  private projectiles: Set<Projectile> = new Set();

  constructor(canvas: HTMLCanvasElement) {
    this.world = new World(constants.world.width, constants.world.height);
    this.player = new Player(
      this.world,
      constants.player.health,
      constants.player.maxHealth
    );
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      this.ctx = ctx;
    } else {
      throw new Error("canvas context is null");
    }
    this.canvas.height = window.innerHeight * constants.canvas.heightFraction;
    this.canvas.width = this.canvas.height * constants.canvas.ratio;
    this.controls = new Controls(document, canvas);
  }

  private start() {
    this.state.hasStarted = true;
    this.menu.isStartingGame = false;
    this.menu.isShowingMenu = false;
    this.state.paused = false;
  }

  private togglePause() {
    this.state.paused = !this.state.paused;
  }

  private restart() {
    const previousRealTime = this.frames.realTime;
    const previousRealFrames = this.frames.realFrames;
    this.debug = new Debug();
    this.state = new GameState();
    this.frames = new GameFrames();
    this.frames.realTime = previousRealTime;
    this.frames.realFrames = previousRealFrames;
    this.menu = new Menu();
    this.hud = new HUD();
    this.world = new World(this.world.width, this.world.height);
    this.player = new Player(
      this.world,
      constants.player.health,
      constants.player.maxHealth
    );
    this.spawner = new Spawner();
    this.enemies = new Set();
    this.projectiles = new Set();
    this.controls.keys = new InputsActive();
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
    // console.time("update");
    this.update(
      timestamp,
      this.frames,
      this.state,
      this.menu,
      this.controls,
      this.world,
      this.player,
      this.spawner,
      this.enemies,
      this.projectiles
    );
    // console.timeEnd("update");
    // console.time("draw");
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
      this.enemies,
      this.projectiles
    );
    // console.timeEnd("draw");
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
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ): void {
    // skip certain frames mod 10 for delta time testing
    // if ([0, 1, 3, 5, 6, 7].includes(this.frames.count % 10)) {
    //   this.frames.count++;
    //   return;
    // }

    // update delta time each update
    // syncs game time to actual time passed * time speed
    // and ensures game doesn't progress while paused
    if (!state.paused) {
      frames.lag += (timestamp - frames.realTime) * state.timeSpeed();
    }
    if (frames.lag > 1000) {
      frames.lag = frames.dt; // skip game updates if too much time passes
    }
    frames.realTime = timestamp;
    frames.realFrames++;

    const visibleArea = world.visibleArea(this.canvas, player);

    // ---------- START ----------
    if (menu.isStartingGame) {
      this.start();
    }

    // ---------- HANDLE MISC KEYS ----------
    this.handleMiscKeys(state, frames, menu, controls);

    // ---------- HANDLE MENU ----------
    if (state.paused && menu.isShowingMenu) {
      menu.update(controls, frames, state);
      return;
    }

    // ---------- PLAYING ----------
    if (!state.paused && !menu.isShowingMenu) {
      // catch game logic up to render speed (fixed time step, variable rendering)
      while (frames.lag >= frames.dt) {
        frames.gameTime += frames.dt;
        frames.gameFrames++;
        frames.lag -= frames.dt;

        // player movement/actions/keys
        this.handleGameKeys(
          state,
          frames,
          menu,
          controls,
          world,
          player,
          enemies
        );
        player.update(controls, frames, world, projectiles);

        // generates new entitites if appropiate
        spawner.generate(frames, visibleArea, world, player, enemies);

        // other entitites movement/actions/triggers
        enemies.forEach((enemy) => {
          enemy.update(controls, frames, world, projectiles, player);
        });
        projectiles.forEach((projectile) => {
          projectile.update(controls, frames, world);
        });

        // remove destroyed entities

        // calculate ability
        // calculate damage
        // player.calculateDamage() ?
        // for (const entity in staticEntities) {}
        // for (const entity in movingEntitites) {}
      }
      this.frames.lagFraction = this.frames.lag / this.frames.dt;
    }
  }

  private draw(
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
    enemies: Set<Enemy>,
    projectiles: Set<Projectile>
  ): void {
    // dynamic canvas resize
    canvas.height = window.innerHeight * constants.canvas.heightFraction;
    canvas.width = canvas.height * constants.canvas.ratio;

    // menu screen
    if (menu.isShowingMenu) {
      menu.draw(canvas, ctx, state);
      // show debug over menu
      if (controls.showDebug) {
        debug.draw(
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

    // enemies
    enemies.forEach((enemy) => {
      enemy.draw(canvas, ctx, frames, world, player);
    });

    // player
    player.draw(canvas, ctx, frames);
    // PLACEHOLDER: player aim
    ctx.save();
    ctx.fillStyle = "red";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.atan2(controls.aim.y, controls.aim.x));
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.fillRect(
      canvas.width / 2,
      canvas.height / 2 - player.height / 4,
      player.height * 2,
      player.height / 2
    );
    ctx.restore();

    // other entities
    projectiles.forEach((projectile) => {
      projectile.draw(canvas, ctx, frames, world, player);
    });

    // HUD
    hud.draw(canvas, ctx, state, player);

    // debug info on top
    if (controls.showDebug) {
      debug.draw(canvas, ctx, state, frames, controls, world, player, enemies);
    }
  }

  private handleGameKeys(
    state: GameState,
    frames: GameFrames,
    menu: Menu,
    controls: Controls,
    world: World,
    player: Player,
    enemies: Set<Enemy>
  ) {
    // select next ability
    if (controls.keys.nextAbility) {
      player.selectNextAbility();
      controls.keys.nextAbility = false;
    }
    // use ability
    else if (controls.keys.space) {
      player.useAbility(frames, world, enemies);
      controls.keys.space = false;
    }
    // reload
    if (controls.keys.reload) {
      player.weapon?.startReload(frames.gameTime);
      // SOUND: select sound effect based on return value and weapon
      controls.keys.reload = false;
    }
  }

  private handleMiscKeys(
    state: GameState,
    frames: GameFrames,
    menu: Menu,
    controls: Controls
  ) {
    // // ---------- PAUSE ----------
    // can buffer key activations during pause
    // seems to not cause issues, otherwise should reset controls.keys
    if (controls.keys.pause && !menu.isShowingMenu) {
      this.togglePause();
      this.controls.keys.pause = false;
    }

    // ---------- RESTART ----------
    if (controls.keys.restart) {
      this.restart();
      return;
    }

    // change custom timespeed factor
    if (controls.keys.timeSpeed) {
      state.timeSpeedCustom =
        state.timeSpeedCustom > 1 ? 0.5 : state.timeSpeedCustom < 1 ? 1.0 : 3.0;
      controls.keys.timeSpeed = false;
    }

    // open menu or close level up screen
    if (
      controls.keys.esc &&
      !menu.isShowingMenu &&
      !menu.isCoolingDown(frames.realTime)
    ) {
      // open menu & pause
      if (state.hasStarted) {
        state.paused = true;
        menu.isShowingMenu = true;
      }
      // // close level up & resume
      // else if (state.isLevelingUp) {
      //   state.paused = false;
      //   state.isShowingLevelUp = false;
      // }
      controls.keys.esc = false;
    }
    // // open level up screen
    // else if (controls.keys.levelUp) {
    //   state.paused = true
    //   state.isShowingLevelUp = true
    // }

    // cancel loop, for debugging
    else if (controls.keys.cancelGameLoop) {
      this.cancelLoop();
      console.log("frames", this.frames);
      console.log("world", this.world);
      console.log("player", this.player);
      console.table(this.enemies);
      // console.table(this.projectiles);
      console.log("projectiles remaining:", this.projectiles.size);
      controls.keys.cancelGameLoop = false;
    }
    // log enemies, for debugging
    else if (controls.keys.logEnemies) {
      console.log(this.enemies);
      controls.keys.logEnemies = false;
    }
  }
}
