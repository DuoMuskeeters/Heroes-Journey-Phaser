import { Direction, dirVelocity, mcAnimTypes } from "../../game/types";
import { Player } from ".";
import { Character, Warrior } from "../../game/Karakter";
import MainScene from "../../scenes/main/MainScene";

const runonUpdate = (player: Player<Character>) => {
  player.sprite.anims.play(mcAnimTypes.RUN, true);
  player.sprite.body.setVelocityX(dirVelocity[player.lastdirection] * 250);
};

const ıdleonUpdate = (player: Player<Character>) => {
  player.sprite.anims.play(mcAnimTypes.IDLE, true);
  player.sprite.body.setVelocityX(0);
};
const jumpandFallonupdate = (player: Player<Character>) => {
  player.sprite.anims.play(mcAnimTypes.JUMP, true);
  player.sprite.anims.stopAfterRepeat(1);
  player.sprite.body.setVelocityY(-900);
};
const heavyStrikeonUpdate = (player: Player<Warrior>) => {
  const { hit: heavyStrikeHit } = player.character.heavy_strike();
  if (heavyStrikeHit) {
    player.sprite.anims.play(mcAnimTypes.ATTACK_2, true);
    player.sprite.anims.stopAfterRepeat(0);
    player.sprite.body.setVelocityX(0);
  }
};
const attackonUpdate = (player: Player<Character>) => {
  player.sprite.anims.play(mcAnimTypes.ATTACK_1, true);
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
  player.sprite.anims.play(mcAnimTypes.DEATH, true);
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
  const attckQActive = player.sprite.anims.getName() === mcAnimTypes.ATTACK_2;
  const attack1 = player.sprite.anims.getName().includes(mcAnimTypes.ATTACK_1);
  const OnStun = player.sprite.anims.getName() === mcAnimTypes.TAKE_HIT;
  const canMoVE = !attckQActive && !OnStun && !attack1;

  setAttackrect(player);

  if (player.character.isDead()) return;

  if (A_isDOWN && canMoVE) {
    player.lastdirection = Direction.left;
    player.sprite.setFlipX(true);
  }
  if (D_isDOWN && canMoVE) {
    player.lastdirection = Direction.right;
    player.sprite.setFlipX(false);
  }

  if (!player.sprite.body.onFloor()) {
    player.sprite.body.setVelocityX(
      RunisDown ? dirVelocity[player.lastdirection] * 250 : 0
    );

    if (!isanimplaying) {
      player.sprite.anims.play(mcAnimTypes.FALL, true);
      player.sprite.anims.stopAfterRepeat(0);
    }
    return;
  }
  if ((canMoVE && isNotDown) || !isanimplaying) ıdleonUpdate(player);
  if (OnStun) return;
  if (W_isDOWN && !attckQActive) jumpandFallonupdate(player);
  if (RunisDown && !W_isDOWN && canMoVE) runonUpdate(player);
  // if ((mouse || Space_isD) && !attckQActive) attackonUpdate(player);
  if (Space_isD && !attckQActive && canMoVE) attackonUpdate(player);

  if (justQ) {
    if (player.character instanceof Warrior)
      heavyStrikeonUpdate(player as Player<Warrior>);
    else throw new Error("unknown character type for Q attack");
  }
}
