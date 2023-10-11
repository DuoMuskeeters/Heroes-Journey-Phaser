import Phaser from "phaser";
import { createBackground } from "../preLoad/assets";
import { loadAnimations } from "./Anims";
import {
  UI_createPlayer,
  UI_updateOtherPlayers,
  UI_updatePlayersHP,
  UI_updatePlayersSP,
} from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { createRoadCollider, createground } from "./TileGround";
import { createMob as createMobs } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";

import { Player, getCharacterType } from "../../../objects/player";
import { Iroh, Jack, getCharacterClass } from "../../../game/Karakter";
import {
  type GoblinTookHit,
  mcAnimTypes,
  mcEventTypes,
  mcEvents,
  mobEvents,
  mobEventsTypes,
  type Regenerated,
  PressingKeys,
} from "../../../game/types";
import { CONFIG } from "../../PhaserGame";
import type goblinController from "../../../objects/Mob/goblinController";
import { PlayerManager, type PlayerUI } from "../../../objects/player/manager";
import { playerBaseStates } from "../../../game/playerStats";
import { Client, Room } from "colyseus.js";
import { getOrThrow } from "../../../objects/utils";
import { RelayState } from "../../../server/rooms/schema/RelayRoomState";
import { command } from "../../../client/utils";
import {
  Move,
  PlayerSkillPayload,
} from "../../../server/rooms/relay_room/commands";

type Key = Phaser.Input.Keyboard.Key;

const reconnectionToken = {
  get: () => localStorage.getItem("reconnectionToken"),
  set: (id: string) => localStorage.setItem("reconnectionToken", id),
  delete: () => localStorage.removeItem("reconnectionToken"),
};

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  client = new Client("ws://localhost:2567");
  _room?: Room<RelayState>;

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
  playerManager: PlayerManager;
  friendlyFire = false;

  get room(): Room<RelayState> {
    return getOrThrow(this._room, "Room");
  }

  set room(room: Room) {
    this._room = room;
  }

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
    const player = new Player(new Iroh("jack", playerBaseStates.jack));
    this.playerManager = new PlayerManager();
    this.playerManager.push({ player, UI: {} as PlayerUI });
  }

  onConnectionReady() {
    this.player.character.name = this.room.sessionId;
    this.room.onStateChange((state) => {
      console.debug("onStateChange", state);
    });

    this.room.state.players.onAdd((serverPlayer, sessionId) => {
      const Character = getCharacterClass(serverPlayer.type);
      if (sessionId !== this.room.sessionId) {
        console.log("A player has joined! sid:", sessionId);
        const player = new Player(
          new Character(sessionId, serverPlayer.character.state)
        );
        const i = this.playerManager.length;
        player.create(this, 300, 0, i);
        this.playerManager.push({ player, UI: {} as PlayerUI });
        createAvatarFrame(this, this.playerManager[i]);
        UI_createPlayer(this, this.playerManager[i]);
        createRoadCollider(this, this.playerManager[i].player.sprite);
      }
      const { player } = this.playerManager.findByName(sessionId);

      player.sprite.x = serverPlayer.x;
      player.sprite.y = serverPlayer.y;

      if (sessionId === this.room.sessionId) return;

      serverPlayer.listen("connected", () => {
        if (serverPlayer.connected)
          console.log("serverPlayer connected", sessionId);
        else console.log("serverPlayer disconnected", sessionId);
      });

      serverPlayer.listen("y", (newY) => {
        player.sprite.y = Phaser.Math.Linear(player.sprite.y, newY, 0.1);
        player.pressingKeys.W = player.sprite.y > newY;
        // console.log("[MOVE(Y)] player", sessionId, "y changed to", newY);
      });
      serverPlayer.listen("x", (newX) => {
        // player.pressingKeys.A = player.sprite.x > newX;
        // player.pressingKeys.D = player.sprite.x < newX;
        // player.sprite.x = Phaser.Math.Linear(player.sprite.x, newX, 0.1);

        this.tweens.add({
          targets: player.sprite,
          x: newX,
          duration: 100,
          ease: "Linear",
          onUpdate: () => {
            player.pressingKeys.A = player.sprite.x > newX;
            player.pressingKeys.D = player.sprite.x < newX;
          },
          onComplete: () => {
            player.newX = newX;
          },
        });

        // console.log("[MOVE(X)] player", sessionId, "x changed to", newX);
      });
    });

    this.room.onError((code, message) => {
      console.error("[Server Error: %d] %s", code, message);
    });

    this.room.state.players.onRemove((_player, sessionId) => {
      console.log("A player has left! sid:", sessionId);
      const player = this.playerManager.find(
        ({ player }) => player.character.name === sessionId
      );
      const i = !player ? -1 : this.playerManager.indexOf(player);
      if (i === -1) {
        console.error(`player ${sessionId} not found`);
        return;
      }

      this.playerManager.removePlayer(i);
    });

    this.room.onMessage(
      "player-spell",
      ([sessionId, message]: [string, PlayerSkillPayload]) => {
        const item = this.playerManager.find(
          ({ player }) => player.character.name === sessionId
        );
        if (!item) {
          console.error(`player ${sessionId} not found`);
          return;
        }
        const key = message.skill === "basic" ? "Space" : "Q";
        item.player.pressingKeys[key] = "ephemeral";
      }
    );

    mcEvents.on(mcEventTypes.MOVED, (i: number, keys: PressingKeys) => {
      if (i !== this.player.index) return;
      this.room.send(
        ...command(new Move(), {
          x: this.player.sprite.x,
          y: this.player.sprite.y,
        })
      );
      if (keys.Space === true || keys.Q === true) {
        this.room.send("player-spell", {
          sessionId: this.player.character.name,
          skill: keys.Space === true ? "basic" : "heavy",
        } satisfies PlayerSkillPayload);
      }
    });
  }

  async create() {
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
    loadAnimations(this);
    createground(this);
    this.playerManager.forEach((player) => {
      createRoadCollider(this, player.player.sprite);
      createAvatarFrame(this, player);
      UI_createPlayer(this, player);
    });

    // this.frontroad.setCollisionByExclusion([-1], true);
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

    try {
      let connected = false;
      const reconnect = reconnectionToken.get();
      reconnectionToken.delete();

      if (reconnect) {
        try {
          this.room = await this.client.reconnect(reconnect);
          connected = true;
        } catch (error) {
          // reconnection failed
        }
      }

      if (!connected) {
        this.room = await this.client.joinOrCreate("relay", {
          name: this.player.character.name,
          x: this.player.sprite.x,
          y: this.player.sprite.y,
          type: getCharacterType(this.player.character),
        });
        connected = true;
      }

      if (!connected) throw new Error("room connection failed");

      console.log(
        `Joined as ${this.room.sessionId} index: ${this.player.index}`
      );
      reconnectionToken.set(this.room.reconnectionToken);
      this.onConnectionReady();
    } catch (error) {
      console.error(error);
    }
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

    this.player.pressingKeys = {
      W: this.keyW.isDown,
      A: this.keyA.isDown,
      D: this.keyD.isDown,
      Space: this.keySpace.isDown,
      Q: Phaser.Input.Keyboard.JustDown(this.keyQ),
      E: Phaser.Input.Keyboard.JustDown(this.keyE),
    };
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
