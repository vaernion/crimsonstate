enum ControlsButtons {
  w = "w",
  a = "a",
  s = "s",
  d = "d",
  h = "h",
  space = " ",
}

export class Controls {
  #context: Document;

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
    // console.log(ev);
    switch (ev.key) {
      case ControlsButtons.h:
        if (ev.type === "keydown") this.help();
        break;
      case ControlsButtons.w:
      case ControlsButtons.a:
      case ControlsButtons.s:
      case ControlsButtons.d:
        this.wasd(ev);
        break;
      case ControlsButtons.space:
        this.ability();
        break;
    }
  }

  private help() {
    const helpClue = this.#context.getElementById("help-clue");
    const helpContent = this.#context.getElementById("help-content");
    if (helpClue) helpClue.hidden = !helpClue.hidden;
    if (helpContent) helpContent.hidden = !helpContent.hidden;
  }

  private wasd(ev: KeyboardEvent) {
    // const inputDisplay = this.#context.getElementById("input-display");
    // if (inputDisplay) {
    //   inputDisplay.textContent =
    //     ev.key + (this.isActivatingAbility ? " +ability" : "");
    // }
    // console.count(ev.key);

    switch (ev.key) {
      case ControlsButtons.w:
        this.isMovingUp = ev.type === "keydown";
        break;
      case ControlsButtons.a:
        this.isMovingLeft = ev.type === "keydown";
        break;
      case ControlsButtons.s:
        this.isMovingDown = ev.type === "keydown";
        break;
      case ControlsButtons.d:
        this.isMovingRight = ev.type === "keydown";
        break;
    }
  }

  private ability() {
    this.isActivatingAbility = true;
  }
}
