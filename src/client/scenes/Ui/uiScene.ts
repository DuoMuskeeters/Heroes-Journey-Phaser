import statemenu from "../menu/StateMenu";
import heroesJourneyMap from "./Map";
import type HeroesJourneyMap from "./Map";
import { mcEventTypes, mcEvents } from "../../../game/types/events";
import PhaserGame from "../../PhaserGame";
import MainScene from "../main/MainScene";
import { CanlıIsDead } from "../../../game/Karakter";
import {
  UI_createPlayer,
  UI_updateOtherPlayers,
  UI_updatePlayersHP,
  UI_updatePlayersSP,
} from "./Components";
import { createAvatarFrame } from "./AvatarUi";
import { createBackground } from "../preLoad/assets";
import { Backroundmovement } from "../main/GameMovement";

export class UiScene extends Phaser.Scene {
  statemenu!: statemenu;
  heroesJourneyMap!: HeroesJourneyMap;
  statebutton!: Phaser.GameObjects.Image;
  mainscene = PhaserGame.scene.keys.mainscene as MainScene;
  backgrounds!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[];

  constructor() {
    super("ui");
  }

  async create() {
    this.statemenu = new statemenu(this, this.mainscene.player);
    this.heroesJourneyMap = new heroesJourneyMap(this);

    this.input.keyboard?.on("keydown-C", () => {
      if (CanlıIsDead(this.mainscene.player.character)) return;

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
      if (CanlıIsDead(this.mainscene.player.character)) return;
      for (const c of this.mainscene.mobController)
        if (c.canSeePlayer()) return;
      if (this.mainscene.scene.isActive()) this.mainscene.scene.pause();
      else this.mainscene.scene.resume();
    });

    mcEvents.on(mcEventTypes.BASIC_ATTACK_USED, (i: number) => {
      const { player } = this.mainscene.playerManager[i];
      console.log(
        `player ${player.character.type} ${player.sessionId} basic attack used`
      );
    });

    mcEvents.on(mcEventTypes.HEAVY_ATTACK_USED, (i: number) => {
      const isMc = i === 0;
      console.log(`player ${i} heavy attack used`);
      if (this.statemenu.isOpen && isMc) this.statemenu.hide();
    });

    this.backgrounds = createBackground(this);
    this.mainscene.playerManager.forEach((player, i) => {
      createAvatarFrame(this, player);
      UI_createPlayer(this, player);
    });
  }

  update(_time: number, _delta: number): void {
    
    this.statemenu.update();
    UI_updateOtherPlayers(this.mainscene.playerManager);
    Backroundmovement(this, this.mainscene.cameras);
    UI_updatePlayersHP(this, this.mainscene.playerManager);
    UI_updatePlayersSP(this, this.mainscene.playerManager);
  }
}
