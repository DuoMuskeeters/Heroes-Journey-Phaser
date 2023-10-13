import statemenu from "../menu/StateMenu";
import heroesJourneyMap from "./Map";
import type HeroesJourneyMap from "./Map";
import { mcEventTypes, mcEvents } from "../../../game/types/events";
import PhaserGame from "../../PhaserGame";
import type MainScene from "../main/MainScene";
import { CanlıIsDead } from "../../../game/Karakter";

export class UiScene extends Phaser.Scene {
  statemenu!: statemenu;
  heroesJourneyMap!: HeroesJourneyMap;
  statebutton!: Phaser.GameObjects.Image;
  constructor() {
    super("ui");
  }

  create() {
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;
    this.statemenu = new statemenu(this, mainscene.player);
    this.heroesJourneyMap = new heroesJourneyMap(this);

    this.input.keyboard?.on("keydown-C", () => {
      if (CanlıIsDead(mainscene.player.character)) return;

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
      if (CanlıIsDead(mainscene.player.character)) return;
      for (const c of mainscene.mobController) if (c.canSeePlayer()) return;
      if (mainscene.scene.isActive()) mainscene.scene.pause();
      else mainscene.scene.resume();
    });

    mcEvents.on(mcEventTypes.BASIC_ATTACK_USED, (i: number) => {
      console.log(`player ${i} basic attack used`);
    });

    mcEvents.on(mcEventTypes.HEAVY_ATTACK_USED, (i: number) => {
      const isMc = i === 0;
      console.log(`player ${i} heavy attack used`);
      if (this.statemenu.isOpen && isMc) this.statemenu.hide();
    });
  }
  update(_time: number, _delta: number): void {
    this.statemenu.update();
  }
}
