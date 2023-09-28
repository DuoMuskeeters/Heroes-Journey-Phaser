import {
  direction,
  dirVelocity,
  McAnimTypes,
  mcAnimTypes,
} from "../../game/types";
import { Player } from ".";
import { Character, Iroh, Jack } from "../../game/Karakter";
import MainScene from "../../scenes/main/MainScene";

const runonUpdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.RUN, true);
  player.sprite.body.setVelocityX(dirVelocity[player.lastdirection] * 250);
};

const ıdleonUpdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.IDLE, true);
  player.sprite.body.setVelocityX(0);
};
const jumpandFallonupdate = (player: Player<Character>) => {
  player.play(mcAnimTypes.JUMP, true);
  player.sprite.anims.stopAfterRepeat(1);
  player.sprite.body.setVelocityY(-900);
};
const heavyStrikeonUpdate = (player: Player<Jack | Iroh>) => {
  const { hit: heavyStrikeHit } = player.character.heavyAttack();
  if (heavyStrikeHit) {
    player.play(mcAnimTypes.ATTACK_2, true);
    player.sprite.anims.stopAfterRepeat(0);
    player.sprite.body.setVelocityX(0);
  }
};
const attackonUpdate = (player: Player<Character>) => {
  let anim: McAnimTypes = mcAnimTypes.ATTACK_1;
  if (player.character instanceof Iroh) {
    const { lastCombo } = player.character;

    if (player.character.inComboTime())
      anim =
        lastCombo === 2
          ? mcAnimTypes.ATTACK_1_COMBO3
          : lastCombo === 1
          ? mcAnimTypes.ATTACK_1_COMBO2
          : mcAnimTypes.ATTACK_1;

    console.log(
      "lastCombo",
      lastCombo,
      "anim",
      anim,
      "inComboTime",
      player.character.inComboTime(),

      "lastBasic",
      player.character.lastBasicAttack
    );
  }
  player.play(anim, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.body.setVelocityX(0);
};

const setAttackrect = (player: Player<Character>) => {
  player.attackrect.setPosition(
    player.sprite.x + dirVelocity[player.lastdirection] * 90,
    player.sprite.y - 40
  );
};
export function killCharacter(player: Player<Character>) {
  player.play(mcAnimTypes.DEATH, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.body.setVelocityX(0);
}

export function playerMovementUpdate(player: Player<Character>) {
  const scene = player.scene;
  if (!(scene instanceof MainScene)) return;
  const keys = {
    0: {
      W: scene.keyW.isDown,
      A: scene.keyA.isDown,
      D: scene.keyD.isDown,
      Space: scene.keySpace.isDown,
      Q: scene.keyQ,
    },
    1: {
      W: scene.keyUp.isDown,
      A: scene.keyLeft.isDown,
      D: scene.keyRight.isDown,
      Space: scene.keyEnter.isDown,
      Q: scene.keyP,
    },
  } as const;
  const pressed = keys[player.index as 0 | 1];

  const Space_isD = pressed.Space;
  const W_isDOWN = pressed.W;
  const A_isDOWN = pressed.A;
  const D_isDOWN = pressed.D;
  const justQ = Phaser.Input.Keyboard.JustDown(pressed.Q);
  // const mouse = scene.input.activePointer.leftButtonDown();

  const isNotDown = !D_isDOWN && !W_isDOWN && !A_isDOWN && !Space_isD && !justQ;

  const RunisDown = D_isDOWN || A_isDOWN;
  const isanimplaying = player.sprite.anims.isPlaying;
  const attackQActive = player.sprite.anims
    .getName()
    .includes(mcAnimTypes.ATTACK_2);
  const attack1Active = player.sprite.anims
    .getName()
    .includes(mcAnimTypes.ATTACK_1);
  const OnStun = player.sprite.anims.getName().includes(mcAnimTypes.TAKE_HIT);
  const canMoVE = !OnStun && !attack1Active;

  setAttackrect(player);

  if (player.character.isDead()) return;

  if (A_isDOWN && canMoVE) {
    player.lastdirection = direction.left;
    player.sprite.setFlipX(true);
  }
  if (D_isDOWN && canMoVE) {
    player.lastdirection = direction.right;
    player.sprite.setFlipX(false);
  }

  if (!player.sprite.body.onFloor()) {
    player.sprite.body.setVelocityX(
      RunisDown ? dirVelocity[player.lastdirection] * 250 : 0
    );

    if (!isanimplaying) {
      player.play(mcAnimTypes.FALL, true);
      player.sprite.anims.stopAfterRepeat(0);
    }
    return;
  }
  // can't idle while attackQactive
  if ((canMoVE && isNotDown && !attackQActive) || !isanimplaying)
    ıdleonUpdate(player);
  if (OnStun) return;
  if (W_isDOWN && !attackQActive) jumpandFallonupdate(player);
  if (RunisDown && !W_isDOWN && canMoVE) runonUpdate(player); //Can run while AttackQactive
  if (Space_isD && canMoVE) attackonUpdate(player); //Can base attack while AttackQctive

  if (justQ) {
    if (player.character instanceof Jack)
      heavyStrikeonUpdate(player as Player<Jack>);
    else if (player.character instanceof Iroh)
      heavyStrikeonUpdate(player as Player<Iroh>);
    else throw new Error("unknown character type for Q attack");
  }
}
