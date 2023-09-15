import { CONFIG } from "../../PhaserGame";
import { create_giant } from "../../game/Karakter";
import { Direction } from "../../game/types/types";
import MainScene from "./MainScene";
import { createCollider } from "./TileGround";
import MobController from "./mobController";

export function createMob(scene: MainScene) {
  scene.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
    const { x = 0, y = 0, name, id } = objData;

    const { healtbar, hptitle, spbar, bomb } = scene.mob;
    const sprite = scene.physics.add
      .sprite(x * 2.55, y * 2.55, "goblin-ıdle")
      .setBodySize(30, 46, true)
      .setCollideWorldBounds(true)
      .setBounce(0)
      .setDepth(100)
      .setScale(2.55);

    createCollider(scene, sprite, [scene.backroad, scene.frontroad]);

    const mob = create_giant(scene.player.user.state.Level);

    const mobattackrect = scene.physics.add.sprite(
      sprite.x,
      sprite.y,
      "mobattackrect"
    );
    (mobattackrect.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    mobattackrect.setDisplaySize(220, 110).setDepth(0).setVisible(false);
    scene.mobController.push(
      new MobController(id, name, scene, {
        sprite: sprite,
        lastdirection: Direction.left as Direction,
        goblin: mob,
        healtbar,
        hptitle,
        spbar,
        attackrect: mobattackrect,
        bomb,
      })
    );
  });
}
