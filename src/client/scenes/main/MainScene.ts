import Phaser from "phaser";
import { loadAnimations } from "./Anims";
import { UI_createPlayer } from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { createground } from "./TileGround";
import { createMob as createMobs } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";

import { Player } from "../../../objects/player";
import {
  type CharacterType,
  getCharacterClass,
  CharacterRegeneration,
  mobRegeneration,
} from "../../../game/Karakter";
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
import type { RelayState } from "../../../server/rooms/schema/RelayRoomState";
import { CommandInput, command } from "../../../client/utils";
import {
  type PlayerSkillPayload,
  Move,
  Skill,
  Transform,
  type ConnectPlayer,
  ChangeCharacter,
} from "../../../server/rooms/relay_room/commands";

type Key = Phaser.Input.Keyboard.Key;

const reconnectionToken = {
  get: () => localStorage.getItem("reconnectionToken"),
  set: (id: string) => localStorage.setItem("reconnectionToken", id),
  delete: () => localStorage.removeItem("reconnectionToken"),
};

export default class MainScene extends Phaser.Scene {
  road!: Phaser.Tilemaps.TilemapLayer;

  client = new Client("ws://127.0.0.1:2567");
  _room?: Room<RelayState>;
  connected = false;
  keys!: { Space: Key; W: Key; A: Key; D: Key; Q: Key; E: Key };

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

