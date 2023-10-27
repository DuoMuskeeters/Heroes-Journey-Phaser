import "@geckos.io/phaser-on-nodejs";

console.warn("Server Speaking...");

import Phaser from "phaser";
import { preloadAssets } from "../../../client/scenes/preLoad/assets";
import { publicFolder } from "../../app.config";
import { createground } from "../../../client/scenes/main/TileGround";
import { RelayState, ServerPlayer } from "../schema/RelayRoomState";
import { Player } from "../../../objects/player";
import { loadAnimations } from "../../../client/scenes/main/Anims";
import goblinController from "../../../objects/Mob/goblinController";
import type { RelayRoom } from "./RelayRoom";

// set the fps you need
const FPS = 60;
global.phaserOnNodeFPS = FPS; // default is 60

export class ServerScene extends Phaser.Scene {
  tilemap!: Phaser.Tilemaps.Tilemap;
  road!: Phaser.Tilemaps.TilemapLayer;
  state!: RelayState;
  room!: RelayRoom;

  mobController: goblinController[] = [];

  constructor() {
    super("server-load-scene");
  }

  preload() {
    console.log("server scene preload");
    this.load.setBaseURL(publicFolder);
    preloadAssets(this);
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "roadfile" });
    loadAnimations(this);
    createground(this);
    this.matter.world.setBounds(
      this.road.x,
      0,
      this.road.width,
      CONFIG_SERVER.height
    );

    console.log(
      "server scene created with",
      this.state.players.size,
      "players"
    );
  }

  update(time: number, delta: number) {
    this.state.players.forEach((player) => {
      if (!player.clientP) return;
      const keys = player.waitingKeys.splice(0, player.waitingKeys.length);
      keys.forEach((key) => {
        player.clientP!.pressingKeys = key;
        player.clientP!.update(Date.now(), delta);
      });
      player.x = player.clientP.sprite.x;
      player.y = player.clientP.sprite.y;
      console.log("player", player.sessionId, player.x);
      console.log("-----------------------");
    });
  }

  onPlayerJoin(player: ServerPlayer) {
    console.log(
      "player joined session:",
      player.sessionId,
      "to room:",
      this.room.roomId
    );
    player.clientP = new Player(player.character, player.sessionId);
    player.clientP.create(this, player.x, player.y, this.state.players.size);
    this.initCollisionEventForPlayer(player);
  }

  onPlayerLeave(player: ServerPlayer) {
    console.log("player left", player.character.type);
    player.clientP!.sprite.destroy();
    player.clientP!.attackrect.destroy();
  }

  initCollisionEvents() {
    // this.matter.world.on("collisionstart", (event: any) => {
  }

  initCollisionEventForPlayer(player: ServerPlayer) {
    // player.clientP!.attackrect.setOnCollideActive(
    //   (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
    //     console.log("collide", data.bodyA.label, data.bodyB.label);
    //   }
    // );
  }
}

// prepare the config for Phaser
export const CONFIG_SERVER = {
  type: Phaser.HEADLESS,
  dom: {
    createContainer: false,
  },
  width: 1600,
  height: 900,
  banner: false,
  audio: { noAudio: true, disableWebAudio: true },
  fps: {
    target: FPS,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 },
    },
  },
} satisfies Phaser.Types.Core.GameConfig;
