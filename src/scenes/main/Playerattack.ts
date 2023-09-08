import { goblinEvents, goblinEventsTypes } from "../../game/events";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function jackattack(controller: MobController) {
  controller.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    () => {
      const attack =
        Math.abs(controller.mobrect.x - controller.scene.attackrect.x) <
          (100 / 1440) * window.innerWidth && controller.mob.mob.state.HP >= 0;

      if (
        controller.scene.player.sprite.anims.getName() === `attack1` &&
        attack &&
        Number(controller.scene.player.sprite.anims.getFrameName()) >= 5
      ) {
        controller.mob.mob.state.HP -=
          (1 - controller.mob.mob.state.Armor) *
          controller.scene.player.user.state.ATK;
      }

      if (controller.scene.player.sprite.anims.getName() === "attack2") {
        const damage = controller.scene.player.user.heavy_strike();
        if (controller.mob.mob.state.HP >= 0 && attack) {
          goblinEvents.emit(goblinEventsTypes.TOOK_HIT);
          controller.mob.mob.state.HP -=
            (1 - controller.mob.mob.state.Armor) * damage;
        }
      }
    }
  );
}
