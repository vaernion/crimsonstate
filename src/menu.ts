import { Controls, InputsActive } from "./controls";
import { controlsHelp } from "./data/controlsHelp";
import { credits } from "./data/credits";
import { style, themeColor } from "./data/style";
import { GameFrames, GameState } from "./game";
import { Sound } from "./sound";

enum MenuPage {
  main = "main",
  profile = "profile",
  settings = "settings",
  controls = "controls",
  credits = "credits",
}

export class Menu {
  public isShowingMenu: boolean = true;
  public isStartingGame: boolean = false;
  private menuItems: Record<MenuPage, MenuItem[]> = this.initMenuItems();
  private menuPage: MenuPage = MenuPage.main;
  private selectedItemIndex: number = 0;
  private lastMenuInteractionTimestamp: number = 0;
  private menuInteractionCooldown: number = 250; // necessary to prevent one interaction per update
  private sound: Sound;

  constructor(sound: Sound) {
    this.sound = sound;
  }

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
          : this.menuItems[this.menuPage].length - 1;
    }
    // down
    if (controls.keys.down) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems[this.menuPage].length;
    }
    // activate
    if (controls.keys.space) {
      this.menuItems[this.menuPage][this.selectedItemIndex].onActivation();
    }
    // resume game
    else if (
      controls.keys.esc &&
      state.hasStarted &&
      this.menuPage === MenuPage.main
    ) {
      this.isShowingMenu = false;
      state.paused = false;
    }
    // return from submenus
    else if (controls.keys.esc && this.menuPage !== MenuPage.main) {
      this.returnToMainMenu();
    }

    controls.keys = new InputsActive(); // catch-all to avoid accidental actions
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

    const itemHeight = canvas.height * 0.08;

    // draw menu buttons
    this.menuItems[this.menuPage].forEach((item, i) => {
      ctx.fillStyle =
        this.selectedItemIndex === i
          ? style.menuColor.buttonSelected
          : style.menuColor.button;

      // navigation button
      ctx.fillRect(
        canvas.width * 0.06,
        (canvas.height * 0.1 + itemHeight) * (1 + i) * 0.8,
        canvas.width * 0.16,
        itemHeight
      );

      // navigation button text
      ctx.fillStyle = style.menuColor.buttonText;
      ctx.font = style.canvasFonts.menu;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        item.label === "Start" && state.hasStarted ? "Resume" : item.label,
        canvas.width * 0.14,
        (canvas.height * 0.1 + itemHeight) * (1 + i) * 0.8 + itemHeight * 0.5
      );
    });

    // subpage label
    if (this.menuPage !== MenuPage.main) {
      ctx.fillStyle = style.menuColor.pageLabel;
      ctx.font = style.canvasFonts.menu;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(this.menuPage, canvas.width * 0.5, canvas.height * 0.1);
    }

    // draw other menu content
    if (this.menuPage === MenuPage.main) {
      this.drawMain(ctx, canvas);
    } else if (this.menuPage === MenuPage.profile) {
      this.drawProfile(ctx, canvas);
    } else if (this.menuPage === MenuPage.settings) {
      this.drawSettings(ctx, canvas);
    } else if (this.menuPage === MenuPage.controls) {
      this.drawControls(ctx, canvas);
    } else if (this.menuPage === MenuPage.credits) {
      this.drawCredits(ctx, canvas);
    }

    ctx.restore();
  }

  private drawMain(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // crimsonstate art/image here later instead of rectangle
    ctx.fillStyle = themeColor.c4;
    ctx.fillRect(
      canvas.width * 0.6,
      canvas.height * 0.5,
      canvas.width * 0.2,
      canvas.height * 0.2
    );
  }

  private drawProfile(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    // PLACEHOLDER: user profile
  }

  private drawSettings(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    // Music on/off
    ctx.fillStyle = style.menuColor.text;
    ctx.font = style.canvasFonts.menu;
    ctx.textBaseline = "middle";
    ctx.textAlign = "start";
    ctx.fillText(
      this.sound.isMusicToggled ? "on" : "off",
      canvas.width * 0.25,
      canvas.height * 0.328,
      canvas.width * 0.7
    );
  }

  private drawControls(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    ctx.fillStyle = style.menuColor.controls;
    ctx.font = style.canvasFonts.menuControls;
    controlsHelp.forEach((help, i) => {
      ctx.textBaseline = "middle";
      ctx.textAlign = "start";
      ctx.fillText(
        `${help.key} - ${help.function}`,
        canvas.width * 0.25,
        canvas.height * 0.15 + 25 * (i + 1),
        canvas.width * 0.7
      );
    });
  }

  private drawCredits(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    ctx.fillStyle = style.menuColor.credits;
    ctx.font = style.canvasFonts.credits;
    ctx.fillText("Music", canvas.width * 0.5, canvas.height * 0.15);
    credits.music.forEach((music, i) => {
      ctx.textBaseline = "middle";
      ctx.textAlign = "start";
      ctx.fillText(
        `${music.author} - ${music.title} (${music.license} - ${music.link})`,
        canvas.width * 0.25,
        canvas.height * 0.15 + 20 * (i + 1),
        canvas.width * 0.7
      );
    });
  }

  private returnToMainMenu() {
    this.menuPage = MenuPage.main;
    this.selectedItemIndex = 0;
  }

  private initMenuItems() {
    return {
      [MenuPage.main]: [
        new MenuItem("Start", () => {
          this.isStartingGame = true;
        }),
        new MenuItem("Profile", () => {
          this.menuPage = MenuPage.profile;
          this.selectedItemIndex = 0;
        }),
        new MenuItem("Settings", () => {
          this.menuPage = MenuPage.settings;
          this.selectedItemIndex = 0;
        }),
        new MenuItem("Controls", () => {
          this.menuPage = MenuPage.controls;
          this.selectedItemIndex = 0;
        }),
        new MenuItem("Credits", () => {
          this.menuPage = MenuPage.credits;
          this.selectedItemIndex = 0;
        }),
      ],
      [MenuPage.profile]: [
        new MenuItem("Back", () => {
          this.returnToMainMenu();
        }),
      ],
      [MenuPage.settings]: [
        new MenuItem("Back", () => {
          this.returnToMainMenu();
        }),
        new MenuItem("Music", () => {
          this.sound.isMusicToggled = !this.sound.isMusicToggled;
          this.sound.toggleMusicPause();
        }),
      ],
      [MenuPage.controls]: [
        new MenuItem("Back", () => {
          this.returnToMainMenu();
        }),
      ],
      [MenuPage.credits]: [
        new MenuItem("Back", () => {
          this.returnToMainMenu();
        }),
      ],
    };
  }
}

class MenuItem {
  public label: string;
  public onActivation: () => void;

  constructor(label: string, onActivation: () => void) {
    this.label = label;
    this.onActivation = onActivation;
  }
}
