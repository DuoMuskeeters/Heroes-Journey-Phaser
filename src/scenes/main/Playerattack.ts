import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
  mcEventTypes,
} from "../../game/types/events";
import MobController from "./mobController";

export function playerAttackListener(controller: MobController) {
  controller.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    () => {
      const animsName = controller.scene.player.sprite.anims.getName();
      if (animsName === mcEventTypes.REGULAR_ATTACK && controller.mcCanHit) {
        const damage =
          (1 - controller.mob.goblin.state.Armor) *
          controller.scene.player.user.state.ATK;
        controller.mob.goblin.state.HP -= damage;

        const details: GoblinTookHit = {
          damage,
          stun: false,
          fromJack: true,
        };
        goblinEvents.emit(goblinEventsTypes.TOOK_HIT, controller.id, details);
      }

      if (animsName === mcEventTypes.ULTI) {
        if (!controller.isDead() && controller.mcCanHit) {
          const damage =
            (1 - controller.mob.goblin.state.Armor) *
            controller.scene.player.ultiDamage;
          controller.mob.goblin.state.HP -= damage;

          const details: GoblinTookHit = {
            damage,
            stun: true,
            fromJack: true,
          };
          goblinEvents.emit(goblinEventsTypes.TOOK_HIT, controller.id, details);
        }
      }

      controller.mcCanHit = false;
    }
  );
}
