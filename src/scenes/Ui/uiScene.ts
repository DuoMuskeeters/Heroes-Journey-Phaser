import statemenu from "../menu/StateMenu";
import heroesJourneyMap from "./Map";
import HeroesJourneyMap from "./Map";
import { mcEventTypes, mcEvents } from "../../game/types/events";
import PhaserGame from "../../PhaserGame";
import MainScene from "../main/MainScene";

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
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;
    // this.statebutton = this.add
    //   .image(CONFIG.width - 40, 40, "statebutton")
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
      if (mainscene.player.character.isDead()) return;

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
    this.input.keyboard?.on("keydown-Z", () => {
      if (mainscene.player.character.isDead()) return;
      for (const c of mainscene.mobController) if (c.canSeeMc()) return;
      if (mainscene.scene.isActive()) mainscene.scene.pause();
      else mainscene.scene.resume();
    });

    mcEvents.on(mcEventTypes.BASIC_ATTACK_USED, () => {
      console.log("basic attack used");
    });

    mcEvents.on(mcEventTypes.HEAVY_ATTACK_USED, () => {
      console.log("heavy attack used");
      if (this.statemenu.isOpen) this.statemenu.hide();
    });
  }
}
