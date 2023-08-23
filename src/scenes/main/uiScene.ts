import MainScene from "./MainScene";
import statemenu from "./stateStatemenu";

export class UiScene extends Phaser.Scene {
  statemenu!: statemenu;
  constructor() {
    super("ui");
  }

  create() {
    this.statemenu = new statemenu(this);
    const statebutton = this.add
      .image(window.innerWidth - 40, 40, "uisword")
      .setScale(0.6);
    statebutton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
        statebutton.setTint(0xdedede);
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        statebutton.setTint(0xffffff);
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        statebutton.setTint(0x8afbff);
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        statebutton.setTint(0xffffff);
        if (this.statemenu.isOpen) {
          this.statemenu.hide();
        } else {
          this.statemenu.show();
        }
      });
  }
}
