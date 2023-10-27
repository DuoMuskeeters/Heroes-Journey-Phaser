import { PlayerManager } from "../../../objects/player/manager";
import { addTilesetImage, createLayer } from "./utils";

export function createAvatarFrame(
  scene: Phaser.Scene,
  playerItem: PlayerManager[number]
) {
  const { player, UI } = playerItem;
  const frame = scene.make.tilemap({ key: "main-player-ui" });
  const avatarframe = addTilesetImage(frame, "frame-set", "frame-set");
  const avatarpng = addTilesetImage(frame, "jack-avatar", "jack-avatar");
  const otherPlayersFrame = scene.make.tilemap({ key: "other-players-ui" });
  console.log("createAvatarFrame", player.index);
  console.log("createAvatarFrame scene", scene.scene.key);
  if (player.isMainPlayer()) {
    UI.frameLayer = createLayer(frame, "frame", [avatarframe])
      .setScrollFactor(0)
      .setDepth(200);

    createLayer(frame, "parchement", avatarframe).setScrollFactor(0);

    createLayer(frame, "jack-avatar", avatarpng)
      .setScale(4)
      .setScrollFactor(0)
      .setPosition(-230, -300);
  } else {
    console.log("----------------")
    UI.playerindexText = scene.add
      .text(0, 0, `PLAYER: ${player.index + 1}`)
      .setFont("bold 15px Arial")
      .setScrollFactor(1)
      .setScale(1 / 2.5);
    UI.playerleveltext = scene.add
      .text(0, 0, `${player.character.level}`)
      .setScrollFactor(1)
      .setScale(1 / 2.5);
    UI.frameLayer = createLayer(otherPlayersFrame, "frame", [avatarframe])
      .setDepth(200)
      .setScale(0.8)
      .setScrollFactor(1)
      .setScale(1 / 2.5);
  }
}
