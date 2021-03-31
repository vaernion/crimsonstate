export enum ControlsKeys {
  w = "w",
  a = "a",
  s = "s",
  d = "d",
  up = "ArrowUp",
  left = "ArrowLeft",
  down = "ArrowDown",
  right = "ArrowRight",
  h = "h", // help
  space = " ", // ability/select
  enter = "Enter", // alternative for space
  esc = "Escape",
  // r = "r", // reload
  v = "v", // restart
  z = "z", // time skip
  pipe = "|", // show debug info
}

type SpecialKeyBuffer =
  | ""
  | ControlsKeys.space
  | ControlsKeys.enter
  | ControlsKeys.esc
  | ControlsKeys.v
  | ControlsKeys.z;

export class Controls {
  private document: Document;
  public showDebug: boolean = process.env.NODE_ENV === "development";

  // read by game on next update to decide vector and menu navigation
  public isMovingUp: boolean = false;
  public isMovingLeft: boolean = false;
  public isMovingRight: boolean = false;
  public isMovingDown: boolean = false;
  public specialKeyBuffer: SpecialKeyBuffer = "";
  // can't be canceled, set to false by game after activation finishes
  // public isActivatingAbility: boolean = false;
  // unpause, go back one step in menu etc.
  // public isEscaping: boolean = false;
  // public isRestarting: boolean = false;
  // public isSpeeding: boolean = false;

  constructor(context: Document) {
    this.document = context;
    this.document.addEventListener("keydown", this.keyHelper.bind(this));
    this.document.addEventListener("keyup", this.keyHelper.bind(this));
  }

  private keyHelper(ev: KeyboardEvent) {
    // TS doesn't like Object.values(ControlsButtons).includes(ev.key)
    let validButtons: string[] = Object.values(ControlsKeys);
    if (validButtons.includes(ev.key)) {
      // prevent accidental scrolling of the page
      ev.preventDefault();
    }
    switch (ev.key) {
      case ControlsKeys.pipe:
        if (ev.type === "keydown") this.showDebug = !this.showDebug;
        break;
      case ControlsKeys.h:
        if (ev.type === "keydown") this.handleHelp();
        break;
      case ControlsKeys.esc:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.esc;
        break;
      case ControlsKeys.space:
      case ControlsKeys.enter:
        if (ev.type === "keydown") this.handleAbility();
        break;
      case ControlsKeys.v:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.v;
        break;
      case ControlsKeys.z:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.z;
        break;
      case ControlsKeys.w:
      case ControlsKeys.a:
      case ControlsKeys.s:
      case ControlsKeys.d:
      case ControlsKeys.up:
      case ControlsKeys.left:
      case ControlsKeys.down:
      case ControlsKeys.right:
        this.handleDirection(ev);
        break;
    }
  }

  private handleHelp() {
    const helpClue = this.document.getElementById("help-clue");
    const helpContent = this.document.getElementById("help-content");
    if (helpClue) helpClue.hidden = !helpClue.hidden;
    if (helpContent) helpContent.hidden = !helpContent.hidden;
  }

  private handleDirection(ev: KeyboardEvent) {
    switch (ev.key) {
      case ControlsKeys.w:
      case ControlsKeys.up:
        this.isMovingUp = ev.type === "keydown";
        break;
      case ControlsKeys.a:
      case ControlsKeys.left:
        this.isMovingLeft = ev.type === "keydown";
        break;
      case ControlsKeys.s:
      case ControlsKeys.down:
        this.isMovingDown = ev.type === "keydown";
        break;
      case ControlsKeys.d:
      case ControlsKeys.right:
        this.isMovingRight = ev.type === "keydown";
        break;
    }
  }

  private handleAbility() {
    this.specialKeyBuffer = ControlsKeys.space;
  }
}
