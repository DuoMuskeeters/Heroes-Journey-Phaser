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
import { Iroh, Jack } from "../../game/Karakter";
import {
  type GoblinTookHit,
  mcAnimTypes,
  mcEventTypes,
  mcEvents,
  mobEvents,
  mobEventsTypes,
  type Regenerated,
} from "../../game/types";
import { CONFIG } from "../../PhaserGame";
import type goblinController from "../../objects/Mob/goblinController";
import { PlayerManager, type PlayerUI } from "../../objects/player/manager";
import { playerBaseStates } from "../../game/playerStats";

type Key = Phaser.Input.Keyboard.Key;

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  keySpace!: Key;
  keyW!: Key;
  keyA!: Key;
  keyD!: Key;
  keyQ!: Key;
  keyE!: Key;

  keyEnter!: Key;
  keyUp!: Key;
  keyLeft!: Key;
  keyRight!: Key;
  keyi!: Key;
  keyP!: Key;
  keyO!: Key;
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
    const player = new Player(new Jack("jack", playerBaseStates.jack));
    this.playerManager = new PlayerManager();
    const player2 = new Player(new Iroh("iroh", playerBaseStates.iroh));
    this.playerManager.push({ player, UI: {} as PlayerUI });
    this.playerManager.push({ player: player2, UI: {} as PlayerUI });
  }

  create() {
    this.playerManager.create(this, 300, 0);

    mcEvents.on(mcEventTypes.TOOK_HIT, (i: number, damage: number) => {
      console.log(
        `[MC TOOK_HIT] player ${i} took hit damage: ${damage} after hp: ${this.playerManager[i].player.character.state.HP}`
      );
    });

    mcEvents.on(mcEventTypes.REGENERATED, (i: number, details: Regenerated) => {
      console.debug(
        `%c[MC REGENERATED]%c player ${i} regenerated: hp=${details.HP} sp=${details.SP}`,
        "color: green",
        "color: white"
      );
    });

    mcEvents.on(mcEventTypes.DIED, (i: number) => {
      console.log(
        `%c[MC DIED]%c player ${i} died`,
        "color: red",
        "color: white"
      );
    });

    mobEvents.on(
      mobEventsTypes.TOOK_HIT,
      (id: number, details: GoblinTookHit) => {
        const ctrl = this.mobController[id - 1];
        if (ctrl.goblin.id === id)
          console.log(
            `[TOOK_HIT] goblin ${ctrl.goblin.name} took hit ${
              details.stun ? "(STUN)" : "(NORMAL)"
            } damage: ${details.damage} after hp: ${ctrl.goblin.mob.state.HP}`
          );
      }
    );

    mobEvents.on(
      mobEventsTypes.REGENERATED,
      (id: number, details: Regenerated) => {
        const ctrl = this.mobController[id - 1];
        if (ctrl.goblin.id === id)
          console.debug(
            `%c[REGENERATED]%c goblin ${ctrl.goblin.name} regenerated hp=${details.HP} sp=${details.SP}`,
            "color: darkgreen",
            "color: white"
          );
      }
    );

    mobEvents.on(mobEventsTypes.DIED, (id: number) => {
      const ctrl = this.mobController[id - 1];
      if (ctrl.goblin.id === id) console.log(`[DIED] ${ctrl.goblin.name} died`);
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

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.scene.isPaused()) return;
        this.playerManager.forEach(({ player }) => {
          if (player.character.regeneration.has()) {
            const view = player.character.regeneration.view();
            player.character.regeneration.do();

            mcEvents.emit(
              mcEventTypes.REGENERATED,
              player.index,
              view satisfies Regenerated
            );
          }
        });
        this.mobController.forEach((controller) => {
          if (controller.goblin.mob.regeneration.has()) {
            const view = controller.goblin.mob.regeneration.view();
            controller.goblin.mob.regeneration.do();

            mobEvents.emit(
              mobEventsTypes.REGENERATED,
              controller.goblin.id,
              view satisfies Regenerated
            );
          }
        });
      },
      loop: true,
    });

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
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("keyboard is not defined");

    this.keySpace = keyboard.addKey("SPACE");
    this.keyW = keyboard.addKey("W");
    this.keyA = keyboard.addKey("A");
    this.keyD = keyboard.addKey("D");
    this.keyQ = keyboard.addKey("Q");
    this.keyE = keyboard.addKey("E");

    this.keyEnter = keyboard.addKey("ENTER");
    this.keyUp = keyboard.addKey("UP");
    this.keyLeft = keyboard.addKey("LEFT");
    this.keyRight = keyboard.addKey("RIGHT");
    this.keyP = keyboard.addKey("P");
    this.keyO = keyboard.addKey("O");
  }
}
