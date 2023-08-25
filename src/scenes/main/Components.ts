import MainScene from "./MainScene";

export function healtbar(scene: MainScene) {
  const width = 200;
  const percent =
    Math.max(0, scene.player.user.state.HP) / scene.player.user.state.max_hp;
  scene.player.hptitle
    .setText(
      `${Math.round(Math.max(0, scene.player.user.state.HP))}\n\n${Math.round(
        scene.player.user.state.SP
      )}\nJack/${scene.player.user.state.Level}-level`
    )
    .setPosition(scene.player.sprite.x - 240, 10);

  scene.player.healtbar.clear();
  scene.player.healtbar.fillStyle(0x808080);
  scene.player.healtbar
    .fillRoundedRect(0, 0, width, 24, 5)
    .setPosition(scene.player.sprite.x - 240, 10);
  if (percent > 0) {
    scene.player.healtbar.fillStyle(0x00ff00);
    scene.player.healtbar
      .fillRoundedRect(0, 0, width * percent, 24, 5)
      .setPosition(scene.player.sprite.x - 240, 10);
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
    .setPosition(scene.player.sprite.x - 240, 63);
  if (percent > 0) {
    scene.player.spbar.fillStyle(0x00ffff);
    scene.player.spbar
      .fillRoundedRect(0, 0, width * percent, 18, 5)
      .setPosition(scene.player.sprite.x - 240, 63);
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
    .setPosition(scene.goblin.sprite.x - 70, scene.goblin.sprite.y - 72)
    .setDepth(5);

  scene.goblin.healtbar.clear();
  scene.goblin.healtbar.fillStyle(0x808080);
  scene.goblin.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(
      scene.goblin.sprite.x - 50,
      scene.goblin.sprite.y - 40
    );
  if (percent > 0) {
    scene.goblin.healtbar.fillStyle(0x00ff00);
    scene.goblin.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(
      scene.goblin.sprite.x - 50,
      scene.goblin.sprite.y - 40
    )
      .setDepth(5);
  }
}
export function goblinspbar(scene: MainScene) {
  const width = 90;
  const percent =
    Math.max(0, scene.goblin.mob.state.SP) / scene.goblin.mob.state.max_sp;

  scene.goblin.spbar.clear();
  scene.goblin.spbar.fillStyle(0x808080);
  scene.goblin.spbar
    .fillRoundedRect(0, 0, width, 3, 0)
    .setPosition(
      scene.goblin.sprite.x - 45,
      scene.goblin.sprite.y - 30
    );
  if (percent > 0) {
    scene.goblin.spbar.fillStyle(0xffff00);
    scene.goblin.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(
      scene.goblin.sprite.x - 45,
      scene.goblin.sprite.y - 30
    )
      .setDepth(5);
  }
}
