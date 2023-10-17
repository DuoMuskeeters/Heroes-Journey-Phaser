import {
  direction,
  dirVelocity,
  type McAnimTypes,
  mcAnimTypes,
  mcEvents,
  mcEventTypes,
  PressingKeys,
  playerVelocity,
} from "../../game/types";
import { type Player } from ".";
import {
  type Character,
  Iroh,
  Jack,
  IrohInComboTime,
  IrohSpeelQ,
  JackSpeelQ,
  CanlıIsDead,
  CharacterSpellQ,
  CharacterSpellBasicAttack,
} from "../../game/Karakter";
import MainScene from "../../client/scenes/main/MainScene";
import {
  IROH_ATTACK1_FRAME_COUNT,
  JACK_ATTACK1_FRAME_COUNT,
} from "../../client/scenes/main/Anims";
import { CONFIG } from "../../client/PhaserGame";

const runonUpdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.RUN, true);
  player.sprite.setVelocityX(
    dirVelocity[player.lastdirection] * playerVelocity.run
  );
};

const ıdleonUpdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.IDLE, true);
  player.sprite.setVelocityX(playerVelocity.idle);
};
const jumpandFallonupdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.JUMP, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.setVelocityY(playerVelocity.jump);
};
const heavyStrikeonUpdate = (player: Player<Jack | Iroh>) => {
  const spellHas =
    player.character instanceof Iroh
      ? IrohSpeelQ(player.character).has()
      : JackSpeelQ(player.character).has();
  if (spellHas) {
    player.play(mcAnimTypes.ATTACK_2, true);
    player.sprite.anims.stopAfterRepeat(0);
    player.sprite.setVelocityX(playerVelocity.hitting);
  }
};
const attackonUpdate = (player: Player<Character>) => {
  let anim: McAnimTypes = mcAnimTypes.ATTACK_1;
  let frameRate: number = 1;

  if (player.character instanceof Iroh) {
    frameRate = player.character.state.ATKRATE * IROH_ATTACK1_FRAME_COUNT;
    const { lastCombo } = player.character;

    if (IrohInComboTime(player.character))
      anim =
        lastCombo === 2
          ? mcAnimTypes.ATTACK_1_COMBO3
          : lastCombo === 1
          ? mcAnimTypes.ATTACK_1_COMBO2
          : mcAnimTypes.ATTACK_1;
  } else if (player.character instanceof Jack) {
    frameRate = player.character.state.ATKRATE * JACK_ATTACK1_FRAME_COUNT;
  } else throw new Error("unknown character type for attack");

  const animation = player.sprite.anims.animationManager.get(
    player.animKey(anim)
  ); // TODO: this is global for Jake or Iroh, make a clone

  animation.frameRate = frameRate;
  player.play(anim, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.setVelocityX(playerVelocity.hitting);
};

const setAttackrect = (player: Player<Character>) => {
  player.attackrect.setPosition(
    player.sprite.x + dirVelocity[player.lastdirection] * 40,
    player.sprite.y - 15
  );
};
export function killCharacter(player: Player<Character>) {
  player.play(mcAnimTypes.DEATH, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.setVelocityX(playerVelocity.dead);
}

export function playerMovementUpdate(player: Player<Character>) {
  const scene = player.scene;
  if (!(scene instanceof MainScene)) return;

  const Space_isD = player.pressingKeys.Space;
  const W_isDOWN = player.pressingKeys.W;
  const A_isDOWN = player.pressingKeys.A;
  const D_isDOWN = player.pressingKeys.D;
  const justQ = player.pressingKeys.Q;
  const justE = player.pressingKeys.E;

  if (player.pressingKeys.Q === "ephemeral") player.pressingKeys.Q = false;
  if (player.pressingKeys.Space === "ephemeral")
    player.pressingKeys.Space = false;
  if (player.pressingKeys.E === "ephemeral") player.pressingKeys.E = false;

  // const mouse = scene.input.activePointer.leftButtonDown();

  const isNotDown =
    !D_isDOWN && !W_isDOWN && !A_isDOWN && !Space_isD && !justQ && !justE;

  mcEvents.emit(mcEventTypes.MOVED, player.index, {
    ...player.pressingKeys,
  } satisfies PressingKeys);

  const RunisDown = D_isDOWN || A_isDOWN;
  const isanimplaying = player.sprite.anims.isPlaying;
  const attackQActive = player.sprite.anims
    .getName()
    .includes(mcAnimTypes.ATTACK_2);
  const attack1Active = player.sprite.anims
    .getName()
    .includes(mcAnimTypes.ATTACK_1);
  const onTransform = player.sprite.anims
    .getName()
    .includes(mcAnimTypes.TRANSFORM);
  const transformActive =
    player.character instanceof Iroh && player.character.prefix === "fire";

  const spellQ = CharacterSpellQ(player.character);
  const spellBasic = CharacterSpellBasicAttack(player.character);

  const isCancelQforChrctr = spellQ?.cancelable;
  const İsCancelA1forChrctr = spellBasic?.cancelable;

  const cancelableQforMov =
    (attackQActive && isCancelQforChrctr) || !attackQActive;

  const cancelableA1forMov =
    (attack1Active && İsCancelA1forChrctr) || !attack1Active;

  const OnStun = player.sprite.anims.getName().includes(mcAnimTypes.TAKE_HIT);

  const canMoVE =
    !OnStun && !onTransform && cancelableA1forMov && cancelableQforMov;

  if (attack1Active || attackQActive) setAttackrect(player);

  if (CanlıIsDead(player.character)) return;

  if ((A_isDOWN && canMoVE) || player.lastdirection === direction.left) {
    player.lastdirection = direction.left;
    player.sprite.setFlipX(true);
  }
  if ((D_isDOWN && canMoVE) || player.lastdirection === direction.right) {
    player.lastdirection = direction.right;
    player.sprite.setFlipX(false);
  }

  if (!player.sprite.body.onFloor()) {
    player.sprite.setVelocityX(
      RunisDown
        ? dirVelocity[player.lastdirection] * playerVelocity.fly
        : playerVelocity.idle
    );

    if (!isanimplaying) {
      player.play(mcAnimTypes.FALL, true);
      player.sprite.anims.stopAfterRepeat(0);
    }
    return;
  }
  // can't idle while attackQactive
  if (
    (canMoVE && isNotDown && !attackQActive && !attack1Active) ||
    !isanimplaying
  )
    ıdleonUpdate(player);
  if (OnStun) return;
  if (W_isDOWN && canMoVE) jumpandFallonupdate(player);
  if (RunisDown && !W_isDOWN && canMoVE) runonUpdate(player);
  //Can run while AttackQactive
  if (Space_isD && canMoVE && cancelableQforMov) attackonUpdate(player); //Can base attack while AttackQctive

  if (justQ) {
    if (player.character instanceof Jack && cancelableA1forMov)
      heavyStrikeonUpdate(player as Player<Jack>);
    else if (
      player.character instanceof Iroh &&
      cancelableA1forMov &&
      !onTransform
    )
      heavyStrikeonUpdate(player as Player<Iroh>);
    // else throw new Error("unknown character type for Q attack");
  }
  if (justE) {
    if (player.character instanceof Iroh && !transformActive) {
      player.play(mcAnimTypes.TRANSFORM, true);
      player.sprite.anims.stopAfterRepeat(0);
      player.sprite.setVelocityX(playerVelocity.hitting);
    }
    if (player.character instanceof Jack) {
      console.log("jack E not implemented");
    }
  }
}
