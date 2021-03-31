import { constants } from "./constants";
import { Game } from "./game";

function init() {
  const canvas = document.getElementById("game-canvas");
  const canvasWidth = window.innerWidth * constants.canvasWidthFraction;
  const canvasHeight = window.innerHeight * constants.canvasWidthFraction;

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
