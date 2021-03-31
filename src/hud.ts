import { GameState } from "./game";
import { Player } from "./player";
import { hudColor } from "./style";

export class HUD {
  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState,
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

    // PAUSED
    if (state.paused) {
      ctx.fillStyle = hudColor.pauseBox;
      ctx.fillRect(canvas.width * 0.5, canvas.height * 0.2, 100, 200);
      ctx.fillStyle = hudColor.pauseText;
      ctx.fillText("PAUSED", canvas.width * 0.5, canvas.height * 0.2);
    }
  }
}
