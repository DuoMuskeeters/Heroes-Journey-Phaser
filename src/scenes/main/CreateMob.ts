import { Giant, create_giant } from "../../game/Karakter";
import { goblinAnimTypes } from "../../game/types/types";
import { Mob } from "../../objects/Mob";
import MainScene from "./MainScene";
import { createCollider } from "./TileGround";
import goblinController from "../../objects/Mob/goblinController";

export function createMob(scene: MainScene) {
  scene.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
    const { x = 0, y = 0, name, id } = objData;
    const { value } = objData.properties[0];

    const newGoblin = new Mob(new Giant(create_giant(value).state));
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

    createCollider(newGoblin.sprite);

    scene.mobController.push(
      new goblinController(newGoblin, scene.playerManager, {
        healtbar,
        spbar,
        hptitle,
      })
    );
  });
}
