import { mcEventTypes, mcEvents } from "../../game/types/events";
import MainScene from "./MainScene";
import { Direction, dirVelocity } from "../../game/types/types";

export function JackMovement(scene: MainScene) {
  const keySpace = scene.input.keyboard?.addKey("SPACE");
  const keyW = scene.input.keyboard?.addKey("W");
  const keyA = scene.input.keyboard?.addKey("A");
  const keyD = scene.input.keyboard?.addKey("D");
  const keyQ = scene.input.keyboard?.addKey("Q");
  const keyB = scene.input.keyboard?.addKey("B");
  const mouse = scene.input.activePointer.leftButtonDown();
  const attckQActive =
    scene.player.sprite.anims.getName() === mcEventTypes.ULTI;
  const attack1Active =
    scene.player.sprite.anims.getName() === mcEventTypes.REGULAR_ATTACK;
  const playerDeath = scene.player.sprite.anims.getName() === mcEventTypes.DIED;
  const OnStun = scene.player.sprite.anims.getName() === mcEventTypes.TOOK_HIT;
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
  if (scene.player.user.state.HP <= 0) {
    scene.player.sprite.anims.play(mcEventTypes.DIED, true);
    scene.player.sprite.anims.stopAfterRepeat();
    mcEvents.emit(mcEventTypes.DIED);
  }
  scene.player.sprite.anims.chain(undefined!);
  scene.player?.sprite.anims.chain([mcEventTypes.FALL]);
  if (!scene.player.sprite.body.onFloor()) {
    if (keyD?.isDown || keyA?.isDown) {
      scene.player.sprite.body.setVelocityX(
        dirVelocity[scene.player.lastdirection] *
          ((250 / 1328) * window.innerWidth)
      );
    } else {
      scene.player.sprite.body.setVelocityX(0);
    }
  }
  if (scene.player.sprite.body.onFloor()) {
    if (keyW?.isDown && !playerDeath && !OnStun) {
      scene.player.sprite.anims.startAnimation(mcEventTypes.JUMP);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.player.sprite.body.setVelocityY(-(900 / 744) * window.innerHeight);
    }
    if (
      (keyD?.isDown || keyA?.isDown) &&
      !keyW?.isDown &&
      !attckQActive &&
      !attack1Active &&
      !playerDeath &&
      !OnStun
    ) {
      scene.player?.sprite.anims.play(mcEventTypes.RUN, true);

      scene.player.sprite.body.setVelocityX(
        dirVelocity[scene.player.lastdirection] *
          ((250 / 1328) * window.innerWidth)
      );
    }
    if (
      keyQ?.isDown &&
      !keyD?.isDown &&
      !keyA?.isDown &&
      !attack1Active &&
      scene.player.ultimate &&
      !playerDeath &&
      !OnStun &&
      scene.player.user.state.SP >= scene.player.user.state.max_sp / 2
    ) {
      scene.player.sprite.anims.play(mcEventTypes.ULTI, true);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.player.sprite.body.setVelocityX(0);
      scene.player.ultimate = false;
      mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED);
      setTimeout(() => {
        scene.player.ultimate = true;
      }, scene.player.standbytime);
      scene.player.attackrect.setVisible(true);
    } else if (
      (mouse || keySpace?.isDown) &&
      !attckQActive &&
      !playerDeath &&
      !OnStun
    ) {
      scene.player?.sprite.anims.play(mcEventTypes.REGULAR_ATTACK, true);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.player.sprite.body.setVelocityX(0);
      scene.player.attackrect.setVisible(true);
    } else if (
      scene.player.sprite.anims.getName() === mcEventTypes.FALL ||
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
        !keyQ?.isDown)
    ) {
      scene.player.sprite.body.setVelocityX(0);
      scene.player.sprite.anims.play(mcEventTypes.IDLE, true);
      scene.player.attackrect.setVisible(false);
    }
  }

  scene.player.attackrect.setPosition(
    scene.player.sprite.x +
      dirVelocity[scene.player.lastdirection] * (85 / 1440) * window.innerWidth,
    scene.player.sprite.y - (40 / 900) * window.innerHeight
  );
}
