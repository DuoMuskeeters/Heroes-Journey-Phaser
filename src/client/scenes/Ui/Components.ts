import type goblinController from "../../../objects/Mob/goblinController";
import { createBar } from "../main/Anims";
import { type PlayerManager } from "../../../objects/player/manager";

import type Phaser from "phaser";
import { CONFIG } from "../../PhaserGame";

export function createBackground(scene: Phaser.Scene) {
  const bg1 = {
    rationx: 0.05,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background1")
      .setOrigin(0, 0)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setDepth(-3)
      .setScrollFactor(0),
  };

  const bg2 = {
    rationx: 0.1,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setScrollFactor(0),
  };

  const bg3 = {
    rationx: 0.15,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background3")
      .setOrigin(0, 0)
      .setDepth(-1)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setScrollFactor(0),
  };
  return [bg1, bg2, bg3];
}

export function UI_createPlayer(
  scene: Phaser.Scene,
  playerItem: PlayerManager[number]
) {
  const { player, UI } = playerItem;
  const isscroolFactor = player.isMainPlayer() ? 0 : 1;
  /**
   * @description we change the size for other players because their UI got the mainscene
   */
  const _ = player.isMainPlayer()
    ? {
        frameRatio: 1,
        hpBarscaleX: 5.5,
        hpBarscaleY: 7,
        spBarscaleX: 3.1,
        spBarscaleY: 5,
        hptextScale: 0.8,
        sptextScale: 0.8,
      }
    : {
        frameRatio: 2.5,
        hpBarscaleX: 3.4,
        hpBarscaleY: 3,
        spBarscaleX: 2.4,
        spBarscaleY: 3,
        hptextScale: 0.7,
        sptextScale: 0.7,
        leveltextScale: 2,
      };

  const Center = UI.frameLayer.getCenter<Phaser.Tilemaps.TilemapLayer>();
  const LeftCenterX =
    UI.frameLayer.getLeftCenter<Phaser.Tilemaps.TilemapLayer>().x;
  const BottomCenterY =
    UI.frameLayer.getBottomCenter<Phaser.Tilemaps.TilemapLayer>().y;
  UI.hpBar = scene.add
    .sprite(LeftCenterX + 270, Center.y + 3, `hpBar`)
    .setScale(_.hpBarscaleX / _.frameRatio, _.hpBarscaleY / _.frameRatio)
    .setDepth(5)
    .setScrollFactor(isscroolFactor);
  UI.spBar = scene.add
    .sprite(LeftCenterX + 227, BottomCenterY - 25, `spBar-${isscroolFactor}`)
    .setScale(_.spBarscaleX / _.frameRatio, _.spBarscaleY / _.frameRatio)
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
    .setScale(_.hptextScale / _.frameRatio)
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
    .setScale(_.sptextScale / _.frameRatio)
    .setDepth(500);

  if (!player.isMainPlayer()) {
    UI.playerleveltext.setScale(_.leveltextScale! / _.frameRatio);
  }
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
export function UI_updatePositionOtherPlayers(playerManager: PlayerManager) {
  playerManager.forEach(({ player, UI }, i) => {
    if (player.isMainPlayer()) return;
    UI.frameLayer.setPosition(player.sprite.x - 20, player.sprite.y - 80);
    UI.playerindexText.setPosition(UI.frameLayer.x, UI.frameLayer.y);
    UI.playerleveltext.setPosition(UI.frameLayer.x + 15, UI.frameLayer.y + 20);
    UI.hpBar.setPosition(UI.frameLayer.x + 2, UI.frameLayer.y + 25);

    UI.hptext.setPosition(
      UI.hpBar.getRightCenter(UI.hpBar).x + 60,
      UI.hpBar.getRightCenter(UI.hpBar).y - 5
    );
    UI.spBar.setPosition(UI.frameLayer.x + 13, UI.frameLayer.y + 38);
    UI.sptext.setPosition(
      UI.spBar.getRightCenter(UI.spBar).x + 45,
      UI.spBar.getRightCenter(UI.spBar).y - 4
    );
  });
}
export function UI_updateAllPlayersHP(
  scene: Phaser.Scene,
  playerManager: PlayerManager
) {
  playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    const UIhpText = UI.hptext;
    UIhpText.setText(`${Math.floor(state.HP)}`);
    UI_updateHP(scene, playerManager[i]);
  });
}

export function UI_updateAllPlayersSP(
  scene: Phaser.Scene,
  playerManager: PlayerManager
) {
  playerManager.forEach(({ player, UI }, i) => {
    const state = player.character.state;
    UI_updateSP(scene, playerManager[i]);
    const UIspText = UI.sptext;
    UIspText.setText(`${Math.floor(state.SP)}`);
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
