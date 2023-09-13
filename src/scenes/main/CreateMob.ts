import { create_giant } from "../../game/Karakter";
import { Direction } from "../../game/types/types";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function createMob(scene: MainScene) {
  scene.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
    const { x = 0, y = 0, name, id } = objData;

    const { healtbar, hptitle, spbar, SawMc, Attacking, stun, bomb } =
      scene.mob;
    const sprite = scene.physics.add
      .sprite(x, y, "goblin-ıdle")
      .setBodySize(30, 46, true)
      .setCollideWorldBounds(true)
      .setBounce(0)
      .setDepth(100);

    const mob = create_giant(scene.player.user.state.Level);

    const mobattackrect = scene.add
      .rectangle(
        scene.mob.sprite.x,
        scene.mob.sprite.y,
        undefined,
        undefined,
        0xff2400
      )
      .setDisplaySize(
        (200 / 1311) * window.innerWidth,
        (110 / 724) * window.innerHeight
      )
      .setDepth(0);
    scene.mobController.push(
      new MobController(id, name, scene, {
        sprite: sprite,
        lastdirection: Direction.left as Direction,
        goblin: mob,
        healtbar,
        hptitle,
        spbar,
        SawMc,
        Attacking,
        stun,
        attackrect: mobattackrect,
        bomb,
      })
    );
  });
}
