import { PlayerManager } from "../../../objects/player/manager";
import type MainScene from "../main/MainScene";
import { addTilesetImage, createLayer } from "./utils";

export function createAvatarFrame(
  scene: MainScene,
  playerItem: PlayerManager[number]
) {
  const { player, UI } = playerItem;
  const frame = scene.make.tilemap({ key: "main-player-ui" });
  const avatarframe = addTilesetImage(frame, "frame-set", "frame-set");
  const avatarpng = addTilesetImage(frame, "jack-avatar", "jack-avatar");
  const otherPlayersFrame = scene.make.tilemap({ key: "other-players-ui" });
  if (player.index === 0) {
    UI.frameLayer = createLayer(frame, "frame", [avatarframe])
      .setScrollFactor(0)
      .setDepth(200);

    createLayer(frame, "parchement", avatarframe).setScrollFactor(0);

    createLayer(frame, "jack-avatar", avatarpng)
      .setScale(4)
      .setScrollFactor(0)
      .setPosition(-230, -300);
  } else {
    UI.playerindexText = scene.add.text(0, 0, `PLAYER: ${player.index + 1}`);
    UI.playerleveltext = scene.add.text(0, 0, `${player.character.level}`);
    UI.frameLayer = createLayer(otherPlayersFrame, "frame", [avatarframe])
      .setDepth(200)
      .setScale(0.8);
  }
}
