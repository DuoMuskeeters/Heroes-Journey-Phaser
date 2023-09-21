import { Player } from ".";
import { Character } from "../../game/Karakter";
import { UI_createPlayers } from "../../scenes/Ui/Components";

export type PlayerUI = {
  hpbar: Phaser.GameObjects.Sprite;
  manabar: Phaser.GameObjects.Sprite;
  hptitle: Phaser.GameObjects.Text;
  sptitle: Phaser.GameObjects.Text;
  frame: Phaser.Tilemaps.Tilemap;
  hearticon: Phaser.Tilemaps.TilemapLayer;
  manaicon: Phaser.Tilemaps.TilemapLayer;
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
