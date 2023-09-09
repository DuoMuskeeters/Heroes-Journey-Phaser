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
      .setDepth(200)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
    scene.player.frame
      .createLayer("parchment", avatarframe)
      ?.setScrollFactor(0)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
    //@ts-ignore
    scene.player.hearticon = scene.player.frame
      .createLayer("hearticon", avatarframe, (10 / 1440) * window.innerWidth, 0)
      ?.setScrollFactor(0)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
    //@ts-ignore
    scene.player.manaicon = scene.player.frame
      .createLayer(
        "manaicon",
        avatarframe,
        (10 / 1440) * window.innerWidth,
        (3 / 900) * window.innerHeight
      )
      ?.setScrollFactor(0)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);

    scene.player.frame
      .createLayer(
        "bar",
        avatarframe,
        (-37 / 1440) * window.innerWidth,
        (-10 / 900) * window.innerHeight
      )
      ?.setScale(
        (1.1 / 1440) * window.innerWidth,
        (1.1 / 900) * window.innerHeight
      )
      ?.setScrollFactor(0)
      .setDepth(100);
    scene.player.frame
      .createLayer(
        "avatarpng",
        avatarpng,
        (-155 / 1440) * window.innerWidth,
        (-155 / 900) * window.innerHeight
      )
      ?.setScale((3 / 1440) * window.innerWidth, (3 / 900) * window.innerHeight)
      .setScrollFactor(0);
  }
}
