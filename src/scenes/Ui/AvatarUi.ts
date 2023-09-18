import MainScene from "../main/MainScene";

export function createAvatarFrame(scene: MainScene) {
  scene.playerUI.frame = scene.make.tilemap({ key: "player-avatar" });
  const avatarframe = scene.playerUI.frame.addTilesetImage(
    "frame-set",
    "frame-set"
  );
  const avatarpng = scene.playerUI.frame.addTilesetImage(
    "jack-avatar",
    "jack-avatar"
  );
  if (avatarframe && avatarpng) {
    scene.playerUI.frame
      .createLayer("frame", avatarframe)
      ?.setScrollFactor(0)
      .setDepth(200);

    scene.playerUI.frame
      .createLayer("parchment", avatarframe)
      ?.setScrollFactor(0);

    scene.playerUI.hearticon = scene.playerUI.frame
      .createLayer("hearticon", avatarframe, 10, 0)
      ?.setScrollFactor(0)!;

    scene.playerUI.manaicon = scene.playerUI.frame
      .createLayer("manaicon", avatarframe, 10, 3)
      ?.setScrollFactor(0)!;

    scene.playerUI.frame
      .createLayer("bar", avatarframe, -37, -10)
      ?.setScale(1.1, 1.1)
      ?.setScrollFactor(0)
      .setDepth(100);
    scene.playerUI.frame
      .createLayer("avatarpng", avatarpng, -155, -155)
      ?.setScale(3, 3)
      .setScrollFactor(0);
  }
}
