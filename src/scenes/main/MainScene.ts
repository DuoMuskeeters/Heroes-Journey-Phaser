import Phaser from "phaser";
import { createBackground } from "../preLoad/assets";
import { loadAnimations } from "./Anims";
import {
  UI_createPlayers,
  UI_updateOtherPlayers,
  UI_updatePlayersHP,
  UI_updatePlayersSP,
} from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { createground } from "./TileGround";
import { createMob as createMobs } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";

import { Player } from "../../objects/player";
import { Iroh, Jack, create_state } from "../../game/Karakter";
import {
  GoblinTookHit,
  mcAnimTypes,
  mcEventTypes,
  mcEvents,
  mobEvents,
  mobEventsTypes,
} from "../../game/types";
import { CONFIG } from "../../PhaserGame";
import goblinController from "../../objects/Mob/goblinController";
import { PlayerManager } from "../../objects/player/manager";
import { Stats } from "fs";
import { mobStats } from "../../game/mobStats";

type Key = Phaser.Input.Keyboard.Key;

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  keySpace!: Key;
  keyW!: Key;
  keyA!: Key;
  keyD!: Key;
  keyQ!: Key;

  keyEnter!: Key;
  keyUp!: Key;
  keyLeft!: Key;
  keyRight!: Key;
  keyi!: Key;
  keyP!: Key;
  playerManager;
  friendlyFire = false;

  get player() {
    return this.playerManager.mainPlayer().player;
  }

  get playerUI() {
    return this.playerManager.mainPlayer().UI;
  }

  mobController: goblinController[] = [];
  backgrounds!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[];

  shopobject?: Phaser.GameObjects.Sprite;
  tilemap!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super("mainscene");
    const player = new Player(new Jack("jack", create_state(1)));
    this.playerManager = new PlayerManager();
    const player2 = new Player(new Iroh("iroh", create_state(1)));
    this.playerManager.push({ player, UI: {} as any });
    this.playerManager.push({ player: player2, UI: {} as any });
  }

  create() {
    this.playerManager.create(this, 300, 0);

    mcEvents.on(mcEventTypes.TOOK_HIT, (i: number, damage: number) => {
      console.log(
        `player ${i} took hit damage: ${damage} after hp: ${this.playerManager[i].player.character.state.HP}`
      );
    });

    mcEvents.on(mcEventTypes.DIED, (i: number) => {
      console.log(`player ${i} died`);
    });

    mobEvents.on(
      mobEventsTypes.TOOK_HIT,
      (id: number, details: GoblinTookHit) => {
        const ctrl = this.mobController[id - 1];
        if (ctrl.goblin.id === id)
          console.log(
            `goblin ${ctrl.goblin.name} took hit ${
              details.stun ? "(STUN)" : "(NORMAL)"
            } damage: ${details.damage} after hp: ${ctrl.goblin.mob.state.HP}`
          );
      }
    );

    mobEvents.on(mobEventsTypes.DIED, (id: number) => {
      const ctrl = this.mobController[id - 1];
      if (ctrl.goblin.id === id) console.log(`${ctrl.goblin.name} died`);
    });
    this.tilemap = this.make.tilemap({ key: "roadfile" });

    this.Addkey();
    createBackground(this);
    createAvatarFrame(this);
    loadAnimations(this);
    createground(this);
    UI_createPlayers(this);

    // this.frontroad.setCollisionByExclusion([-1], true);

    this.physics.add.collider(
      this.playerManager.map(({ player }) => player.sprite),
      [this.frontroad, this.backroad]
    );
    createMobs(this);

    setInterval(() => {
      if (this.scene.isPaused()) return;
      this.playerManager.forEach(({ player }) => {
        const { regenerate: regenerate } =
          player.character.regenerationCharacter();
        if (regenerate) regenerate();
      });
      this.mobController.forEach((controller) => {
        const { regenerate } = controller.goblin.mob.regenerationMob(
          mobStats.goblin.TIER_1.hp_reg
        );
        if (regenerate) regenerate();
      });
    }, 1000);

    this.cameras.main.startFollow(this.player.sprite, false, 1, 0, -420, -160);
    this.player.play(mcAnimTypes.FALL, true);
    this.player.sprite.anims.stopAfterRepeat(2);
    this.physics.world.setBounds(0, 0, Infinity, CONFIG.height - 300);
    this.scene.launch("ui");
  }

  update(time: number, delta: number): void {
    this.playerManager.update(time, delta);
    UI_updateOtherPlayers(this);
    Backroundmovement(this);
    UI_updatePlayersHP(this);
    UI_updatePlayersSP(this);
    this.mobController.forEach((mobCcontroller) => {
      if (mobCcontroller.goblin.sprite.body) mobCcontroller.update(delta);
    });
  }
  Addkey() {
    this.keySpace = this.input.keyboard?.addKey("SPACE")!;
    this.keyW = this.input.keyboard?.addKey("W")!;
    this.keyA = this.input.keyboard?.addKey("A")!;
    this.keyD = this.input.keyboard?.addKey("D")!;
    this.keyQ = this.input.keyboard?.addKey("Q")!;

    this.keyEnter = this.input.keyboard?.addKey("ENTER")!;
    this.keyUp = this.input.keyboard?.addKey("UP")!;
    this.keyLeft = this.input.keyboard?.addKey("LEFT")!;
    this.keyRight = this.input.keyboard?.addKey("RIGHT")!;
    this.keyP = this.input.keyboard?.addKey("P")!;
  }
}
