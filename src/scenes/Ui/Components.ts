import type MainScene from "../main/MainScene";
import type goblinController from "../../objects/Mob/goblinController";
import { createBar } from "../main/Anims";
import { type PlayerManager } from "../../objects/player/manager";

import type Phaser from "phaser";

export function UI_createPlayers(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const isscroolFactor = i === 0 ? 0 : 1;

    const Center = UI.frameLayer.getCenter<Phaser.Tilemaps.TilemapLayer>();
    const LeftCenterX =
      UI.frameLayer.getLeftCenter<Phaser.Tilemaps.TilemapLayer>().x;
    const BottomCenterY =
      UI.frameLayer.getBottomCenter<Phaser.Tilemaps.TilemapLayer>().y;

    UI.hpBar = scene.add
      .sprite(LeftCenterX + 270, Center.y + 3, `hpBar`)
      .setScale(5.5, 7)
      .setDepth(5)
      .setScrollFactor(isscroolFactor);
    UI.spBar = scene.add
      .sprite(LeftCenterX + 227, BottomCenterY - 25, `spBar-${isscroolFactor}`)
      .setScale(3.1, 5)
      .setDepth(4)
      .setScrollFactor(isscroolFactor);
    UI.hptext = scene.add
      .text(
        UI.hpBar.getCenter(UI.hpBar).x - 15,
        UI.hpBar.getCenter(UI.hpBar).y - 7,
        `${player.character.state.HP}`
      )
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(isscroolFactor)
      .setScale(0.8)
      .setDepth(500);

    UI.sptext = scene.add
      .text(
        UI.spBar.getCenter(UI.spBar).x - 10,
        UI.spBar.getCenter(UI.spBar).y - 8,
        `${player.character.state.SP}`
      )
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(isscroolFactor)
      .setScale(0.8)
      .setDepth(500);
  });
}
const UI_updateHP = (
  scene: MainScene,
  { player, UI }: PlayerManager[number]
) => {
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
    createBar(scene, framepercent, "hpBar", player.index);
    UI.hpBar.anims.play(`hpBar-${player.index}`, true);
  }
};
const UI_updateSP = (
  scene: MainScene,
  { player, UI }: PlayerManager[number]
) => {
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
    createBar(scene, framepercent, "hpBar", player.index);
    createBar(scene, framepercent, "spBar", player.index);
    UI.spBar.anims.play(`spBar-${player.index}`, true);
  }
};
export function UI_updateOtherPlayers(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    if (i === 0) return;
    UI.frameLayer.setPosition(player.sprite.x - 60, player.sprite.y - 170);
    UI.playerindexText.setPosition(UI.frameLayer.x, UI.frameLayer.y + 20);
    UI.playerleveltext
      .setPosition(UI.frameLayer.x + 20, UI.frameLayer.y + 53)
      .setScale(1.5);
  });
}
export function UI_updatePlayersHP(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    const UIhpText = UI.hptext;
    UIhpText.setText(`${Math.floor(state.HP)}`);
    UI_updateHP(scene, scene.playerManager[i]);
    if (i !== 0) {
      UI.hpBar
        .setScale(3, 3)
        .setPosition(UI.frameLayer.x - 35, UI.frameLayer.y + 50);

      UIhpText.setPosition(
        UI.hpBar.getRightCenter(UI.hpBar).x + 120,
        UI.hpBar.getRightCenter(UI.hpBar).y - 10
      )
        .setScrollFactor(1)
        .setScale(0.7);
    }
  });
}

export function UI_updatePlayersSP(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    UI_updateSP(scene, scene.playerManager[i]);
    const UIspText = UI.sptext;
    UIspText.setText(`${Math.floor(state.SP)}`);

    if (i !== 0) {
      UI.spBar
        .setScale(2.1, 3)
        .setPosition(UI.frameLayer.x - 10, UI.frameLayer.y + 75);

      UIspText.setPosition(
        UI.spBar.getRightCenter(UI.spBar).x + 90,
        UI.spBar.getRightCenter(UI.spBar).y - 6
      )
        .setScrollFactor(1)
        .setScale(0.7);
    }
  });
}

export function goblinHealtbar(controller: goblinController) {
  const goblin = controller.goblin;
  const state = goblin.mob.state;
  const UI = controller.mobUI;
  const width = 100;
  const percent = state.HP / state.max_hp;

  UI.hptitle
    .setText(
      `${goblin.name}: (${
        goblin.mob.tier
      })\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(state.HP)}`
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
  const percent = state.SP / state.max_sp;

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
