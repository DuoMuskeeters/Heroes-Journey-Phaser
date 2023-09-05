import MainScene from "./MainScene";

export function healtbar(scene: MainScene) {
  const getMaxHp = () =>
    scene.player.user.state.max_hp - scene.player.user.state.HP;
  const maxframepercent = Math.floor(scene.player.user.state.max_hp / 5);

  // 0 -> int
  // 0.1 -> float
  // 0.2 -> float
  // 0.3 -> float
  // 0.4 -> float
  // * -> int
  // 50.4 -> int (50)
  const rawFramePercent = getMaxHp() / maxframepercent;

  let framepercent =
    Math.floor(rawFramePercent) === 0
      ? rawFramePercent
      : Math.floor(rawFramePercent);

  if (framepercent >= 1 || framepercent === 0) {
    scene.anims.remove("hp-bar");
    scene.anims.create({
      key: "hp-bar",
      frames: scene.anims.generateFrameNumbers("hp-bar", {
        start: framepercent,
        end: framepercent,
      }),
      frameRate: 10,
      repeat: 0,
    });
    scene.player.hpbar.anims.play("hp-bar", true);
  }
  scene.player.hptitle.setText(
    `${Math.round(Math.max(0, scene.player.user.state.HP))}`
  );
}
export function playerspbar(scene: MainScene) {
  const maxframepercent = Math.floor(scene.player.user.state.max_sp / 5);
  const framepercent =
    Math.floor(
      (scene.player.user.state.max_sp - scene.player.user.state.SP) /
        maxframepercent
    ) === 0
      ? (scene.player.user.state.max_sp - scene.player.user.state.SP) /
        maxframepercent
      : Math.floor(
          (scene.player.user.state.max_sp - scene.player.user.state.SP) /
            maxframepercent
        );
  if (framepercent >= 1 || framepercent === 0) {
    scene.anims.remove("mana-bar");
    scene.anims.create({
      key: "mana-bar",
      frames: scene.anims.generateFrameNumbers("mana-bar", {
        start: framepercent,
        end: framepercent,
      }),
      frameRate: 10,
      repeat: 0,
    });
    scene.player.manabar.anims.play("mana-bar", true);
  }
  if (scene.player.user.state.SP >= 50) {
    scene.player.sptitle.setTint(0x71e5f2);
    scene.player.manaicon.setTint(0xffffff);
  } else {
    scene.player.sptitle.setTint(0x4396d6);
    scene.player.manaicon.setTint(0x4396d6);
  }
  scene.player.sptitle.setText(
    `${Math.round(Math.max(0, scene.player.user.state.SP))}`
  );
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
    .setPosition(scene.goblin.sprite.x - 50, scene.goblin.sprite.y - 40);
  if (percent > 0) {
    scene.goblin.healtbar.fillStyle(0x00ff00);
    scene.goblin.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(scene.goblin.sprite.x - 50, scene.goblin.sprite.y - 40)
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
    .setPosition(scene.goblin.sprite.x - 45, scene.goblin.sprite.y - 30);
  if (percent > 0) {
    scene.goblin.spbar.fillStyle(0xffff00);
    scene.goblin.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(scene.goblin.sprite.x - 45, scene.goblin.sprite.y - 30)
      .setDepth(5);
  }
}
