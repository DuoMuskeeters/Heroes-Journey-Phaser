import MainScene from "../main/MainScene";
import MobController from "../main/mobController";

export function playerhealtbar(scene: MainScene) {
  const getMaxHp = () =>
    scene.player.user.state.max_hp - scene.player.user.state.HP;
  const maxframepercent = Math.floor(scene.player.user.state.max_hp / 5);

  const rawFramePercent = getMaxHp() / maxframepercent;

  let framepercent =
    Math.floor(rawFramePercent) === 0
      ? rawFramePercent
      : Math.floor(rawFramePercent);

  if (6 <= framepercent) framepercent = 5;

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
  const getMaxSp = () =>
    scene.player.user.state.max_sp - scene.player.user.state.SP;
  const maxframepercent = Math.floor(scene.player.user.state.max_sp / 5);

  const rawFramePercent = getMaxSp() / maxframepercent;

  let framepercent =
    Math.floor(rawFramePercent) === 0
      ? rawFramePercent
      : Math.floor(rawFramePercent);
  if (6 <= framepercent) framepercent = 5;
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

export function goblinHealtbar(controller: MobController) {
  const width = 100;
  const percent =
    Math.max(0, controller.mob.goblin.state.HP) /
    controller.mob.goblin.state.max_hp;
  controller.mob.hptitle
    .setText(
      `${controller.name}: (${
        controller.mob.goblin.state.Level
      })\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(
        Math.max(0, controller.mob.goblin.state.HP)
      )}`
    )
    .setPosition(controller.mob.sprite.x - 70, controller.mob.sprite.y - 72)
    .setDepth(5);

  controller.mob.healtbar.clear();
  controller.mob.healtbar.fillStyle(0x808080);
  controller.mob.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(controller.mob.sprite.x - 50, controller.mob.sprite.y - 40);
  if (percent >= 0) {
    controller.mob.healtbar.fillStyle(0x00ff00);
    controller.mob.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(controller.mob.sprite.x - 50, controller.mob.sprite.y - 40)
      .setDepth(5);
  }
}
export function goblinspbar(controller: MobController) {
  const width = 90;
  const percent =
    Math.max(0, controller.mob.goblin.state.SP) /
    controller.mob.goblin.state.max_sp;

  controller.mob.spbar.clear();
  controller.mob.spbar.fillStyle(0x808080);
  controller.mob.spbar
    .fillRoundedRect(0, 0, width, 3, 0)
    .setPosition(controller.mob.sprite.x - 45, controller.mob.sprite.y - 30);
  if (percent > 0) {
    controller.mob.spbar.fillStyle(0xffff00);
    controller.mob.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(controller.mob.sprite.x - 45, controller.mob.sprite.y - 30)
      .setDepth(5);
  }
}
