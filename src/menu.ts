import { Controls, ControlsKeys } from "./controls";
import { GameState } from "./game";
import { menuColor, themeColor } from "./style";

export class Menu {
  public isShowingMenu: boolean = true;
  public isStartingGame: boolean = false;
  private menuItems = this.initMenuItems();
  private selectedItemIndex: number = 0;
  private lastMenuInteractionTimestamp: DOMHighResTimeStamp = 0;
  private menuInteractionCooldown: number = 250; // necessary to prevent one interaction per update

  public isCoolingDown(timestamp: DOMHighResTimeStamp) {
    return (
      this.lastMenuInteractionTimestamp + this.menuInteractionCooldown >
      timestamp
    );
  }

  public update(
    controls: Controls,
    timestamp: DOMHighResTimeStamp,
    state: GameState
  ) {
    // interaction cooldown
    if (this.isCoolingDown(timestamp)) {
      return;
    }
    // up
    if (controls.isMovingUp) {
      this.selectedItemIndex =
        this.selectedItemIndex - 1 >= 0
          ? this.selectedItemIndex - 1
          : this.menuItems.length - 1;
    }
    // down
    if (controls.isMovingDown) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems.length;
    }
    // activate
    if (controls.specialKeyBuffer === ControlsKeys.space) {
      this.menuItems[this.selectedItemIndex].onactivation();
    }
    // return from submenu or resume game
    else if (
      controls.specialKeyBuffer === ControlsKeys.esc &&
      state.hasStarted
    ) {
      this.isShowingMenu = false;
      state.paused = false;
    }

    controls.specialKeyBuffer = "";
    this.lastMenuInteractionTimestamp = timestamp;
  }

  public draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState
  ) {
    ctx.save();

    // background
    ctx.fillStyle = menuColor.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const itemHeight = canvas.height * 0.1;

    // draw menu buttons
    this.menuItems.forEach((item, idx) => {
      ctx.fillStyle =
        this.selectedItemIndex === idx
          ? menuColor.buttonSelected
          : menuColor.button;

      ctx.fillRect(
        canvas.width * 0.1,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8,
        canvas.width * 0.2,
        itemHeight
      );

      // button text
      ctx.fillStyle = menuColor.buttonText;
      ctx.font = "20px arial";
      //   ctx.textBaseline = "top";
      ctx.fillText(
        item.label === "Start" && state.hasStarted ? "Resume" : item.label,
        canvas.width * 0.15,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8 + itemHeight * 0.7
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
