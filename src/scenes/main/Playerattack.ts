import { Archer, Character, Warrior } from "../../game/Karakter";
import {
  GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { mcAnimTypes } from "../../game/types/types";
import { Player } from "../../objects/player";
import MainScene from "./MainScene";

export function playerAttackListener(player: Player<Character>) {
  const scene = player.scene;
  const isMain = scene instanceof MainScene;
  const controllers = isMain ? scene.mobController : [];

  player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      const affectedMobs = controllers.filter((mob) => mob.isMcHitting());

      if (animation.key === mcAnimTypes.ATTACK_1) {
        mcEvents.emit(mcEventTypes.BASIC_ATTACK_USED);
        affectedMobs.forEach((mobController) => {
          const goblin = mobController.goblin.mob;
          const { damage, hit } = player.character.basicAttack(goblin);
          hit();

          mobEvents.emit(mobEventsTypes.TOOK_HIT, mobController.goblin.id, {
            damage,
            stun: false,
            fromJack: true,
          } satisfies GoblinTookHit);
        });
      } else if (animation.key === mcAnimTypes.ATTACK_2) {
        let damages: number[];

        if (player.character instanceof Warrior) {
          const { hit } = player.character.heavy_strike();
          if (!hit) throw new Error("player heavy strike not ready but used");
          damages = hit(affectedMobs.map((ctrl) => ctrl.goblin.mob));
        } else if (player.character instanceof Archer) {
          const archerDamage = 0;
          damages = affectedMobs.map(() => archerDamage);
        } else throw new Error("unknown character type for ATTACK_2");

        mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED);
        affectedMobs.forEach((mobController, idx) => {
          mobEvents.emit(mobEventsTypes.TOOK_HIT, mobController.goblin.id, {
            damage: damages[idx],
            stun: true,
            fromJack: true,
          } satisfies GoblinTookHit);
        });
      }
    }
  );
}
