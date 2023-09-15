import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
  mcEventTypes,
} from "../../game/types/events";
import { mcAnimTypes } from "../../game/types/types";
import MobController from "./mobController";

export function playerAttackListener(mobController: MobController) {
  mobController.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      if (!mobController.isMcHitting()) return;

      if (animation.key === mcAnimTypes.ATTACK_1) {
        const damage =
          (1 - mobController.mob.goblin.state.Armor) *
          mobController.scene.player.user.state.ATK;
        mobController.mob.goblin.state.HP -= damage;

        const details: GoblinTookHit = {
          damage,
          stun: false,
          fromJack: true,
        };

        goblinEvents.emit(
          goblinEventsTypes.TOOK_HIT,
          mobController.id,
          details
        );
      } else if (animation.key === mcAnimTypes.ATTACK_2) {
        const damage =
          (1 - mobController.mob.goblin.state.Armor) *
          mobController.scene.player.ultiDamage;
        mobController.mob.goblin.state.HP -= damage;

        const details: GoblinTookHit = {
          damage,
          stun: true,
          fromJack: true,
        };
        goblinEvents.emit(
          goblinEventsTypes.TOOK_HIT,
          mobController.id,
          details
        );
      }
    }
  );
}
