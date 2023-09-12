import statemenu from "../menu/StateMenu";
import heroesJourneyMap from "./Map";
import HeroesJourneyMap from "./Map";
import {
  eventTypes,
  gameEvents,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
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
    this.input.keyboard?.on("keydown-Z", () => {
      gameEvents.emit(eventTypes.PAUSE_TOGGLE_REQUESTED);
    });
    mcEvents.on(mcEventTypes.HEAVY_ATTACK_USED, () => {
      console.log("heavy attack used");
      mainscene.player.ultiDamage = mainscene.player.user.heavy_strike();
      if (this.statemenu.isOpen) this.statemenu.hide();
    });
    gameEvents.on(eventTypes.PAUSE_TOGGLE_REQUESTED, () => {
      // goblin vuracak kadar yakın ise izin verme
      if (mainscene.scene.isActive()) mainscene.scene.pause();
      else mainscene.scene.resume();
    });
  }
}
