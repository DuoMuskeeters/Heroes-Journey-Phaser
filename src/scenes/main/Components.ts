import MainScene from "./MainScene";

export function healtbar(scene: MainScene) {
  const width = 200;
  const percent = Math.max(0, scene.player.user.state.HP) / 200;
  scene.player.hptitle
    .setText(`${Math.round(Math.max(0, scene.player.user.state.HP))}`)
    .setPosition(scene.player.sprite.x, 30);

  scene.player.healtbar.clear();
  scene.player.healtbar.fillStyle(0x808080);
  scene.player.healtbar
    .fillRoundedRect(0, 0, width, 20, 5)
    .setPosition(scene.player.sprite.x, 10);
  if (percent > 0) {
    scene.player.healtbar.fillStyle(0x00ff00);
    scene.player.healtbar
      .fillRoundedRect(0, 0, width * percent, 20, 5)
      .setPosition(scene.player.sprite.x, 10);
  }
}
export function goblinHealtbar(scene: MainScene) {
  const width = 400;
  const percent = Math.max(0, scene.goblin.mob.state.HP) / 400;
  scene.goblin.hptitle
    .setText(`${Math.round(Math.max(0, scene.goblin.mob.state.HP))}`)
    .setPosition(scene.goblin.sprite.x, 30);

  scene.goblin.healtbar.clear();
  scene.goblin.healtbar.fillStyle(0x808080);
  scene.goblin.healtbar
    .fillRoundedRect(0, 0, width, 20, 5)
    .setPosition(scene.goblin.sprite.x, 10);
  if (percent > 0) {
    scene.goblin.healtbar.fillStyle(0x00ff00);
    scene.goblin.healtbar
      .fillRoundedRect(0, 0, width * percent, 20, 5)
      .setPosition(scene.goblin.sprite.x, 10);
  }
}
