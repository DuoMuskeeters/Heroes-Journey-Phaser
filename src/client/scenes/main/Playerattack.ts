import {
  type Character,
  type Goblin,
  Iroh,
  Jack,
  IrohTransform,
  IrohBasicAttack,
  JackBasicAttack,
  IrohSpeelQ,
  JackSpeelQ,
} from "../../../game/Karakter";
import { type Spell, SpellRange } from "../../../game/spell";
import {
  type GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../../game/types/events";
import { mcAnimTypes } from "../../../game/types/types";
import { type Mob } from "../../../objects/Mob";
import type goblinController from "../../../objects/Mob/goblinController";
import { type Player } from "../../../objects/player";
import MainScene from "./MainScene";

type GoblinEmit = { goblin: Mob<Goblin>; damage: number };

function emit(
  atk: "basic" | "heavy",
  player: Player<Character>,
  mobs: GoblinEmit[]
) {
  const event =
    atk === "basic"
      ? mcEventTypes.BASIC_ATTACK_USED
      : mcEventTypes.HEAVY_ATTACK_USED;

  mcEvents.emit(event, player.index);
  mobs.forEach((mob) => {
    mobEvents.emit(mobEventsTypes.TOOK_HIT, mob.goblin.id, {
      damage: mob.damage,
      stun: atk === "heavy",
      from: player.character.type,
    } satisfies GoblinTookHit);
  });
}

function attack(
  player: Player<Character>,
  s: Spell<SpellRange>,
  ctrl: goblinController[]
) {
  const emits: GoblinEmit[] = [];
  if (s.rangeType === SpellRange.Single) {
    const spell = s as Spell<SpellRange.Single>;
    // SINGLE TARGET
    const closest = ctrl[0] as goblinController | undefined;
    if (!closest) return; // no goblins in range, do not use skill
    const damage = spell.damage(closest.goblin.mob);
    spell.hit(closest?.goblin.mob);

    if (closest) emits.push({ goblin: closest?.goblin, damage });
  } else if (s.rangeType === SpellRange.SingleORNone) {
    const spell = s as Spell<SpellRange.SingleORNone>;
    // SINGLE TARGET OR NONE
    const closest = ctrl[0] as goblinController | undefined;
    const damage = spell.damage(closest?.goblin.mob);
    spell.hit(closest?.goblin.mob);

    if (closest) emits.push({ goblin: closest?.goblin, damage });
  } else if (s.rangeType === SpellRange.Multiple) {
    const spell = s as Spell<SpellRange.Multiple>;
    // MULTIPLE TARGET
    const damages = spell.damage(ctrl.map((c) => c.goblin.mob));
    spell.hit(ctrl.map((c) => c.goblin.mob));

    ctrl.forEach((c, idx) => {
      emits.push({ goblin: c.goblin, damage: damages[idx] });
    });
  }
  return emit(s.type, player, emits);
}

export function playerAttackListener(player: Player<Character>) {
  if (player.index !== 0) return;
  const scene = player.scene;
  const isMain = scene instanceof MainScene;
  const controllers = isMain ? scene.mobController : [];
  const getAffectedMobs = (s?: boolean) =>
    controllers.filter((mob) => mob.arePlayersHitting(s)[player.index]);

  player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      let spell: Spell<SpellRange> | undefined;

      if (animation.key.includes(mcAnimTypes.ATTACK_1)) {
        if (player.character instanceof Iroh) {
          spell = IrohBasicAttack(player.character);
        } else if (player.character instanceof Jack) {
          spell = JackBasicAttack(player.character);
        } else throw new Error("Unknown character type for attack 1");
      } else if (animation.key.includes(mcAnimTypes.ATTACK_2)) {
        if (player.character instanceof Iroh) return; // heavy attack is handled in update
        if (player.character instanceof Jack)
          spell = JackSpeelQ(player.character);
        else throw new Error("Unknown character type for attack 2");
      }

      if (spell) attack(player, spell, getAffectedMobs());
      if (animation.key.includes(mcAnimTypes.TRANSFORM)) {
        if (
          player.character instanceof Iroh &&
          !animation.key.includes("fire")
        ) {
          const delay = 5000;

          if (isMain && scene.connected)
            // Sending transform event to server
            mcEvents.emit(mcEventTypes.TRANSFORM, player.index, delay);
          // Client should handle this
          else {
            IrohTransform(player.character);

            player.scene.time.addEvent({
              delay,
              callback: () => {
                player.play(mcAnimTypes.TRANSFORM);
                player.sprite.anims.stopAfterRepeat(0);
                if (player.character instanceof Iroh)
                  IrohTransform(player.character);
              },
            });
          }
          if (player.character instanceof Jack) {
            throw new Error("jack transform not implemented");
          }
        }
      }
    }
  );
  player.sprite.on(
    Phaser.Animations.Events.ANIMATION_UPDATE,
    (
      animation: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame
    ) => {
      if (animation.key.includes(mcAnimTypes.ATTACK_1)) {
        //
      } else if (animation.key.includes(mcAnimTypes.ATTACK_2)) {
        const affectedMobs = getAffectedMobs(true);
        let damages: number[];
        if (player.character instanceof Iroh) {
          const padding = 2;
          const frames = animation.frames.slice(padding, -padding);
          const isAtFrame = !!frames.find((f) => f.index === frame.index);

          if (isAtFrame) {
            const mobs = affectedMobs.map((ctrl) => ctrl.goblin.mob);

            if (!IrohSpeelQ(player.character).has()) {
              console.log(
                `[PlayerAttack] player ${player.index} heavy strike has exhausted`
              );
              return player.sprite.anims.stop();
            }
            damages = IrohSpeelQ(player.character).damage(mobs);
            IrohSpeelQ(player.character).hit(mobs);

            emit(
              "heavy",
              player,
              affectedMobs.map((ctrl, idx) => ({
                goblin: ctrl.goblin,
                damage: damages[idx],
              }))
            );
          }
        }
      }
    }
  );
}
