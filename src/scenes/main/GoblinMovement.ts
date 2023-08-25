import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";

export function goblinMovement(scene: MainScene) {
  const keyW = scene.input.keyboard?.addKey("W");
  const keySpace = scene.input.keyboard?.addKey("SPACE");
  const keyM = scene.input.keyboard?.addKey("M");

  if (scene.goblin?.sprite.body instanceof Phaser.Physics.Arcade.Body) {
    const distanceofgoblin = scene.goblin.sprite.x - scene.player.sprite.x;
    if (distanceofgoblin > 0) {
      scene.goblin.lastdirection = Direction.left;
    } else {
      scene.goblin.lastdirection = Direction.right;
    }
    if (keyM?.isDown && !scene.bomb.sprite.anims.isPlaying) {
      scene.goblin.sprite.body.setVelocityX(0)
      scene.goblin.sprite.anims.play(
        `goblin-bomb-${scene.goblin.lastdirection}`,
        true
      );
      scene.goblin.sprite.anims.stopAfterRepeat(0);
    }

    if (
      scene.player.sprite.anims.getName() ===
        `attack2-${scene.player.lastdirection}` &&
      Math.abs(distanceofgoblin) <= 400 &&
      scene.player.lastdirection !== scene.goblin.lastdirection &&
      !keyW?.isDown &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-bomb-${scene.goblin.lastdirection}`
    ) {
      scene.goblin.sprite.anims.play(
        `goblin-takehit-${scene.goblin.lastdirection}`,
        true
      );
      scene.goblin.sprite.anims.stopAfterRepeat(0);
    } else if (
      scene.goblin?.sprite.active &&
      Math.abs(distanceofgoblin) <= 400 &&
      Math.abs(distanceofgoblin) >= 145 &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-takehit-${scene.goblin.lastdirection}` &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-attack-${scene.goblin.lastdirection}` &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-bomb-${scene.goblin.lastdirection}`
    ) {
      scene.goblin.sprite.anims.play(
        `goblin-run-${scene.goblin.lastdirection}`,
        true
      );
      scene.goblin.sprite.anims.stopAfterRepeat(0);
      scene.goblin.sprite.body.setVelocityX(
        dirVelocity[scene.goblin.lastdirection] * 500
      );
    } else if (
      Math.abs(distanceofgoblin) < 145 &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-takehit-${scene.goblin.lastdirection}` &&
      scene.player.sprite.anims.getName() !==
        `death-${scene.player.lastdirection}` &&
      scene.player.sprite.anims.getName() !== `${scene.player.lastdirection}` &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-death-${scene.goblin.lastdirection}` &&
      scene.goblin.sprite.anims.getName() !==
        `goblin-bomb-${scene.goblin.lastdirection}`
    ) {
      scene.goblin.sprite.anims.play(
        `goblin-attack-${scene.goblin.lastdirection}`,
        true
      );

      scene.goblin.sprite.anims.stopAfterRepeat(0);
      scene.goblin.sprite.body.setVelocityX(0);
    } else if (!scene.goblin.sprite.anims.isPlaying) {
      scene.goblin.sprite.body.setVelocityX(0);
      scene.goblin.sprite.anims.play(
        `goblin-${scene.goblin.lastdirection}`,
        true
      );
    }
  }
}
