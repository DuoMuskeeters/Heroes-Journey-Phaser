import { mcEventTypes, mcEvents } from "../../game/events";
import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";

export function JackMovement(scene: MainScene) {
  const keySpace = scene.input.keyboard?.addKey("SPACE");
  const keyW = scene.input.keyboard?.addKey("W");
  const keyA = scene.input.keyboard?.addKey("A");
  const keyD = scene.input.keyboard?.addKey("D");
  const keyQ = scene.input.keyboard?.addKey("Q");
  const keyB = scene.input.keyboard?.addKey("B");
  const mouse = scene.input.activePointer.leftButtonDown();
  if (
    keyA?.isDown &&
    scene.player.sprite.anims.getName() !== `attack2` &&
    scene.player.sprite.anims.getName() !== `attack1` &&
    scene.player.sprite.anims.getName() !== `death` &&
    scene.player.sprite.anims.getName() !== `take-hit`
  ) {
    scene.player.lastdirection = Direction.left;
    scene.player.sprite.setFlipX(true);
  }
  if (
    keyD?.isDown &&
    scene.player.sprite.anims.getName() !== `attack2` &&
    scene.player.sprite.anims.getName() !== `attack1` &&
    scene.player.sprite.anims.getName() !== `death` &&
    scene.player.sprite.anims.getName() !== `take-hit`
  ) {
    scene.player.lastdirection = Direction.right;
    scene.player.sprite.setFlipX(false);
  }
  if (scene.player.user.state.HP <= 0) {
    scene.player.sprite.anims.play(`death`, true);
    scene.player.sprite.anims.stopAfterRepeat(0);
    mcEvents.emit(mcEventTypes.DIED);
  }
  scene.player.sprite.anims.chain(undefined!);
  scene.player?.sprite.anims.chain([`fall`]);
  if (!scene.rect.body.onFloor()) {
    if (keyD?.isDown || keyA?.isDown) {
      scene.rect.body.setVelocityX(
        dirVelocity[scene.player.lastdirection] *
          ((250 / 1328) * window.innerWidth)
      );
    } else {
      scene.rect.body.setVelocityX(0);
    }
  }
  if (scene.rect.body.onFloor()) {
    if (
      keyW?.isDown &&
      scene.player.sprite.anims.getName() !== `death` &&
      scene.player.sprite.anims.getName() !== `take-hit`
    ) {
      scene.player.sprite.anims.startAnimation(`jump`);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.rect.body.setVelocityY(-(900 / 744) * window.innerHeight);
    }
    if (
      (keyD?.isDown || keyA?.isDown) &&
      !keyW?.isDown &&
      scene.player.sprite.anims.getName() !== `attack2` &&
      scene.player.sprite.anims.getName() !== `attack1` &&
      scene.player.sprite.anims.getName() !== `death` &&
      scene.player.sprite.anims.getName() !== `take-hit`
    ) {
      scene.player?.sprite.anims.play("run", true);

      scene.rect.body.setVelocityX(
        dirVelocity[scene.player.lastdirection] *
          ((250 / 1328) * window.innerWidth)
      );
    }
    if (
      keyQ?.isDown &&
      !keyD?.isDown &&
      !keyA?.isDown &&
      scene.player.sprite.anims.getName() !== `attack1` &&
      scene.player.ultimate &&
      scene.player.sprite.anims.getName() !== `death` &&
      scene.player.sprite.anims.getName() !== `take-hit` &&
      scene.player.user.state.SP >= scene.player.user.state.max_sp / 2
    ) {
      scene.player.sprite.anims.play(`attack2`, true);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.rect.body.setVelocityX(0);
      scene.player.ultimate = false;
      mcEvents.emit(mcEventTypes.HEAVY_ATTACK_USED);
      setTimeout(() => {
        scene.player.ultimate = true;
      }, scene.player.standbytime);
      scene.attackrect.setVisible(true);
    }
    if (
      (mouse || keySpace?.isDown) &&
      scene.player.sprite.anims.getName() !== `attack2` &&
      scene.player.sprite.anims.getName() !== `death` &&
      scene.player.sprite.anims.getName() !== `take-hit`
    ) {
      scene.player?.sprite.anims.play(`attack1`, true);
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.rect.body.setVelocityX(0);
      scene.attackrect.setVisible(true);
    }
    if (
      scene.player.sprite.anims.getName() === `fall` ||
      (!keyD?.isDown &&
        !keyW?.isDown &&
        !keyA?.isDown &&
        !keyB?.isDown &&
        scene.player.sprite.anims.getName() !== `attack1` &&
        scene.player.sprite.anims.getName() !== `attack2` &&
        scene.player.sprite.anims.getName() !== `death` &&
        scene.player.sprite.anims.getName() !== `take-hit`)
    ) {
      scene.rect.body.setVelocityX(0);
      scene.player.sprite.anims.play(`ıdle`, true);
      scene.attackrect.setVisible(false);
    }
  }

  scene.player.sprite.x = scene.rect.x;
  scene.player.sprite.y = scene.rect.y - (75 / 680) * window.innerHeight;
}
