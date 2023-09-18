import {
  Direction,
  dirVelocity,
  mcAnimTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types";
import { GameCharacter } from ".";

const runonUpdate = (player: GameCharacter) => {
  player.sprite.anims.play(mcAnimTypes.RUN, true);
  player.sprite.body.setVelocityX(dirVelocity[player.lastdirection] * 250);
};

const ıdleonUpdate = (player: GameCharacter) => {
  player.sprite.anims.play(mcAnimTypes.IDLE, true);
  player.sprite.body.setVelocityX(0);
};
const jumpandFallonupdate = (player: GameCharacter) => {
  player.sprite.anims.play(mcAnimTypes.JUMP, true);
  player.sprite.anims.stopAfterRepeat(1);
  player.sprite.body.setVelocityY(-900);
};
const heavyStrikeonUpdate = (player: GameCharacter) => {
  const { hit: heavyStrikeHit } = player.heavy_strike();
  if (heavyStrikeHit) {
    player.sprite.anims.play(mcAnimTypes.ATTACK_2, true);
    player.sprite.anims.stopAfterRepeat(0);
    player.sprite.body.setVelocityX(0);
    mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED);
  }
};
const attackonUpdate = (player: GameCharacter) => {
  player.sprite.anims.play(mcAnimTypes.ATTACK_1, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.body.setVelocityX(0);
  mcEvents.emit(mcEventTypes.BASIC_ATTACK_USED);
};

const setAttackrect = (player: GameCharacter) => {
  player.attackrect.setPosition(
    player.sprite.x + dirVelocity[player.lastdirection] * 90,
    player.sprite.y - 40
  );
};
export function killCharacter(player: GameCharacter) {
  player.sprite.anims.play(mcAnimTypes.DEATH, true);
  player.sprite.anims.stopAfterRepeat(0);
  player.sprite.body.setVelocityX(0);
}

export function playerMovementUpdate(player: GameCharacter) {
  const scene = player.scene;
  const keySpace = scene.input.keyboard?.addKey("SPACE");
  const keyW = scene.input.keyboard?.addKey("W");
  const keyA = scene.input.keyboard?.addKey("A");
  const keyD = scene.input.keyboard?.addKey("D");
  const keyQ = scene.input.keyboard?.addKey("Q");
  const keyB = scene.input.keyboard?.addKey("B");
  const mouse = scene.input.activePointer.leftButtonDown();
  const isNotDown =
    !keyD?.isDown &&
    !keyW?.isDown &&
    !keyA?.isDown &&
    !keyB?.isDown &&
    !keySpace?.isDown &&
    !mouse &&
    !keyQ?.isDown;

  const RunisDown = keyD?.isDown || keyA?.isDown;
  const isanimplaying = player.sprite.anims.isPlaying;
  const attckQActive = player.sprite.anims.getName() === mcAnimTypes.ATTACK_2;
  const attack1Active = player.sprite.anims.getName() === mcAnimTypes.ATTACK_1;
  const OnStun = player.sprite.anims.getName() === mcAnimTypes.TAKE_HIT;
  const canMoVE = !attckQActive && !attack1Active && !OnStun;

  setAttackrect(player);

  if (player.isDead()) return;

  if (keyA?.isDown && canMoVE) {
    player.lastdirection = Direction.left;
    player.sprite.setFlipX(true);
  }
  if (keyD?.isDown && canMoVE) {
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
  if (keyW?.isDown && !attckQActive) jumpandFallonupdate(player);
  if (RunisDown && !keyW?.isDown && canMoVE) runonUpdate(player);
  if ((mouse || keySpace?.isDown) && !attckQActive) attackonUpdate(player);
  if (keyQ?.isDown) heavyStrikeonUpdate(player);
}
