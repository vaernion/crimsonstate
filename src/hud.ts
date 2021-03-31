import { Player } from "./player";
import { hudColor } from "./style";

export class HUD {
  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    player: Player
  ) {
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
