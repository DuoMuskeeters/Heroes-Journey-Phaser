import { type Player } from ".";
import { type Character } from "../../game/Karakter";
import { mcEventTypes, mcEvents } from "../../game/types";

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
  listeners() {
    mcEvents.on(mcEventTypes.DIED, (i: number) => this[i].player.onDied());
    mcEvents.on(mcEventTypes.TOOK_HIT, (i: number, damage: number) =>
      this[i].player.onTookHit(damage)
    );
  }
  findByName(name: string) {
    const item = this.find(({ player }) => player.character.name === name);
    if (!item) throw new Error(`PlayerManager: player ${name} not found`);
    return item;
  }
  findBySessionId(sessionId: string) {
    const item = this.find(({ player }) => player.sessionId === sessionId);
    if (!item) throw new Error(`PlayerManager: player ${sessionId} not found`);
    return item;
  }
  mainPlayer() {
    if (this.length === 0)
      throw new Error("PlayerManager: No player is added yet");
    return this[0];
  }
  create(scene: Phaser.Scene, x: number, y: number) {
    this.listeners();
    this.forEach(({ player }, i) => player.create(scene, x, y, i));
  }
  update(time: number, delta: number) {
    this.forEach(({ player }) => player.update(time, delta));
  }
  removePlayer(i: number) {
    this[i].player.destroy();
    const UI = this[i].UI;
    UI.hpBar.destroy();
    UI.spBar.destroy();
    UI.hptext.destroy();
    UI.sptext.destroy();
    UI.frameLayer.destroy();
    UI.playerindexText.destroy();
    UI.playerleveltext.destroy();

    this.splice(i, 1);
    // TODO: splice needs to reorder each player.index after i
  }
  destroy() {
    mcEvents.removeAllListeners();
  }
}
