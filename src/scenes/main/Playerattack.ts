import { Archer, Character, Iroh, Jack } from "../../game/Karakter";
import {
  GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { mcAnimTypes } from "../../game/types/types";
import { Player, getCharacterType } from "../../objects/player";
import MainScene from "./MainScene";

export function playerAttackListener(player: Player<Character>) {
  const scene = player.scene;
  const isMain = scene instanceof MainScene;
  const controllers = isMain ? scene.mobController : [];
  const getAffectedMobs = (s?: boolean) =>
    controllers.filter((mob) => mob.arePlayersHitting(s)[player.index]);

  player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      const affectedMobs = getAffectedMobs();

      if (animation.key.includes(mcAnimTypes.ATTACK_1)) {
        mcEvents.emit(mcEventTypes.BASIC_ATTACK_USED, player.index);

        if (player.character instanceof Jack) {
          affectedMobs.forEach((mobController) => {
            const goblin = mobController.goblin.mob;
            const { damage, hit } = player.character.basicAttack(goblin);
            hit();

            mobEvents.emit(mobEventsTypes.TOOK_HIT, mobController.goblin.id, {
              damage,
              stun: false,
              from: getCharacterType(player.character),
            } satisfies GoblinTookHit);
          });
        } else if (player.character instanceof Iroh) {
          const closest = affectedMobs[0];
          const goblin = closest?.goblin.mob;
          const damage = player.character.basicAttackDamage(goblin);
          player.character.basicAttackHit(goblin);
          if (closest)
            mobEvents.emit(mobEventsTypes.TOOK_HIT, closest.goblin.id, {
              damage,
              stun: false,
              from: getCharacterType(player.character),
            } satisfies GoblinTookHit);
        } else throw new Error("unknown character type for ATTACK_1");
      } else if (animation.key.includes(mcAnimTypes.ATTACK_2)) {
        let damages: number[];

        if (player.character instanceof Jack) {
          const { hit } = player.character.heavyAttack();
          if (!hit) throw new Error("player heavy strike not ready but used");
          damages = hit(affectedMobs.map((ctrl) => ctrl.goblin.mob));
        } else if (player.character instanceof Iroh) {
          // Iroh has continuous attack, handled in ANIMATION_UPDATE
          // const { hit } = player.character.heavyAttack();
          // if (!hit) throw new Error("player heavy strike not ready but used");
          // damages = hit(affectedMobs.map((ctrl) => ctrl.goblin.mob));
        } else if (player.character instanceof Archer) {
          throw new Error("archer not implemented for ATTACK_2");
        } else throw new Error("unknown character type for ATTACK_2");

        mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED, player.index);
        affectedMobs.forEach((mobController, idx) => {
          if (damages)
            mobEvents.emit(mobEventsTypes.TOOK_HIT, mobController.goblin.id, {
              damage: damages[idx],
              stun: true,
              from: getCharacterType(player.character),
            } satisfies GoblinTookHit);
        });
      }
    }
  );
  player.sprite.on(
    Phaser.Animations.Events.ANIMATION_UPDATE,
    (
      animation: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame
    ) => {
      const affectedMobs = getAffectedMobs(true);

      if (animation.key.includes(mcAnimTypes.ATTACK_1)) {
        //
      } else if (animation.key.includes(mcAnimTypes.ATTACK_2)) {
        let damages: number[];

        if (player.character instanceof Iroh) {
          const padding = 2;
          const frames = animation.frames.slice(padding, -padding);
          const isAtFrame = !!frames.find((f) => f.index === frame.index);

          if (isAtFrame) {
            const { hit } = player.character.heavyAttack();
            if (!hit) {
              console.log(
                `[PlayerAttack] player ${player.index} heavy strike has exhausted`
              );
              return player.sprite.anims.stop();
            }
            damages = hit(affectedMobs.map((ctrl) => ctrl.goblin.mob));

            mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED, player.index);
            affectedMobs.forEach((mobController, idx) => {
              mobEvents.emit(mobEventsTypes.TOOK_HIT, mobController.goblin.id, {
                damage: damages[idx],
                stun: true,
                from: getCharacterType(player.character),
              } satisfies GoblinTookHit);
            });
          }
        }
      }
    }
  );
}
