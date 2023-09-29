import { Goblin, State } from "../../game/Karakter";
import { goblinAnimTypes } from "../../game/types/types";
import { Mob } from "../../objects/Mob";
import MainScene from "./MainScene";
import { createCollider } from "./TileGround";
import goblinController from "../../objects/Mob/goblinController";
import { mobStats } from "../../game/mobStats";

export function createMob(scene: MainScene) {
  scene.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
    const { x = 0, y = 0, name, id } = objData;
    const value: 1 | 2 | 3 | 4 = objData.properties[0].value;

    const newGoblin = new Mob(
      new Goblin(
        name,
        State.fromBaseTypes(mobStats.goblin[`TIER_${value}`]),
        value
      )
    );
    newGoblin.mob.calculate_power(); //  this in create_goblin too
    newGoblin.create(
      scene,
      x,
      y,
      id,
      name,
      goblinAnimTypes.IDLE,
      220,
      110,
      2.55,
      30,
      46
    );
    const healtbar = scene.add.graphics();
    const spbar = scene.add.graphics();
    const hptitle = scene.add
      .text(0, 0, `${newGoblin.mob.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
      .setFontStyle("bold");

    createCollider(scene, newGoblin.sprite);

    scene.mobController.push(
      new goblinController(newGoblin, scene.playerManager, {
        healtbar,
        spbar,
        hptitle,
      })
    );
  });
}
