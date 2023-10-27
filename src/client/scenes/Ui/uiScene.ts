import statemenu from "../menu/StateMenu";
import heroesJourneyMap from "./Map";
import type HeroesJourneyMap from "./Map";
import { mcEventTypes, mcEvents } from "../../../game/types/events";
import PhaserGame from "../../PhaserGame";
import MainScene from "../main/MainScene";
import { CanlıIsDead } from "../../../game/Karakter";
import {
  UI_createPlayer,
  UI_updatePositionOtherPlayers,
  UI_updateAllPlayersHP,
  UI_updateAllPlayersSP,
  createBackground,
} from "./Components";
import { createAvatarFrame } from "./AvatarUi";
import { Backroundmovement } from "../main/GameMovement";
import type { PlayerManager } from "../../../objects/player/manager";

export class UiScene extends Phaser.Scene {
  statemenu!: statemenu;
  heroesJourneyMap!: HeroesJourneyMap;
  statebutton!: Phaser.GameObjects.Image;
  mainscene!: MainScene;
  backgrounds!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[];

  constructor() {
    super("ui");
  }

  async create() {
    this.mainscene = this.scene.get<MainScene>("mainscene");
    this.statemenu = new statemenu(this, this.mainscene.player);
    this.heroesJourneyMap = new heroesJourneyMap(this);
    this.cameras.main.name = "ui";
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
        `player ${player.character.type} ${player._sessionId} basic attack used`
      );
    });

    mcEvents.on(mcEventTypes.HEAVY_ATTACK_USED, (i: number) => {
      const isMc = i === 0;
      console.log(`player ${i} heavy attack used`);
      if (this.statemenu.isOpen && isMc) this.statemenu.hide();
    });

    this.backgrounds = createBackground(this);
    this.mainscene.playerManager.forEach((player, i) => {
      this.addPlayer(player);
    });
  }

  addPlayer(player: PlayerManager[number]) {
    /**
     * @description : main player frame stay in uiscene
     * @description : other players frame stay in main scene
     * @description : when issue #30 is fixed, this problem will be solved
     **/
    const { player: playerObj } = player;
    const scene = playerObj.isMainPlayer() ? this : this.mainscene;
    createAvatarFrame(scene, player);
    UI_createPlayer(scene, player);
  }

  update(_time: number, _delta: number): void {
    UI_updatePositionOtherPlayers(this.mainscene.playerManager);
    Backroundmovement(this, this.mainscene.cameras);
    UI_updateAllPlayersHP(this, this.mainscene.playerManager);
    UI_updateAllPlayersSP(this, this.mainscene.playerManager);
    this.statemenu.update();
  }
}
