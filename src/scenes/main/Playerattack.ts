import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
} from "../../game/types/events";
import MobController from "./mobController";

export function playerAttackListener(controller: MobController) {
  controller.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    () => {
      if (controller.mob.sprite.body) {
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
        let attackActive_X_line: boolean = false;
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
          const damage =
            (1 - controller.mob.goblin.state.Armor) *
            controller.scene.player.user.state.ATK;
          controller.mob.goblin.state.HP -= damage;

          const details: GoblinTookHit = { damage, stun: true, fromJack: true };
          goblinEvents.emit(goblinEventsTypes.TOOK_HIT, controller.id, details);
        }

        if (controller.scene.player.sprite.anims.getName() === "attack2") {
          if (controller.mob.goblin.state.HP >= 0 && attackActive_X_line) {
            const damage =
              (1 - controller.mob.goblin.state.Armor) *
              controller.scene.player.ultiDamage;
            controller.mob.goblin.state.HP -= damage;

            const details: GoblinTookHit = {
              damage,
              stun: true,
              fromJack: true,
            };
            goblinEvents.emit(
              goblinEventsTypes.TOOK_HIT,
              controller.id,
              details
            );
          }
        }
      }
    }
  );
}
