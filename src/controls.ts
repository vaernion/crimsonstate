enum ControlsButtons {
  w = "w",
  a = "a",
  s = "s",
  d = "d",
  up = "ArrowUp",
  left = "ArrowLeft",
  down = "ArrowDown",
  right = "ArrowRight",
  h = "h",
  space = " ",
  pipe = "|",
}

export class Controls {
  #context: Document;
  public showDebug: boolean = process.env.NODE_ENV === "development";

  // read by game on next update to decide vector
  public isMovingUp: boolean = false;
  public isMovingLeft: boolean = false;
  public isMovingRight: boolean = false;
  public isMovingDown: boolean = false;
  // can't be canceled, set to false by game after activation finishes
  public isActivatingAbility: boolean = false;

  constructor(context: Document) {
    this.#context = context;
    this.#context.addEventListener("keydown", this.keyHelper.bind(this));
    this.#context.addEventListener("keyup", this.keyHelper.bind(this));

    // setInterval(() => {
    //   console.log({
    //     w: this.isHoldingW,
    //     a: this.isHoldingA,
    //     s: this.isHoldingS,
    //     d: this.isHoldingD,
    //   });
    // }, 1000);
  }

  private keyHelper(ev: KeyboardEvent) {
    // TS doesn't like Object.values(ControlsButtons).includes(ev.key)
    let validButtons: string[] = Object.values(ControlsButtons);
    if (validButtons.includes(ev.key)) {
      // prevent accidental scrolling of the page
      ev.preventDefault();
    }
    switch (ev.key) {
      case ControlsButtons.pipe:
        if (ev.type === "keydown") this.showDebug = !this.showDebug;
        break;
      case ControlsButtons.h:
        if (ev.type === "keydown") this.handleHelp();
        break;
      case ControlsButtons.w:
      case ControlsButtons.a:
      case ControlsButtons.s:
      case ControlsButtons.d:
      case ControlsButtons.up:
      case ControlsButtons.left:
      case ControlsButtons.down:
      case ControlsButtons.right:
        this.handleDirection(ev);
        break;
      case ControlsButtons.space:
        this.handleAbility();
        break;
    }
  }

  private handleHelp() {
    const helpClue = this.#context.getElementById("help-clue");
    const helpContent = this.#context.getElementById("help-content");
    if (helpClue) helpClue.hidden = !helpClue.hidden;
    if (helpContent) helpContent.hidden = !helpContent.hidden;
  }

  private handleDirection(ev: KeyboardEvent) {
    // const inputDisplay = this.#context.getElementById("input-display");
    // if (inputDisplay) {
    //   inputDisplay.textContent =
    //     ev.key + (this.isActivatingAbility ? " +ability" : "");
    // }
    // console.count(ev.key);

    switch (ev.key) {
      case ControlsButtons.w:
      case ControlsButtons.up:
        this.isMovingUp = ev.type === "keydown";
        break;
      case ControlsButtons.a:
      case ControlsButtons.left:
        this.isMovingLeft = ev.type === "keydown";
        break;
      case ControlsButtons.s:
      case ControlsButtons.down:
        this.isMovingDown = ev.type === "keydown";
        break;
      case ControlsButtons.d:
      case ControlsButtons.right:
        this.isMovingRight = ev.type === "keydown";
        break;
    }
  }

  private handleAbility() {
    this.isActivatingAbility = true;
  }
}
