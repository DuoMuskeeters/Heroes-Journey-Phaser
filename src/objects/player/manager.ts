import { Player } from ".";
import { Character } from "../../game/Karakter";

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
    if (this.length === 0) throw new Error("No player is created yet");
    return this[0];
  }
  update(time: number, delta: number) {
    this.forEach(({ player, UI }) => player.update(time, delta));
  }
}

// const players = new PlayerManager();
// const player = new Player(new Warrior());
// players.push({ player, UI: {} as PlayerUI });

// players.mainPlayer();
