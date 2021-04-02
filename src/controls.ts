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
  // r = "r", // reload
  f = "f", // next ability
  esc = "Escape",
  p = "p", // pause
  v = "v", // restart
  z = "z", // time speed
  pipe = "|", // show debug info
  zero = "0", // cancel game loop
  one = "1", // show enemies
}

type SpecialKeyBuffer =
  | ""
  | ControlsKeys.space
  | ControlsKeys.enter
  | ControlsKeys.f
  | ControlsKeys.esc
  | ControlsKeys.p
  | ControlsKeys.v
  | ControlsKeys.z
  | ControlsKeys.zero
  | ControlsKeys.one;

export class Controls {
  private document: Document;
  public showDebug: boolean = process.env.NODE_ENV === "development";

  // read by game on next update to decide vector and menu navigation
  public isMovingUp: boolean = false;
  public isMovingLeft: boolean = false;
  public isMovingRight: boolean = false;
  public isMovingDown: boolean = false;
  // stores one upcoming non-movement key, easier than one boolean for each key
  // can't pause and use ability and reload in the same frame
  public specialKeyBuffer: SpecialKeyBuffer = "";

  constructor(context: Document) {
    this.document = context;
    this.document.addEventListener("keydown", this.keyHelper.bind(this));
    this.document.addEventListener("keyup", this.keyHelper.bind(this));
  }

  private keyHelper(ev: KeyboardEvent) {
    // TS doesn't like Object.values(ControlsButtons).includes(ev.key)
    let validButtons: string[] = Object.values(ControlsKeys);
    if (validButtons.includes(ev.key)) {
      // prevent keys from interacting with browser (e.g. scroll down)
      ev.preventDefault();
    }
    switch (ev.key) {
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
      case ControlsKeys.h:
        if (ev.type === "keydown") this.handleHelp();
        break;
      case ControlsKeys.esc:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.esc;
        break;
      case ControlsKeys.space:
      case ControlsKeys.enter:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.space;
        break;
      case ControlsKeys.f:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.f;
        break;
      case ControlsKeys.p:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.p;
        break;
      case ControlsKeys.v:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.v;
        break;
      case ControlsKeys.z:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.z;
        break;
      case ControlsKeys.pipe:
        if (ev.type === "keydown") this.showDebug = !this.showDebug;
        break;
      case ControlsKeys.zero:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.zero;
        break;
      case ControlsKeys.one:
        if (ev.type === "keydown") this.specialKeyBuffer = ControlsKeys.one;
        break;
    }
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

  private handleHelp() {
    const helpClue = this.document.getElementById("help-clue");
    const helpContent = this.document.getElementById("help-content");
    if (helpClue) helpClue.hidden = !helpClue.hidden;
    if (helpContent) helpContent.hidden = !helpContent.hidden;
  }
}
