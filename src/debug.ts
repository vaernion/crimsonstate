import { Controls } from "./controls";
import { GameState } from "./game";
import { Player } from "./player";
import { World } from "./world";

export class Debug {
  public drawDebug(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState,
    controls: Controls,
    player: Player,
    world: World
  ) {
    ctx.save();

    const debugInfo = `
    state ${state.hasStarted ? "started" : ""} ${state.paused ? "paused" : ""}
    player ${controls.isEscaping ? "+ESC" : ""}
    ❤️${player.health} h${player.height}w${player.width} ${
      controls.isActivatingAbility ? "💣" : ""
    }
    x${player.position.x.toFixed(1)} y${player.position.y.toFixed(1)}
    +x${player.movement.x.toFixed(1)} +y${player.movement.y.toFixed(1)}
    world
    ${world.width}x${world.height}
    enemies
    `;
    const debugInfoLines = debugInfo.split("\n").filter((e) => e !== "");

    ctx.fillStyle = "white";
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = "black";
    ctx.shadowBlur = 3;
    const fontSize = parseInt(ctx.font.split(" ")[0]) * 1.2;
    ctx.font = `${fontSize}px sans-serif`;
    for (let i = 0; i < debugInfoLines.length; i++) {
      ctx.fillText(
        debugInfoLines[i],
        canvas.width * 0.8,
        canvas.height * 0.1 + i * fontSize,
        canvas.width * 0.2 // max width, attempts to fit within limit
      );
    }
    ctx.restore(); // prevent Debug from interfering with styles of other modules
  }
}
