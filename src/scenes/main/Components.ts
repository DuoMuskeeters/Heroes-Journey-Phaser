import MainScene from "./MainScene";

export function healtbar(scene: MainScene) {
  const width = 250;
  const percent = Phaser.Math.Clamp(scene.player.hp, 0, 100) / 100;

  scene.player.healtbar.clear();
  scene.player.healtbar.fillStyle(0x808080);
  scene.player.healtbar.fillRoundedRect(
    scene.player.sprite.x,
    10,
    width,
    20,
    5
  );
  if (percent > 0) {
    scene.player.healtbar.fillStyle(0x00ff00);
    scene.player.healtbar.fillRoundedRect(
      scene.player.sprite.x,
      10,
      width * percent,
      20,
      5
    );
  }
}
