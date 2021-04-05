import { Vector } from "./entity";

export class InputsActive {
  public mouse1 = false;
  public up = false;
  public left = false;
  public down = false;
  public right = false;
  public esc = false;
  public space = false;
  public reload = false;
  public nextAbility = false;
  public pause = false;
  public restart = false;
  public timeSpeed = false;
  public cancelGameLoop = false;
  public logEnemies = false;
}

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
  r = "r", // reload
  f = "f", // next ability
  esc = "Escape",
  p = "p", // pause
  v = "v", // restart
  z = "z", // time speed
  pipe = "|", // show debug info
  zero = "0", // cancel game loop
  one = "1", // show enemies in console
}

export class Controls {
  private document: Document;
  private canvas: HTMLCanvasElement;
  public showDebug: boolean = process.env.NODE_ENV === "development";

  public aim: Vector = new Vector();
  // read by game each update to decide player movement and actions
  public keys = new InputsActive();

  constructor(context: Document, canvas: HTMLCanvasElement) {
    this.document = context;
    this.canvas = canvas;
    this.document.addEventListener("keydown", this.handleKeys.bind(this));
    this.document.addEventListener("keyup", this.handleKeys.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseClick.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseClick.bind(this));
  }

  private handleMouseMove(ev: MouseEvent) {
    this.aim.x = ev.clientX - this.canvas.offsetLeft - this.canvas.width / 2;
    this.aim.y = ev.clientY - this.canvas.offsetTop - this.canvas.height / 2;
  }

  private handleMouseClick(ev: MouseEvent) {
    if (ev.button === 0) {
      this.keys.mouse1 = ev.type === "mousedown";
    }
  }

  private handleKeys(ev: KeyboardEvent) {
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
        this.handleDirectionKeys(ev);
        break;
      case ControlsKeys.h:
        if (ev.type === "keydown") this.handleHelp();
        break;
      case ControlsKeys.esc:
        if (ev.type === "keydown") this.keys.esc = true;
        break;
      case ControlsKeys.space:
      case ControlsKeys.enter:
        if (ev.type === "keydown") this.keys.space = true;
        break;
      case ControlsKeys.r:
        if (ev.type === "keydown") this.keys.reload = true;
        break;
      case ControlsKeys.f:
        if (ev.type === "keydown") this.keys.nextAbility = true;
        break;
      case ControlsKeys.p:
        if (ev.type === "keydown") this.keys.pause = true;
        break;
      case ControlsKeys.v:
        if (ev.type === "keydown") this.keys.restart = true;
        break;
      case ControlsKeys.z:
        if (ev.type === "keydown") this.keys.timeSpeed = true;
        break;
      case ControlsKeys.pipe:
        if (ev.type === "keydown") this.showDebug = !this.showDebug;
        break;
      case ControlsKeys.zero:
        if (ev.type === "keydown") this.keys.cancelGameLoop = true;
        break;
      case ControlsKeys.one:
        if (ev.type === "keydown") this.keys.logEnemies = true;
        break;
    }
  }

  private handleDirectionKeys(ev: KeyboardEvent) {
    switch (ev.key) {
      case ControlsKeys.w:
      case ControlsKeys.up:
        this.keys.up = ev.type === "keydown";
        break;
      case ControlsKeys.a:
      case ControlsKeys.left:
        this.keys.left = ev.type === "keydown";
        break;
      case ControlsKeys.s:
      case ControlsKeys.down:
        this.keys.down = ev.type === "keydown";
        break;
      case ControlsKeys.d:
      case ControlsKeys.right:
        this.keys.right = ev.type === "keydown";
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
