import { Controls, ControlsKeys } from "./controls";
import { GameFrames, GameState } from "./game";
import { Player } from "./player";
import { debugColor } from "./style";
import { World } from "./world";

export class Debug {
  public drawDebug(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState,
    frames: GameFrames,
    controls: Controls,
    player: Player,
    world: World
  ) {
    ctx.save();

    const visibleArea = world.visibleArea(canvas, player);

    const debugInfo = `
    ${controls.specialKeyBuffer}${
      controls.specialKeyBuffer === " " ? "space" : ""
    }
    ${controls.isMovingUp ? "w" : ""}${controls.isMovingLeft ? "a" : ""}${
      controls.isMovingDown ? "s" : ""
    }${controls.isMovingRight ? "d" : ""}
    $state ${state.hasStarted ? "started" : ""} ${state.paused ? "paused" : ""}
    $frame ${frames.count}
    $player speed:${player.speed().toFixed(2)}
    ❤️${player.health.toFixed(0)} h${player.height}w${player.width} ${
      controls.specialKeyBuffer === ControlsKeys.space ? "💣" : ""
    }
    x${player.position.x.toFixed(1)} y${player.position.y.toFixed(1)}
    vx${player.velocity.x.toFixed(1)} vy${player.velocity.y.toFixed(1)}
    ax${player.acceleration.x.toFixed(1)} ay${player.acceleration.y.toFixed(1)}
    $world ⌛${state.timeSpeed}
    ${world.width}x${world.height}
    $camera
    x${visibleArea.xStart.toFixed(1)} y${visibleArea.yStart.toFixed(1)}
    y${visibleArea.xEnd.toFixed(1)} y${visibleArea.yEnd.toFixed(1)}
    $enemies
    `;
    const debugInfoLines = debugInfo.split("\n").filter((e) => e !== "");

    ctx.fillStyle = debugColor.text;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = debugColor.shadow;
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
