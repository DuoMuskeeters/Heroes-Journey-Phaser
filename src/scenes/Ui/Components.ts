import MainScene from "../main/MainScene";
import goblinController from "../../objects/Mob/goblinController";

export function UI_createPlayers(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    i++;
    UI.hpbar = scene.add
      .sprite(238, 76 * i, "hp-bar")
      .setScale(5, 2.7)
      .setDepth(5)
      .setScrollFactor(0);
    UI.manabar = scene.add
      .sprite(214, 112 * i, "mana-bar")
      .setScale(3.8, 2.7)
      .setDepth(5)
      .setScrollFactor(0);

    UI.hptitle = scene.add
      .text(370, 65 * i, `${player.character.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0);

    UI.sptitle = scene.add
      .text(340, 103 * i, `${player.character.state.SP}`)
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0);
  });
}

export function UI_updatePlayersHP(scene: MainScene) {
  // TODO: use playerManager instead of scene (remove scene.anims.remove code below first)
  scene.playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    const getMaxHp = () => state.max_hp - state.HP;
    const maxframepercent = Math.floor(state.max_hp / 5);

    const rawFramePercent = getMaxHp() / maxframepercent;

    let framepercent =
      Math.floor(rawFramePercent) === 0
        ? rawFramePercent
        : Math.floor(rawFramePercent);

    if (6 <= framepercent) framepercent = 5;

    if (framepercent >= 1 || framepercent === 0) {
      // TODO: remove this if statement
      // anims.remove should not be called since we are updating every player
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
      UI.hpbar.anims.play("hp-bar", true);
    }
    UI.hptitle.setText(`${Math.round(Math.max(0, state.HP))}`);
  });
}
export function UI_updatePlayersSP(scene: MainScene) {
  // TODO: use playerManager instead of scene (remove scene.anims.remove code below first)
  scene.playerManager.forEach(({ player, UI }) => {
    const state = player.character.state;
    const getMaxSp = () => state.max_sp - state.SP;
    const maxframepercent = Math.floor(state.max_sp / 5);

    const rawFramePercent = getMaxSp() / maxframepercent;

    let framepercent =
      Math.floor(rawFramePercent) === 0
        ? rawFramePercent
        : Math.floor(rawFramePercent);
    if (6 <= framepercent) framepercent = 5;
    if (framepercent >= 1 || framepercent === 0) {
      // TODO: remove this if statement
      // anims.remove should not be called since we are updating every player
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
      UI.manabar.anims.play("mana-bar", true);
    }
    if (state.SP >= 50) {
      UI.sptitle.setTint(0x71e5f2);
      UI.manaicon.setTint(0xffffff);
    } else {
      UI.sptitle.setTint(0x4396d6);
      UI.manaicon.setTint(0x4396d6);
    }
    UI.sptitle.setText(`${Math.round(Math.max(0, state.SP))}`);
  });
}

export function goblinHealtbar(controller: goblinController) {
  const goblin = controller.goblin;
  const state = goblin.mob.state;
  const UI = controller.mobUI;
  const width = 100;
  const percent = Math.max(0, state.HP) / state.max_hp;

  UI.hptitle
    .setText(
      `${goblin.name}: (${
        state.Level
      })\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(
        Math.max(0, state.HP)
      )}`
    )
    .setPosition(goblin.sprite.x - 70, goblin.sprite.y - 72)
    .setDepth(5);

  UI.healtbar.clear();
  UI.healtbar.fillStyle(0x808080);
  UI.healtbar
    .fillRoundedRect(0, 0, width, 10, 5)
    .setPosition(goblin.sprite.x - 50, goblin.sprite.y - 40);
  if (percent >= 0) {
    UI.healtbar.fillStyle(0x00ff00);
    UI.healtbar
      .fillRoundedRect(0, 0, width * percent, 10, 5)
      .setPosition(goblin.sprite.x - 50, goblin.sprite.y - 40)
      .setDepth(5);
  }
}
export function goblinspbar(controller: goblinController) {
  const goblin = controller.goblin;
  const state = goblin.mob.state;
  const UI = controller.mobUI;
  const width = 90;
  const percent = Math.max(0, state.SP) / state.max_sp;

  UI.spbar.clear();
  UI.spbar.fillStyle(0x808080);
  UI.spbar
    .fillRoundedRect(0, 0, width, 3, 0)
    .setPosition(goblin.sprite.x - 45, goblin.sprite.y - 30);
  if (percent > 0) {
    UI.spbar.fillStyle(0xffff00);
    UI.spbar
      .fillRoundedRect(0, 0, width * percent, 3, 0)
      .setPosition(goblin.sprite.x - 45, goblin.sprite.y - 30)
      .setDepth(5);
  }
}
