import { goblinMob } from "./Anims";
import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";
import {
  Character,
  Mob,
  Warrior,
  create_character,
  create_giant,
} from "../../game/Karakter";
import PhaserGame from "../../PhaserGame";
import { UiScene } from "./uiScene";
import statemenu from "./StateMenu";
import { Scene } from "phaser";
import { mobattack } from "./MobAttack";

export function JackMovement(scene: MainScene) {
  const UiScene = PhaserGame.scene.keys.ui as UiScene;

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
  if (scene.player.user.state.HP <= 0) {
    scene.player.sprite.anims.play(`death-${scene.player.lastdirection}`, true);
    scene.player.sprite.anims.stopAfterRepeat(0);
  }
  if (scene.player.sprite.body instanceof Phaser.Physics.Matter.Sprite) {
    scene.player.sprite.anims.chain(undefined!);
    scene.player?.sprite.anims.chain([`fall-${scene.player.lastdirection}`]);

    if (
      Math.floor(scene.player.sprite.y) /*===
      Math.floor(window.innerHeight * 0.72333333333333333333333)*/
    ) {
      if (UiScene.statemenu.isOpen) {
        if (
          keyW?.isDown &&
          scene.player.sprite.anims.getName() !==
            `death-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `take-hit-${scene.player.lastdirection}`
        ) {
          scene.player.sprite.anims.startAnimation(
            `jump-${scene.player.lastdirection}`
          );
          scene.player.sprite.anims.stopAfterRepeat(0);

          scene.player.sprite.body.setVelocityY(
            -1 * window.innerHeight * 2.1951
          );
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
            `death-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `take-hit-${scene.player.lastdirection}`
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
          scene.player.user.state.SP >= 50 &&
          scene.player.sprite.anims.getName() !==
            `attack1-${scene.player.lastdirection}` &&
          scene.player.ultimate &&
          scene.player.sprite.anims.getName() !==
            `death-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `take-hit-${scene.player.lastdirection}`
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
            `death-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `take-hit-${scene.player.lastdirection}`
        ) {
          scene.player?.sprite.anims.play(
            `attack1-${scene.player.lastdirection}`,
            true
          );
          scene.player.sprite.anims.stopAfterRepeat(0);
          scene.player.sprite.body.setVelocityX(0);
        }
        if (keyB?.isDown && !scene.goblin?.sprite.active) {
          scene.goblin.mob = create_giant(scene.player.user.state.Level);
          goblinMob(scene);

          scene.goblin.healtbar.setVisible(true);
          scene.goblin.hptitle.setVisible(true);
          scene.goblin.spbar.setVisible(true);
          scene.goblin?.sprite.anims.play("goblin-left", true);
        }
      }
      if (
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
            `death-${scene.player.lastdirection}` &&
          scene.player.sprite.anims.getName() !==
            `take-hit-${scene.player.lastdirection}`)
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
