import { Controls } from "./controls";
import { GameState } from "./game";
import { colors } from "./style";

export class Menu {
  public isShowingMenu: boolean = true;
  public isStartingGame: boolean = false;
  private menuItems = [
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
  private selectedItemIndex: number = 0;
  private lastInteractionTimestamp: number = 0;
  private interactionCooldown: number = 250; // necessary to prevent one interaction per update

  update(controls: Controls, timestamp: DOMHighResTimeStamp) {
    if (
      !(
        controls.isMovingUp ||
        controls.isMovingDown ||
        controls.isActivatingAbility
      ) ||
      this.lastInteractionTimestamp + this.interactionCooldown > timestamp
    ) {
      return;
    }
    // up
    if (controls.isMovingUp) {
      this.selectedItemIndex =
        this.selectedItemIndex - 1 >= 0
          ? this.selectedItemIndex - 1
          : this.menuItems.length - 1;

      // down
    } else if (controls.isMovingDown) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems.length;
      // activate
    } else if (controls.isActivatingAbility) {
      this.menuItems[this.selectedItemIndex].onactivation();
    }
    controls.isActivatingAbility = false;
    this.lastInteractionTimestamp = timestamp;
  }

  draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    state: GameState
  ) {
    ctx.save();

    ctx.fillStyle = colors.c6;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const itemHeight = canvas.height * 0.1;

    // draw menu buttons
    this.menuItems.forEach((item, idx) => {
      ctx.fillStyle = this.selectedItemIndex === idx ? colors.c2 : colors.c3;

      ctx.fillRect(
        canvas.width * 0.1,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8,
        canvas.width * 0.2,
        itemHeight
      );

      // button text
      ctx.fillStyle = colors.c6;
      ctx.font = "20px arial";
      //   ctx.textBaseline = "top";
      ctx.fillText(
        item.label === "Start" && state.hasStarted ? "Resume" : item.label,
        canvas.width * 0.15,
        (canvas.height * 0.1 + itemHeight) * (1 + idx) * 0.8 + itemHeight * 0.7
      );
    });

    // crimsonstate art/image here later instead of rectangle
    ctx.fillStyle = colors.c4;
    ctx.fillRect(
      canvas.width * 0.6,
      canvas.height * 0.5,
      canvas.width * 0.2,
      canvas.height * 0.2
    );

    ctx.restore();
  }
}

class MenuItem {
  public label: string;
  public onactivation: () => void;
  constructor(label: string, onclick: () => void) {
    this.label = label;
    this.onactivation = onclick;
  }
}
