import statemenu from "./StateMenu";
import heroesJourneyMap from "./HeroesJourneyMap";
import HeroesJourneyMap from "./HeroesJourneyMap";

export class UiScene extends Phaser.Scene {
  statemenu!: statemenu;
  heroesJourneyMap!: HeroesJourneyMap;
  statebutton!: Phaser.GameObjects.Image;
  constructor() {
    super("ui");
  }

  create() {
    this.statemenu = new statemenu(this);
    this.heroesJourneyMap = new heroesJourneyMap(this);
    // this.statebutton = this.add
    //   .image(window.innerWidth - 40, 40, "statebutton")
    //   .setScale(5)
    //   .setTint(0xd0d0d0)
    //   .setVisible(false);
    // this.statebutton
    //   .setInteractive()
    //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
    //     this.statebutton.setTint(0xdedede);
    //   })
    //   .on(Phaser.Input.Events.POINTER_OUT, () => {
    //     this.statebutton.setTint(0xd0d0d0);
    //   })
    //   .on(Phaser.Input.Events.POINTER_DOWN, () => {
    //     this.statebutton.setTint(0x8afbff);
    //   })
    //   .on(Phaser.Input.Events.POINTER_UP, () => {
    //     this.statebutton.setTint(0xd0d0d0);

    //     if (this.statemenu.isOpen) {
    //       this.statemenu.hide();
    //     } else {
    //       this.statemenu.show();
    //     }
    //   });
    this.input.keyboard?.on("keydown-C", () => {
      if (this.statemenu.isOpen) {
        this.statemenu.hide();
      } else {
        this.statemenu.show();
      }
    });
    this.input.keyboard?.on("keydown-M", () => {
      if (this.heroesJourneyMap.isOpen) {
        this.heroesJourneyMap.hide();
      } else {
        this.heroesJourneyMap.show();
      }
    });
  }
}
