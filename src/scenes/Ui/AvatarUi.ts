import MainScene from "../main/MainScene";

export function createAvatarFrame(scene: MainScene) {
  scene.playerManager.forEach(({ UI }, i) => {
    UI.frame = scene.make.tilemap({ key: "player-avatar" });
    const avatarframe = UI.frame.addTilesetImage("frame-set", "frame-set");
    const avatarpng = UI.frame.addTilesetImage("jack-avatar", "jack-avatar");

    if (avatarframe && avatarpng) {
      UI.frame
        .createLayer("frame", avatarframe)
        ?.setScrollFactor(0)
        .setDepth(200);

      UI.frame.createLayer("parchment", avatarframe)?.setScrollFactor(0);

      UI.hearticon = UI.frame
        .createLayer("hearticon", avatarframe, 10, 60 * i)
        ?.setScrollFactor(0)!;

      UI.manaicon = UI.frame
        .createLayer("manaicon", avatarframe, 10, 130 * i)
        ?.setScrollFactor(0)!;

      UI.frame
        .createLayer("bar", avatarframe, -37, -10 * i)
        ?.setScale(1.1, 1.1)
        ?.setScrollFactor(0)
        .setDepth(100);
      UI.frame
        .createLayer("avatarpng", avatarpng, -155, -155 * i)
        ?.setScale(3, 3)
        .setScrollFactor(0);
    }
  });
}
