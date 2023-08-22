import { goblinMob } from "./Anims";
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
  if (keyA?.isDown) {
    scene.player.lastdirection = Direction.left;
  }
  if (keyD?.isDown) {
    scene.player.lastdirection = Direction.right;
  }
  if (scene.player.sprite.body instanceof Phaser.Physics.Arcade.Body) {
    scene.player.sprite.anims.chain(undefined!);
    scene.player?.sprite.anims.chain([`fall-${scene.player.lastdirection}`]);

    if (
      Math.floor(scene.player.sprite.y) ===
      Math.floor(window.innerHeight * 0.72333333333333333333333)
    ) {
      if (
        keyW?.isDown &&
        scene.player.sprite.anims.getName() !==
          `death-${scene.player.lastdirection}`
      ) {
        scene.player.sprite.anims.startAnimation(
          `jump-${scene.player.lastdirection}`
        );
        scene.player.sprite.anims.stopAfterRepeat(0);

        scene.player.sprite.body.setVelocityY(-1 * window.innerHeight * 2.1951);
        if (keyD?.isDown || keyA?.isDown) {
          scene.player.sprite.body.setVelocityX(
            dirVelocity[scene.player.lastdirection] * 650
          );
        } else {
          scene.player.sprite.body.setVelocityX(0);
        }
      }
      if (
        (keyD?.isDown || keyA?.isDown) &&
        !keyW?.isDown &&
        scene.player.sprite.anims.getName() !== `attack2-right` &&
        scene.player.sprite.anims.getName() !== `attack2-left` &&
        scene.player.sprite.anims.getName() !== `attack1-right` &&
        scene.player.sprite.anims.getName() !== `attack1-left` &&
        scene.player.sprite.anims.getName() !==
          `death-${scene.player.lastdirection}`
      ) {
        scene.player?.sprite.anims.play(scene.player.lastdirection, true);

        scene.player?.sprite.body.setVelocityX(
          dirVelocity[scene.player.lastdirection] * 650
        );
      }
      if (
        keyQ?.isDown &&
        !keyD?.isDown &&
        !keyA?.isDown &&
        scene.player.sprite.anims.getName() !==
          `attack1-${scene.player.lastdirection}` &&
        scene.player.ultimate &&
        scene.player.sprite.anims.getName() !==
          `death-${scene.player.lastdirection}`
      ) {
        scene.player.sprite.anims.play(
          `attack2-${scene.player.lastdirection}`,
          true
        );
        scene.player.sprite.anims.stopAfterRepeat(0);
        scene.player?.sprite.body.setVelocityX(0);
        scene.player.ultimate = false;
        setTimeout(() => {
          scene.player.ultimate = true;
        }, scene.player.standbytime);
      }
      if (
        (mouse || keySpace?.isDown) &&
        scene.player.sprite.anims.getName() !==
          `attack2-${scene.player.lastdirection}` &&
        scene.player.sprite.anims.getName() !==
          `death-${scene.player.lastdirection}`
      ) {
        scene.player?.sprite.anims.play(
          `attack1-${scene.player.lastdirection}`,
          true
        );
        scene.player.sprite.anims.stopAfterRepeat(0);
        scene.player.sprite.body.setVelocityX(0);
      }
      if (keyB?.isDown && !scene.goblin?.sprite.active) {
        goblinMob(scene);
        scene.goblin?.sprite.anims.play("goblin-left", true);
      } else if (
        scene.player.sprite.anims.getName() ===
          `fall-${scene.player.lastdirection}` ||
        (!keyD?.isDown &&
          !keyW?.isDown &&
          !keyA?.isDown &&
          !keyB?.isDown &&
          scene.player.sprite.anims.getName() !==
            `attack2-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `attack1-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `attack2-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `death-${scene.player.lastdirection}`)
      ) {
        scene.player.sprite.body.setVelocityX(0);
        scene.player.sprite.anims.play(
          `ıdle-${scene.player.lastdirection}`,
          true
        );
      }
    }
  }
}
