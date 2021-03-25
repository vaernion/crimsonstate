import { Game } from "./game";

function init() {
  const canvas = document.getElementById("game-canvas");
  const canvasWidth = 600;
  const canvasHeight = 400;

  if (canvas instanceof HTMLCanvasElement) {
    const game = new Game(canvas, canvasWidth, canvasHeight);
    game.initLoop();
  } else {
    throw new Error("no canvas found");
  }
}

init();
