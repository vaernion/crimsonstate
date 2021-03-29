import { constants } from "./constants";
import { Game } from "./game";

export const canvasWidthFraction = 0.4;
export const canvasHeightFraction = 0.55;

function init() {
  const canvas = document.getElementById("game-canvas");
  const canvasWidth = window.innerWidth * canvasWidthFraction;
  const canvasHeight = window.innerHeight * canvasWidthFraction;

  if (canvas instanceof HTMLCanvasElement) {
    const game = new Game(
      canvas,
      canvasWidth,
      canvasHeight,
      constants.world.width,
      constants.world.height
    );
    game.initLoop();
  } else {
    throw new Error("no canvas found");
  }
}

init();
