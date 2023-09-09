import { create_giant } from "../../game/Karakter";
import { Direction } from "../../game/types/types";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function createMob(scene: MainScene) {
  scene.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
    const { x = 0, y = 0, name, id } = objData;

    const { healtbar, hptitle, spbar, SawMc, Attacking, stun } = scene.goblin;
    const sprite = scene.add.sprite(x, y, "goblin-ıdle");
    const mob = create_giant(scene.player.user.state.Level);
    scene.mobrect = scene.physics.add
      .sprite(x, y, "mobrect")
      .setVisible(false)
      .setDisplaySize(
        (64 / 1311) * window.innerWidth,
        (125 / 724) * window.innerHeight
      );

    const mobattackrect = scene.add
      .rectangle(
        scene.mobrect.x,
        scene.mobrect.y,
        undefined,
        undefined,
        0xff2400
      )
      .setDisplaySize(
        (75 / 1311) * window.innerWidth,
        (32 / 724) * window.innerHeight
      );
    scene.goblinsprite.push(
      new MobController(
        id,
        name,
        scene,
        {
          sprite: sprite,
          lastdirection: Direction.left as Direction,
          mob: mob,
          healtbar,
          hptitle,
          spbar,
          SawMc,
          Attacking,
          stun,
        },
        scene.mobrect,
        mobattackrect
      )
    );

    scene.physics.add.collider(
      [scene.mobrect],
      [scene.backroad, scene.frontroad]
    );
  });
}
