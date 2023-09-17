import { mcEventTypes, mcEvents } from "../../game/types/events";
import MainScene from "./MainScene";
import { Direction, dirVelocity, mcAnimTypes } from "../../game/types/types";

const runonUpdate = (scene: MainScene) => {
  scene.player?.sprite.anims.play(mcAnimTypes.RUN, true);
  scene.player.sprite.body.setVelocityX(
    dirVelocity[scene.player.lastdirection] * 250
  );
};

const ıdleonUpdate = (scene: MainScene) => {
  scene.player.sprite.body.setVelocityX(0);
  scene.player.sprite.anims.play(mcAnimTypes.IDLE, true);
};
const jumpandFallonupdate = (scene: MainScene) => {
  scene.player.sprite.anims.play(mcAnimTypes.JUMP, true);
  scene.player.sprite.anims.stopAfterRepeat(1);
  scene.player.sprite.body.setVelocityY(-900);
};
const heavyStrikeonUpdate = (scene: MainScene) => {
  const { hit: heavyStrikeHit } = scene.player.user.heavy_strike();
  if (heavyStrikeHit) {
    scene.player.sprite.anims.play(mcAnimTypes.ATTACK_2, true);
    scene.player.sprite.anims.stopAfterRepeat(0);
    scene.player.sprite.body.setVelocityX(0);
    mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED);
  }
};
const attackonUpdate = (scene: MainScene) => {
  scene.player?.sprite.anims.play(mcAnimTypes.ATTACK_1, true);
  scene.player.sprite.anims.stopAfterRepeat(0);
  scene.player.sprite.body.setVelocityX(0);
  mcEvents.emit(mcEventTypes.BASIC_ATTACK_USED);
};
export function JackDied(scene: MainScene) {
  scene.player.sprite.anims.play(mcAnimTypes.DEATH, true);
  scene.player.sprite.anims.stopAfterRepeat(0);
  scene.player.sprite.body.setVelocityX(0);
}

export function JackOnUpdate(scene: MainScene) {
  const keySpace = scene.input.keyboard?.addKey("SPACE");
  const keyW = scene.input.keyboard?.addKey("W");
  const keyA = scene.input.keyboard?.addKey("A");
  const keyD = scene.input.keyboard?.addKey("D");
  const keyQ = scene.input.keyboard?.addKey("Q");
  const keyB = scene.input.keyboard?.addKey("B");
  const mouse = scene.input.activePointer.leftButtonDown();

  const isanimplaying = scene.player.sprite.anims.isPlaying;
  const attckQActive =
    scene.player.sprite.anims.getName() === mcAnimTypes.ATTACK_2;
  const attack1Active =
    scene.player.sprite.anims.getName() === mcAnimTypes.ATTACK_1;

  const OnStun = scene.player.sprite.anims.getName() === mcAnimTypes.TAKE_HIT;

  const playerDeath = scene.player.user.isDead();
  if (playerDeath) return;

  if (
    keyA?.isDown &&
    !attckQActive &&
    !attack1Active &&
    !playerDeath &&
    !OnStun
  ) {
    scene.player.lastdirection = Direction.left;
    scene.player.sprite.setFlipX(true);
  }
  if (
    keyD?.isDown &&
    !attckQActive &&
    !attack1Active &&
    !playerDeath &&
    !OnStun
  ) {
    scene.player.lastdirection = Direction.right;
    scene.player.sprite.setFlipX(false);
  }

  if (!scene.player.sprite.body.onFloor()) {
    if (keyD?.isDown || keyA?.isDown) {
      scene.player.sprite.body.setVelocityX(
        dirVelocity[scene.player.lastdirection] * 250
      );
    } else {
      scene.player.sprite.body.setVelocityX(0);
    }
    if (!isanimplaying) {
      scene.player.sprite.anims.play(mcAnimTypes.FALL, true);
      scene.player.sprite.anims.stopAfterRepeat(0);
    }
  }
  if (scene.player.sprite.body.onFloor()) {
    if (keyW?.isDown && !playerDeath && !OnStun && !attckQActive) {
      jumpandFallonupdate(scene);
    }
    if (
      keyQ?.isDown &&
      !keyD?.isDown &&
      !keyA?.isDown &&
      !playerDeath &&
      !OnStun
    ) {
      heavyStrikeonUpdate(scene);
    } else if (
      (mouse || keySpace?.isDown) &&
      !attckQActive &&
      !playerDeath &&
      !OnStun
    ) {
      attackonUpdate(scene);
    } else if (
      (keyD?.isDown || keyA?.isDown) &&
      !keyW?.isDown &&
      !attckQActive &&
      !attack1Active &&
      !playerDeath &&
      !OnStun
    ) {
      runonUpdate(scene);
    } else if (
      (!keyD?.isDown &&
        !keyW?.isDown &&
        !keyA?.isDown &&
        !keyB?.isDown &&
        !attack1Active &&
        !attckQActive &&
        !playerDeath &&
        !keySpace?.isDown &&
        !OnStun &&
        !mouse &&
        !keyQ?.isDown) ||
      !isanimplaying
    ) {
      ıdleonUpdate(scene);
    }
  }

  scene.player.attackrect.setPosition(
    scene.player.sprite.x + dirVelocity[scene.player.lastdirection] * 90,
    scene.player.sprite.y - 40
  );
}
