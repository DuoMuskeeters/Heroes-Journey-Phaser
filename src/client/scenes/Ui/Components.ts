import type goblinController from "../../../objects/Mob/goblinController";
import { createBar } from "../main/Anims";
import { type PlayerManager } from "../../../objects/player/manager";

import type Phaser from "phaser";

export function UI_createPlayer(
  scene: Phaser.Scene,
  playerItem: PlayerManager[number]
) {
  const { player, UI } = playerItem;
  const isscroolFactor = player.index === 0 ? 0 : 1;

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
}
const UI_updateHP = (
  scene: Phaser.Scene,
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
  scene: Phaser.Scene,
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
export function UI_updateOtherPlayers(playerManager: PlayerManager) {
  playerManager.forEach(({ player, UI }, i) => {
    if (i === 0) return;
    UI.frameLayer.setPosition(player.sprite.x - 60, player.sprite.y - 160);
    UI.playerindexText.setPosition(UI.frameLayer.x, UI.frameLayer.y);
    UI.playerleveltext
      .setPosition(UI.frameLayer.x + 30, UI.frameLayer.y + 40)
      .setScale(1.5);
  });
}
export function UI_updatePlayersHP(
  scene: Phaser.Scene,
  playerManager: PlayerManager
) {
  playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    const UIhpText = UI.hptext;
    UIhpText.setText(`${Math.floor(state.HP)}`);
    UI_updateHP(scene, playerManager[i]);
    if (i !== 0) {
      UI.hpBar
        .setScale(3, 3)
        .setPosition(UI.frameLayer.x - 8, UI.frameLayer.y + 50);

      UIhpText.setPosition(
        UI.hpBar.getRightCenter(UI.hpBar).x + 120,
        UI.hpBar.getRightCenter(UI.hpBar).y - 10
      )
        .setScrollFactor(1)
        .setScale(0.7);
    }
  });
}

export function UI_updatePlayersSP(
  scene: Phaser.Scene,
  playerManager: PlayerManager
) {
  playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    UI_updateSP(scene, playerManager[i]);
    const UIspText = UI.sptext;
    UIspText.setText(`${Math.floor(state.SP)}`);

    if (i !== 0) {
      UI.spBar
        .setScale(2.1, 3)
        .setPosition(UI.frameLayer.x + 17, UI.frameLayer.y + 75);

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
  const healtBar = controller.mobUI.healtbar;
  const width = 50;
  const height = 6;
  const radius = 3;
  const percent = state.HP / state.max_hp;

  controller.mobUI.hptitle
    .setText(
      `${goblin.mob.name}: (${
        goblin.mob.tier
      })\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${Math.round(state.HP)}`
    )
    .setPosition(goblin.sprite.x - 35, goblin.sprite.y - 40)
    .setDepth(5);

  healtBar.clear();
  healtBar.fillStyle(0x808080);
  healtBar
    .fillRoundedRect(0, 0, width, height, radius)
    .setPosition(goblin.sprite.x - 25, goblin.sprite.y - 25);
  if (percent >= 0) {
    healtBar.fillStyle(0x00ff00);
    healtBar
      .fillRoundedRect(0, 0, width * percent, height, radius)
      .setPosition(goblin.sprite.x - 25, goblin.sprite.y - 25)
      .setDepth(5);
  }
}
export function goblinspbar(controller: goblinController) {
  const goblin = controller.goblin;
  const state = goblin.mob.state;
  const spBar = controller.mobUI.spbar;
  const width = 40;
  const height = 3;
  const radius = 1;
  const percent = state.SP / state.max_sp;

  spBar.clear();
  spBar.fillStyle(0x808080);
  spBar
    .fillRoundedRect(0, 0, width, height, radius)
    .setPosition(goblin.sprite.x - 20, goblin.sprite.y - 20);
  if (percent > 0) {
    spBar.fillStyle(0xffff00);
    spBar
      .fillRoundedRect(0, 0, width * percent, height, radius)
      .setPosition(goblin.sprite.x - 20, goblin.sprite.y - 20)
      .setDepth(5);
  }
}