  shopobject?: Phaser.GameObjects.Sprite;
  tilemap!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super("mainscene");
    const type = "jack" satisfies CharacterType;
    const Character = getCharacterClass(type);
    const state = playerBaseStates[type];
    const player = new Player(new Character(type, state));
    this.playerManager = new PlayerManager();
    this.playerManager.push({ player, UI: {} as PlayerUI });
    if (CONFIG.physics.matter.debug)
      (globalThis as unknown as { player: typeof player }).player = player;
  }

  onConnectionReady() {
    console.log("connection ready");
    this.player._sessionId = this.room.sessionId;
    this.room.onStateChange((state) => {
      console.debug("onStateChange", state);
    });

    this.room.state.players.onAdd((serverPlayer, sessionId) => {
      console.log("players.onAdd:", sessionId);

      if (sessionId !== this.room.sessionId) {
        console.log("A player has joined! sid:", sessionId);
        const Character = getCharacterClass(serverPlayer.character.type);
        const player = new Player(
          new Character(
            serverPlayer.character.name,
            serverPlayer.character.state
          ),
          serverPlayer.sessionId
        );
        const i = this.playerManager.length;
        player.create(this, 300, 0, i);
        this.playerManager.push({ player, UI: {} as PlayerUI });
        createAvatarFrame(this, this.playerManager[i]);
        UI_createPlayer(this, this.playerManager[i]);
      }
      const { player, UI } = this.playerManager.findBySessionId(sessionId);

      player.sprite.x = serverPlayer.x;
      player.sprite.y = serverPlayer.y;
      player.character.prefix = serverPlayer.character.prefix;

      serverPlayer.listen("character", (newState) => {
        console.log("serverPlayer character changed to ", newState);
        player.character = newState;
        player.onCharacterChange(newState.type);
      });

      if (sessionId === this.room.sessionId) return;

      serverPlayer.listen("connected", (connected) => {
        if (connected) console.log("serverPlayer connected", sessionId);
        else console.log("serverPlayer disconnected", sessionId);

        UI.playerindexText
          .setText(
            `PLAYER: ${player.index + 1} ${!connected ? "DISCONNECTED" : ""}`
          )
          .setColor(!connected ? "#ff0000" : "#000");
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
        });

        // console.log("[MOVE(X)] player", sessionId, "x changed to", newX);
      });
    }, false);

    this.room.onError((code, message) => {
      console.error("[Server Error: %d] %s", code, message);
    });

    this.room.state.players.onRemove((_player, sessionId) => {
      console.log("A player has left! sid:", sessionId);
      const player = this.playerManager.findBySessionId(sessionId);
      const i = this.playerManager.indexOf(player);
      if (i === -1) {
        console.error(`player ${sessionId} not found`);
        return;
      }

      this.playerManager.removePlayer(i);
    });

    this.room.onMessage(
      "player-skill",
      ([sessionId, skill]: PlayerSkillPayload) => {
        const item = this.playerManager.findBySessionId(sessionId);
        if (!item) {
          console.error(`player ${sessionId} not found`);
          return;
        }
        const key = skill === "basic" ? "Space" : skill === "heavy" ? "Q" : "E";
        item.player.pressingKeys[key] = "ephemeral";
      }
    );

    mcEvents.on(mcEventTypes.TRANSFORM, (i: number, delay: number) => {
      if (i !== this.player.index) return;
      this.room.send(...command(new Transform(), delay));
    });

    mcEvents.on(mcEventTypes.MOVED, (i: number, keys: PressingKeys) => {
      if (i !== this.player.index) return;
      this.room.send(
        ...command(new Move(), {
          x: this.player.sprite.x,
          y: this.player.sprite.y,
        })
      );
      if (keys.Space === true || keys.Q === true || keys.E === true) {
        this.room.send(
          ...command(
            new Skill(),
            keys.Space === true
              ? "basic"
              : keys.Q === true
              ? "heavy"
              : "transform"
          )
        );
      }
      if (keys.E === true)
        this.room.send(
          ...command(
            new ChangeCharacter(),
            this.player.character.type === "iroh" ? "jack" : "iroh"
          )
        );
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
            `[TOOK_HIT] goblin ${ctrl.goblin.mob.name} took hit ${
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
            `%c[REGENERATED]%c goblin ${ctrl.goblin.mob.name} regenerated hp=${details.HP} sp=${details.SP}`,
            "color: darkgreen",
            "color: white"
          );
      }
    );

    mobEvents.on(mobEventsTypes.DIED, (id: number) => {
      const ctrl = this.mobController[id - 1];
      if (ctrl.goblin.id === id)
        console.log(`[DIED] ${ctrl.goblin.mob.name} died`);
    });
    this.tilemap = this.make.tilemap({ key: "roadfile" });

    this.Addkey();
    loadAnimations(this);
    createground(this);

    // this.frontroad.setCollisionByExclusion([-1], true);
    createMobs(this);

    
    this.cameras.main.setZoom(2.5);
    this.cameras.main.startFollow(this.player.sprite, false, 1, 1, 0, 0);
    this.player.play(mcAnimTypes.FALL, true);
    this.player.sprite.anims.stopAfterRepeat(2);
    this.matter.world.setBounds(0, 0, CONFIG.width, CONFIG.height - 300);
    this.scene.launch("ui");
    this.scene.bringToTop();

    // TODO: server side regeneration
    if (!this.connected)
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.scene.isPaused()) return;
          this.playerManager.forEach(({ player }) => {
            const regeneration = CharacterRegeneration(player.character);
            if (regeneration.has()) {
              const view = regeneration.view();
              regeneration.do();

              mcEvents.emit(
                mcEventTypes.REGENERATED,
                player.index,
                view satisfies Regenerated
              );
            }
          });
          this.mobController.forEach((controller) => {
            const regeneration = mobRegeneration(controller.goblin.mob);
            if (regeneration.has()) {
              const view = regeneration.view();
              regeneration.do();

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
      const reconnect = reconnectionToken.get();
      reconnectionToken.delete();

      if (reconnect) {
        try {
          this.room = await this.client.reconnect(reconnect);
          this.connected = true;
        } catch (error) {
          // reconnection failed
        }
      }

      if (!this.connected) {
        this.room = await this.client.joinOrCreate("relay", {
          x: this.player.sprite.x,
          y: this.player.sprite.y,
          type: this.player.character.type as CharacterType,
          name: this.player.character.name,
          mobs: this.mobController.map((mob) => ({
            x: mob.goblin.sprite.x,
            y: mob.goblin.sprite.y,
            name: mob.goblin.mob.name,
            id: mob.goblin.id ?? 0,
            type: "goblin",
          })),
        } satisfies CommandInput<ConnectPlayer>);
        this.connected = true;
      }

      if (!this.connected) throw new Error("room connection failed");

      console.log(
        `Joined as ${this.room.sessionId} index: ${this.player.index}`
      );
      reconnectionToken.set(this.room.reconnectionToken);
      this.onConnectionReady();
    } catch (error) {
      console.error(error);
    }
  }

  update(time: number, delta: number): void {
    this.playerManager.update(time, delta);
    this.mobController.forEach((mobCcontroller) => {
      if (mobCcontroller.goblin.sprite.body) mobCcontroller.update(delta);
    });

    this.player.pressingKeys = {
      W: this.keys.W.isDown,
      A: this.keys.A.isDown,
      D: this.keys.D.isDown,
      Space: this.keys.Space.isDown,
      Q: Phaser.Input.Keyboard.JustDown(this.keys.Q),
      E: Phaser.Input.Keyboard.JustDown(this.keys.E),
    };
  }
  Addkey() {
    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("keyboard is not defined");

    this.keys = {
      Space: keyboard.addKey("SPACE"),
      W: keyboard.addKey("W"),
      A: keyboard.addKey("A"),
      D: keyboard.addKey("D"),
      Q: keyboard.addKey("Q"),
      E: keyboard.addKey("E"),
    };
  }
}
