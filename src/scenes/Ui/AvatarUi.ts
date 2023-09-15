import MainScene from "../main/MainScene";

export function createAvatarFrame(scene: MainScene) {
  scene.player.frame = scene.make.tilemap({ key: "player-avatar" });
  const avatarframe = scene.player.frame.addTilesetImage(
    "frame-set",
    "frame-set"
  );
  const avatarpng = scene.player.frame.addTilesetImage(
    "jack-avatar",
    "jack-avatar"
  );
  if (avatarframe && avatarpng) {
    scene.player.frame
      .createLayer("frame", avatarframe)
      ?.setScrollFactor(0)
      .setDepth(200);

    scene.player.frame
      .createLayer("parchment", avatarframe)
      ?.setScrollFactor(0);

    scene.player.hearticon = scene.player.frame
      .createLayer("hearticon", avatarframe, 10, 0)
      ?.setScrollFactor(0)!;

    scene.player.manaicon = scene.player.frame
      .createLayer("manaicon", avatarframe, 10, 3)
      ?.setScrollFactor(0)!;

    scene.player.frame
      .createLayer("bar", avatarframe, -37, -10)
      ?.setScale(1.1, 1.1)
      ?.setScrollFactor(0)
      .setDepth(100);
    scene.player.frame
      .createLayer("avatarpng", avatarpng, -155, -155)
      ?.setScale(3, 3)
      .setScrollFactor(0);
  }
}
