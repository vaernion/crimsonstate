import { Game } from "./game";

function init() {
  const canvas = document.getElementById("game-canvas");

  if (canvas instanceof HTMLCanvasElement) {
    const game = new Game(canvas);
    game.initLoop();
  } else {
    throw new Error("no canvas found");
  }
}

init();
