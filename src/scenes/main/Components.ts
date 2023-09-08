import MainScene from "./MainScene";
import MobController from "./mobController";

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

export function goblinHealtbar(scene: MobController) {
  const width = 100;
  const percent =
    Math.max(0, scene.mob.mob.state.HP) / scene.mob.mob.state.max_hp;
  scene.mob.hptitle
    .setText(
      `${
        scene.mob.mob.state.Level
      }-level\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(
        Math.max(0, scene.mob.mob.state.HP)
      )}`
    )
    .setPosition(scene.mobrect.x - 70, scene.mobrect.y - 72)
    .setDepth(5);

  scene.mob.healtbar.clear();
  scene.mob.healtbar.fillStyle(0x808080);
  scene.mob.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(scene.mobrect.x - 50, scene.mobrect.y - 40);
  if (percent > 0) {
    scene.mob.healtbar.fillStyle(0x00ff00);
    scene.mob.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(scene.mobrect.x - 50, scene.mobrect.y - 40)
      .setDepth(5);
  }
}
export function goblinspbar(scene: MobController) {
  const width = 90;
  const percent =
    Math.max(0, scene.mob.mob.state.SP) / scene.mob.mob.state.max_sp;

  scene.mob.spbar.clear();
  scene.mob.spbar.fillStyle(0x808080);
  scene.mob.spbar
    .fillRoundedRect(0, 0, width, 3, 0)
    .setPosition(scene.mobrect.x - 45, scene.mobrect.y - 30);
  if (percent > 0) {
    scene.mob.spbar.fillStyle(0xffff00);
    scene.mob.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(scene.mobrect.x - 45, scene.mobrect.y - 30)
      .setDepth(5);
  }
}
