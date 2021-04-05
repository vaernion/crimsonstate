import { Controls, InputsActive } from "./controls";
import { style, themeColor } from "./data/style";
import { GameFrames, GameState } from "./game";

export class Menu {
  public isShowingMenu: boolean = true;
  public isStartingGame: boolean = false;
  private menuItems = this.initMenuItems();
  private selectedItemIndex: number = 0;
  private lastMenuInteractionTimestamp: number = 0;
  private menuInteractionCooldown: number = 250; // necessary to prevent one interaction per update

  public isCoolingDown(timestamp: number) {
    return (
      this.lastMenuInteractionTimestamp + this.menuInteractionCooldown >
      timestamp
    );
  }

  public update(controls: Controls, frames: GameFrames, state: GameState) {
    // interaction cooldown
    if (this.isCoolingDown(frames.realTime)) {
      return;
    }
    // up
    if (controls.keys.up) {
      this.selectedItemIndex =
        this.selectedItemIndex - 1 >= 0
          ? this.selectedItemIndex - 1
          : this.menuItems.length - 1;
    }
    // down
    if (controls.keys.down) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems.length;
    }
    // activate
    if (controls.keys.space) {
      this.menuItems[this.selectedItemIndex].onactivation();
      controls.keys = new InputsActive(); // catch-all to avoid accidental actions
    }
    // return from submenu or resume game
    else if (controls.keys.esc && state.hasStarted) {
      this.isShowingMenu = false;
      state.paused = false;
      controls.keys = new InputsActive(); // catch-all to avoid accidental actions
    }

    this.lastMenuInteractionTimestamp = frames.realTime;
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState
  ) {
    ctx.save();

    // background
    ctx.fillStyle = style.menuColor.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const itemHeight = canvas.height * 0.1;

    // draw menu buttons
    this.menuItems.forEach((item, idx) => {
      ctx.fillStyle =
        this.selectedItemIndex === idx
          ? style.menuColor.buttonSelected
          : style.menuColor.button;

      ctx.fillRect(
        canvas.width * 0.1,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8,
        canvas.width * 0.2,
        itemHeight
      );

      // button text
      ctx.fillStyle = style.menuColor.buttonText;
      ctx.font = style.canvasFonts.menu;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        item.label === "Start" && state.hasStarted ? "Resume" : item.label,
        canvas.width * 0.2,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8 + itemHeight * 0.5
      );
    });

    // crimsonstate art/image here later instead of rectangle
    ctx.fillStyle = themeColor.c4;
    ctx.fillRect(
      canvas.width * 0.6,
      canvas.height * 0.5,
      canvas.width * 0.2,
      canvas.height * 0.2
    );

    ctx.restore();
  }

  private initMenuItems() {
    return [
      new MenuItem("Start", () => {
        this.isStartingGame = true;
      }),
      new MenuItem("Profile", () => {
        console.log("profile");
      }),
      new MenuItem("Settings", () => {
        console.log("settings");
      }),
      new MenuItem("Credits", () => {
        console.log("credits");
      }),
    ];
  }
}

class MenuItem {
  public label: string;
  public onactivation: () => void;

  constructor(label: string, onactivation: () => void) {
    this.label = label;
    this.onactivation = onactivation;
  }
}
