import { Goblin } from "../../../game/Karakter";
import { goblinAnimTypes } from "../../../game/types/types";
import { Mob } from "../../../objects/Mob";
import type MainScene from "./MainScene";
import goblinController from "../../../objects/Mob/goblinController";
import { type MobType, type MobTier } from "../../../game/mobStats";

type Property = {
  name: string;
  type: "int";
  value: number;
};

export function createMob(scene: MainScene) {
  scene.tilemap
    .getObjectLayer("goblin" satisfies MobType)
    ?.objects.forEach((objData) => {
      const { x = 0, y = 0, name, id } = objData;

      const tier = (objData.properties as Property[])[0].value as MobTier;

      const newGoblin = new Mob(new Goblin(tier, name));
      newGoblin.create(scene, x, y, id, goblinAnimTypes.IDLE, {
        attackRectX: 90,
        attackRectY: 45,
        scaleSize: 1,
        bodySizeX: 32,
        bodySizeY: 36,
      });
      const healtbar = scene.add.graphics();
      const spbar = scene.add.graphics();
      const hptitle = scene.add
        .text(0, 0, `${newGoblin.mob.state.HP}`)
        .setStyle({
          fontSize: "10px Arial",
          color: "red",
          align: "center",
        })
        .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
        .setFontStyle("bold");

      scene.mobController.push(
        new goblinController(newGoblin, scene.playerManager, {
          healtbar,
          spbar,
          hptitle,
        })
      );
    });
}
