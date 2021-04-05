import { style } from "./data/style";
import { GameState } from "./game";
import { Player } from "./player";

export class HUD {
  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState,
    player: Player
  ) {
    ctx.save();

    // PLACEHOLDER: round corners
    // var cornerRadius = 20;
    // context.lineJoin = "round";
    // context.lineWidth = cornerRadius;
    // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
    // context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    //context.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);

    // health
    ctx.fillStyle = style.hudColor.healthBg;
    ctx.globalAlpha = style.hud.alpha;
    ctx.fillRect(
      canvas.width * 0.03,
      canvas.height * 0.08,
      canvas.width * 0.1,
      canvas.height * 0.04
    );
    ctx.globalAlpha = 1;

    ctx.fillStyle =
      player.health <= player.maxHealth * 0.25
        ? style.hudColor.healthLow
        : player.health <= player.maxHealth * 0.9
        ? style.hudColor.healthMed
        : style.hudColor.healthMax;
    ctx.font = style.canvasFonts.hud;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      `❤️ ${player.health.toFixed(0)} / ${player.maxHealth.toFixed(0)}`,
      canvas.width * 0.08,
      canvas.height * 0.1,
      canvas.width * 0.1
    );

    // weapon
    ctx.fillStyle = style.hudColor.weaponBg;
    ctx.globalAlpha = style.hud.alpha;
    ctx.fillRect(
      canvas.width * 0.8,
      canvas.height * 0.8,
      canvas.width * 0.15,
      canvas.height * 0.08
    );
    ctx.globalAlpha = 1;
    ctx.fillStyle = style.hudColor.weapon;
    ctx.font = style.canvasFonts.hud;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      `${player.weapon?.variant}`,
      canvas.width * 0.875,
      canvas.height * 0.82
    );
    ctx.textAlign = "start";
    ctx.fillText(
      `${
        player.weapon?.isReloading
          ? "reloading"
          : `${player.weapon?.magazine} / ${player.weapon?.magazineMax}`
      }`,
      canvas.width * 0.82,
      canvas.height * 0.85
    );
    ctx.fillText(
      `${player.weapon?.ammo}`,
      canvas.width * 0.9,
      canvas.height * 0.85
    );

    //ability?
    ctx.fillStyle = style.hudColor.ability;
    ctx.font = style.canvasFonts.hud;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(
      `${player.consumables.selected}: ${
        player.consumables.inventory[player.consumables.selected]
      }`,
      canvas.width * 0.85,
      canvas.height * 0.9,
      canvas.width * 0.1
    );

    // PAUSED
    if (state.paused) {
      ctx.fillStyle = style.hudColor.pauseBox;
      ctx.globalAlpha = style.hud.alpha;
      ctx.fillRect(
        canvas.width * 0.45,
        canvas.height * 0.2,
        canvas.width * 0.1,
        canvas.height * 0.05
      );
      ctx.globalAlpha = 1;
      ctx.fillStyle = style.hudColor.pauseText;
      ctx.font = style.canvasFonts.pause;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", canvas.width * 0.5, canvas.height * 0.225);
    }

    ctx.restore();
  }
}
