import { Player } from ".";
import { Character } from "../../game/Karakter";
import { UI_createPlayers } from "../../scenes/Ui/Components";

export type PlayerUI = {
  hpBar: Phaser.GameObjects.Sprite;
  spBar: Phaser.GameObjects.Sprite;
  hptext: Phaser.GameObjects.Text;
  sptext: Phaser.GameObjects.Text;
  frameLayer: Phaser.Tilemaps.TilemapLayer;
  playerindexText: Phaser.GameObjects.Text;
  playerleveltext: Phaser.GameObjects.Text;
};

export class PlayerManager extends Array<{
  player: Player<Character>;
  UI: PlayerUI;
}> {
  mainPlayer() {
    if (this.length === 0)
      throw new Error("PlayerManager: No player is added yet");
    return this[0];
  }
  create(scene: Phaser.Scene, x: number, y: number) {
    this.forEach(({ player }, i) => player.create(scene, x, y, i));
  }
  update(time: number, delta: number) {
    this.forEach(({ player }) => player.update(time, delta));
  }
  destroy() {
    this.forEach(({ player }) => player.destroy());
  }
}
