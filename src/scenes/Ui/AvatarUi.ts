import MainScene from "../main/MainScene";

export function createAvatarFrame(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const frame = scene.make.tilemap({ key: "main-player-ui" });
    const avatarframe = frame.addTilesetImage("frame-set", "frame-set");
    const avatarpng = frame.addTilesetImage("jack-avatar", "jack-avatar");
    const otherPlayersFrame = scene.make.tilemap({ key: "other-players-ui" });
    if (i === 0) {
      UI.frameLayer = frame
        .createLayer("frame", [avatarframe!])
        ?.setScrollFactor(0)
        .setDepth(200)!;

      frame.createLayer("parchement", avatarframe!)?.setScrollFactor(0);

      frame
        .createLayer("jack-avatar", avatarpng!)
        ?.setScale(4)
        .setScrollFactor(0)
        .setPosition(-230, -300);
    } else {
      UI.playerindexText = scene.add.text(0, 0, `PLAYER: ${player.index + 1}`);
      UI.playerleveltext = scene.add.text(0, 0, `${player.character.level}`);
      UI.frameLayer = otherPlayersFrame
        .createLayer("frame", [avatarframe!])
        ?.setDepth(200)
        .setScale(0.8)!;
    }
  });
}
