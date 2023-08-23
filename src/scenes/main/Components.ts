import MainScene from "./MainScene";

export function healtbar(scene: MainScene) {
  const width = 200;
  const percent =
    Math.max(0, scene.player.user.state.HP) / scene.player.user.state.max_hp;
  scene.player.hptitle
    .setText(
      `${Math.round(Math.max(0, scene.player.user.state.HP))}\n\n${
        scene.player.user.state.SP
      }\nJack/${scene.player.user.state.Level}-level`
    )
    .setPosition(scene.player.sprite.x, 30);

  scene.player.healtbar.clear();
  scene.player.healtbar.fillStyle(0x808080);
  scene.player.healtbar
    .fillRoundedRect(0, 0, width, 24, 5)
    .setPosition(scene.player.sprite.x, 10);
  if (percent > 0) {
    scene.player.healtbar.fillStyle(0x00ff00);
    scene.player.healtbar
      .fillRoundedRect(0, 0, width * percent, 24, 5)
      .setPosition(scene.player.sprite.x, 10);
  }
}
export function goblinHealtbar(scene: MainScene) {
  const width = 100;
  const percent =
    Math.max(0, scene.goblin.mob.state.HP) / scene.goblin.mob.state.max_hp;
  scene.goblin.hptitle
    .setText(
      `${
        scene.goblin.mob.state.Level
      }-level\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(
        Math.max(0, scene.goblin.mob.state.HP)
      )}`
    )
    .setPosition(scene.goblin.sprite.x, 30)
    .setDepth(5);

  scene.goblin.healtbar.clear();
  scene.goblin.healtbar.fillStyle(0x808080);
  scene.goblin.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(scene.goblin.sprite.x, 10);
  if (percent > 0) {
    scene.goblin.healtbar.fillStyle(0x00ff00);
    scene.goblin.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(scene.goblin.sprite.x, 10)
      .setDepth(5);
  }
}
export function playerspbar(scene: MainScene) {
  const width = 200;
  const percent =
    Math.max(0, scene.player.user.state.SP) / scene.player.user.state.max_sp;

  scene.player.spbar.clear();
  scene.player.spbar.fillStyle(0x808080);
  scene.player.spbar
    .fillRoundedRect(0, 0, width, 18, 5)
    .setPosition(scene.player.sprite.x, 10);
  if (percent > 0) {
    scene.player.spbar.fillStyle(0x00ffff);
    scene.player.spbar
      .fillRoundedRect(0, 0, width * percent, 18, 5)
      .setPosition(scene.player.sprite.x, 10);
  }
}
