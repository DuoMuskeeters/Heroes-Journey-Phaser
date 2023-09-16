import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
} from "../../game/types/events";
import { mcAnimTypes } from "../../game/types/types";
import MainScene from "./MainScene";

export function playerAttackListener(scene: MainScene) {
  scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      const player = scene.player;
      const mobControllers = scene.mobController;

      const affectedMobs = mobControllers.filter((mob) => mob.isMcHitting());

      if (animation.key === mcAnimTypes.ATTACK_1) {
        affectedMobs.forEach((mobController) => {
          const goblin = mobController.mob.goblin;
          const { damage, hit } = player.user.basicAttack(goblin);
          hit();

          goblinEvents.emit(goblinEventsTypes.TOOK_HIT, mobController.id, {
            damage,
            stun: false,
            fromJack: true,
          } satisfies GoblinTookHit);
        });
      } else if (animation.key === mcAnimTypes.ATTACK_2) {
        const { damage, hit } = player.user.heavy_strike();
        if (!hit) throw new Error("player heavy strike not ready but used");
        hit(affectedMobs.map((ctrl) => ctrl.mob.goblin));

        affectedMobs.forEach((mobController) => {
          goblinEvents.emit(goblinEventsTypes.TOOK_HIT, mobController.id, {
            damage,
            stun: true,
            fromJack: true,
          } satisfies GoblinTookHit);
        });
      }
    }
  );
}
