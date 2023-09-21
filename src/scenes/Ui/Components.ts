import MainScene from "../main/MainScene";
import goblinController from "../../objects/Mob/goblinController";

export function playerhealtbar(scene: MainScene) {
  const state = scene.player.character.state;
  const getMaxHp = () => state.max_hp - state.HP;
  const maxframepercent = Math.floor(state.max_hp / 5);

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
    scene.playerUI.hpbar.anims.play("hp-bar", true);
  }
  scene.playerUI.hptitle.setText(
    `${Math.round(Math.max(0, scene.player.character.state.HP))}`
  );
}
export function playerspbar(scene: MainScene) {
  const state = scene.player.character.state;
  const getMaxSp = () =>
    scene.player.character.state.max_sp - scene.player.character.state.SP;
  const maxframepercent = Math.floor(state.max_sp / 5);

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
    scene.playerUI.manabar.anims.play("mana-bar", true);
  }
  if (state.SP >= 50) {
    scene.playerUI.sptitle.setTint(0x71e5f2);
    scene.playerUI.manaicon.setTint(0xffffff);
  } else {
    scene.playerUI.sptitle.setTint(0x4396d6);
    scene.playerUI.manaicon.setTint(0x4396d6);
  }
  scene.playerUI.sptitle.setText(`${Math.round(Math.max(0, state.SP))}`);
}

export function goblinHealtbar(controller: goblinController) {
  const width = 100;
  const percent =
    Math.max(0, controller.goblin.mob.state.HP) /
    controller.goblin.mob.state.max_hp;
  controller.mobUI.hptitle
    .setText(
      `${controller.goblin.name}: (${
        controller.goblin.mob.state.Level
      })\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(
        Math.max(0, controller.goblin.mob.state.HP)
      )}`
    )
    .setPosition(
      controller.goblin.sprite.x - 70,
      controller.goblin.sprite.y - 72
    )
    .setDepth(5);

  controller.mobUI.healtbar.clear();
  controller.mobUI.healtbar.fillStyle(0x808080);
  controller.mobUI.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(
      controller.goblin.sprite.x - 50,
      controller.goblin.sprite.y - 40
    );
  if (percent >= 0) {
    controller.mobUI.healtbar.fillStyle(0x00ff00);
    controller.mobUI.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(
        controller.goblin.sprite.x - 50,
        controller.goblin.sprite.y - 40
      )
      .setDepth(5);
  }
}
export function goblinspbar(controller: goblinController) {
  const width = 90;
  const percent =
    Math.max(0, controller.goblin.mob.state.SP) /
    controller.goblin.mob.state.max_sp;

  controller.mobUI.spbar.clear();
  controller.mobUI.spbar.fillStyle(0x808080);
  controller.mobUI.spbar
    .fillRoundedRect(0, 0, width, 3, 0)
    .setPosition(
      controller.goblin.sprite.x - 45,
      controller.goblin.sprite.y - 30
    );
  if (percent > 0) {
    controller.mobUI.spbar.fillStyle(0xffff00);
    controller.mobUI.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(
        controller.goblin.sprite.x - 45,
        controller.goblin.sprite.y - 30
      )
      .setDepth(5);
  }
}
