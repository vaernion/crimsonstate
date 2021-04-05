import { Controls } from "./controls";
import { style } from "./data/style";
import { Enemy } from "./enemy";
import { GameFrames, GameState } from "./game";
import { Player } from "./player";
import { World } from "./world";

export class Debug {
  public showTimestamps: boolean = true;
  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState,
    frames: GameFrames,
    controls: Controls,
    world: World,
    player: Player,
    enemies: Set<Enemy>
  ) {
    ctx.save();

    const visibleArea = world.visibleArea(canvas, player);
    const aim = controls.aim.normalize();

    // this unreadable mess is shown as debuginfo by Game.draw()
    const debugInfo = `
    ${controls.keys.space ? "space" : ""} ${controls.keys.pause ? "p" : ""} ${
      controls.keys.nextAbility ? "f" : ""
    } ${controls.keys.timeSpeed ? "z" : ""}
    ${controls.keys.up ? "w" : ""}${controls.keys.left ? "a" : ""}${
      controls.keys.down ? "s" : ""
    }${controls.keys.right ? "d" : ""} ${controls.keys.mouse1 ? "m1" : ""}
    $state ${state.hasStarted ? "started" : ""} ${state.paused ? "paused" : ""}
    $frame ${frames.count} fps ${(
      (1000 / frames.dt) *
      state.timeSpeed()
    ).toFixed(1)}
    ${
      this.showTimestamps
        ? `real ${frames.realTime.toFixed(0)} game ${frames.gameTime.toFixed(
            0
          )}`
        : ""
    }
    $player speed ${player.speed().toFixed(2)}
    ❤️${player.health.toFixed(0)} h${player.height}w${player.width}
    x${player.position.x.toFixed(1)} y${player.position.y.toFixed(1)}
    vx${player.velocity.x.toFixed(1)} vy${player.velocity.y.toFixed(1)}
    ax${player.acceleration.x.toFixed(1)} ay${player.acceleration.y.toFixed(1)}
    aim x${controls.aim.x} y${controls.aim.y}
    aimN x${aim.x.toFixed(2)} y${aim.y.toFixed(2)}
    items: 💣 ${player.consumables.inventory.bomb} ❤️${
      player.consumables.inventory.medpack
    }
    $world ⌛${state.timeSpeed()}
    ${world.width}*${world.height}
    $camera
    x${visibleArea.xStart.toFixed(1)} y${visibleArea.yStart.toFixed(1)}
    y${visibleArea.xEnd.toFixed(1)} y${visibleArea.yEnd.toFixed(1)}
    $canvas ${canvas.width}*${canvas.height}
    $enemies
    ${Array.from(enemies).reduce(
      (acc, cur) => (acc += cur.isVisible(visibleArea) ? 1 : 0),
      0
    )} / ${enemies.size}
    `;
    // convert to array to have more than one line in canvas
    const debugInfoLines = debugInfo.split("\n").filter((e) => e !== "");

    ctx.fillStyle = style.debugColor.text;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = style.debugColor.shadow;
    ctx.shadowBlur = 3;
    ctx.font = style.canvasFonts.debug;
    for (let i = 0; i < debugInfoLines.length; i++) {
      ctx.fillText(
        debugInfoLines[i],
        canvas.width * 0.8,
        canvas.height * 0.1 + i * style.canvasFonts.debugSize,
        canvas.width * 0.2 // max width, attempts to fit within limit
      );
    }
    ctx.restore(); // prevent Debug from interfering with styles of other modules
  }
}
