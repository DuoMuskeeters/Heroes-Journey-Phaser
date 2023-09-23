import MainScene from "../main/MainScene";
import goblinController from "../../objects/Mob/goblinController";
import { createBar } from "../main/Anims";
import { Player } from "../../objects/player";
import { Character, State } from "../../game/Karakter";
import { PlayerUI } from "../../objects/player/manager";

export function UI_createPlayers(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const isscroolFactor = i === 0 ? 0 : 1;
    UI.hpBar = scene.add
      .sprite(
        UI.frameLayer.getLeftCenter().x! + 270,
        UI.frameLayer.getCenter().y! + 3,
        `hpBar`
      )
      .setScale(5.5, 7)
      .setDepth(5)
      .setScrollFactor(isscroolFactor);
    UI.spBar = scene.add
      .sprite(
        UI.frameLayer.getLeftCenter().x! + 227,
        UI.frameLayer.getBottomCenter().y! - 25,
        `spBar-${isscroolFactor}`
      )
      .setScale(3.1, 5)
      .setDepth(4)
      .setScrollFactor(isscroolFactor);
    UI.hptext = scene.add
      .text(
        UI.hpBar.getCenter().x! - 15,
        UI.hpBar.getCenter().y! - 7,
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
        UI.spBar.getCenter().x! - 10,
        UI.spBar.getCenter().y! - 8,
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
const updateHP = (state: State, UI: PlayerUI,idx:number) => {
  const getMaxHp = () => state.max_hp - state.HP;
  const maxframepercent = Math.floor(state.max_hp / 5);

  const rawFramePercent = getMaxHp() / maxframepercent;

  let framepercent =
    Math.floor(rawFramePercent) === 0
      ? rawFramePercent
      : Math.floor(rawFramePercent);

  if (6 <= framepercent) framepercent = 5;

  if (framepercent >= 1 || framepercent === 0) {
    createBar(framepercent, `hpBar-${idx}`);
    UI.hpBar.anims.play(`hpBar-${idx}`, true);
  }
};
const updateSP = (state: State, UI: PlayerUI,idx:number) => {
  const getMaxSp = () => state.max_sp - state.SP;
  const maxframepercent = Math.floor(state.max_sp / 5);

  const rawFramePercent = getMaxSp() / maxframepercent;

  let framepercent =
    Math.floor(rawFramePercent) === 0
      ? rawFramePercent
      : Math.floor(rawFramePercent);
  if (6 <= framepercent) framepercent = 5;
  if (framepercent >= 1 || framepercent === 0) {
    createBar(framepercent, `spBar-${idx}`);
    UI.spBar.anims.play(`spBar-${idx}`, true);
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
    updateHP(state, UI,i);
    if (i === 0) {
      UI.hptext.setText(`${Math.round(Math.max(0, state.HP))}`);
    } else {
      UI.hpBar
        .setScale(3, 3)
        .setPosition(UI.frameLayer.x + 110, UI.frameLayer.y + 50);

      UI.hptext
        .setPosition(
          UI.hpBar.getRightCenter().x! - 25,
          UI.hpBar.getRightCenter().y! - 10
        )
        .setScrollFactor(1)
        .setText(`${Math.floor(state.HP)}`)
        .setScale(0.7);
    }
  });
}

export function UI_updatePlayersSP(scene: MainScene) {
  scene.playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    updateSP(state, UI,i);
    if (i === 0) {
      UI.sptext.setText(`${Math.round(Math.max(0, state.SP))}`);
    } else {
      UI.spBar
        .setScale(2.1, 3)
        .setPosition(UI.frameLayer.x + 95, UI.frameLayer.y + 75);

      UI.sptext
        .setPosition(
          UI.spBar.getRightCenter().x! - 10,
          UI.spBar.getRightCenter().y! -6
        )
        .setScrollFactor(1)
        .setText(`${Math.floor(Math.max(0, state.SP))}`)
        .setScale(0.7);
    }
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
