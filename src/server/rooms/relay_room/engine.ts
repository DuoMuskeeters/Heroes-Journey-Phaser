import type { RelayRoom } from "./RelayRoom";
import { CONFIG_SERVER, ServerScene } from "./relay.game";

export class GameEngine {
  game: Phaser.Game;
  scene: ServerScene;

  constructor(public room: RelayRoom) {
    this.game = new Phaser.Game({
      ...CONFIG_SERVER,
      scene: [ServerScene],
    });

    const scene = this.game.scene.getScene("server-load-scene");
    if (!(scene instanceof ServerScene))
      throw new Error("scene not found or not compatible");

    this.scene = scene;
    this.scene.room = this.room;
    this.scene.state = this.room.state;
  }
}
