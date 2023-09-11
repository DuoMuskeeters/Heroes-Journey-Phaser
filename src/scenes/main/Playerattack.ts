import { goblinEvents, goblinEventsTypes } from "../../game/types/events";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function jackattack(controller: MobController) {
  controller.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    () => {
      const mobBodyTopY = Math.floor(controller.mob.sprite.body.top);
      const attackrectBottomY = Math.floor(
        controller.scene.player.attackrect.getBottomCenter().y!
      );
      const mobBodyBotY = Math.floor(controller.mob.sprite.body.bottom);
      const attackrectTopY = Math.floor(
        controller.scene.player.attackrect.getTopCenter().y!
      );
      const attackActive_Y_line =
        (mobBodyTopY <= attackrectBottomY &&
          mobBodyBotY >= attackrectBottomY) ||
        (mobBodyTopY <= attackrectTopY && mobBodyBotY >= attackrectTopY);

      let attackActive_X_line:boolean = false;
      const mobOntHeRight =
        controller.mob.sprite.body.x - controller.scene.player.sprite.body.x >
        0;
      if (
        mobOntHeRight &&
        controller.mob.sprite.body.left <=
          controller.scene.player.attackrect.getRightCenter().x! &&
        attackActive_Y_line
      ) {
        attackActive_X_line = true;
      }
      if (
        !mobOntHeRight &&
        controller.mob.sprite.body.right >=
          controller.scene.player.attackrect.getLeftCenter().x! &&
        attackActive_Y_line
      ) {
        attackActive_X_line = true;
      }

      if (
        controller.scene.player.sprite.anims.getName() === `attack1` &&
        attackActive_X_line &&
        Number(controller.scene.player.sprite.anims.getFrameName()) >= 5
      ) {
        controller.mob.mob.state.HP -=
          (1 - controller.mob.mob.state.Armor) *
          controller.scene.player.user.state.ATK;
      }

      if (controller.scene.player.sprite.anims.getName() === "attack2") {
        const damage = controller.scene.player.user.heavy_strike();
        if (controller.mob.mob.state.HP >= 0 && attackActive_X_line) {
          goblinEvents.emit(goblinEventsTypes.TOOK_HIT, controller.index);
          controller.mob.mob.state.HP -=
            (1 - controller.mob.mob.state.Armor) * damage;
        }
      }
    }
  );
}
