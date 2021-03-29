import { Game } from "./game";

function init() {
  const canvas = document.getElementById("game-canvas");
  const canvasWidth = window.innerWidth * 0.4;
  const canvasHeight = window.innerHeight * 0.4;

  if (canvas instanceof HTMLCanvasElement) {
    const game = new Game(canvas, canvasWidth, canvasHeight);
    game.initLoop();
  } else {
    throw new Error("no canvas found");
  }
}

init();
