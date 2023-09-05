import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";

export function goblinMovement(scene: MainScene) {
  if (scene.mobrect.body instanceof Phaser.Physics.Arcade.Body) {
    const distanceofgoblin = scene.goblin.sprite.x - scene.player.sprite.x;
    if (distanceofgoblin > 0) {
      scene.goblin.lastdirection = Direction.left;
      scene.goblin.sprite.setFlipX(false);
    } else {
      scene.goblin.lastdirection = Direction.right;
      scene.goblin.sprite.setFlipX(true);
    }
    if (scene.goblin.mob.state.HP <= 0) {
      scene.goblin.sprite.play(`goblin-death`, true);
      scene.goblin.sprite.stopAfterRepeat(0);
    }
    if (scene.goblin.mob.skill_barı() && !scene.bomb.sprite.anims.isPlaying) {
      scene.mobrect.body.setVelocityX(0);
      scene.goblin.sprite.anims.play(`goblin-bomb`, true);
      scene.goblin.sprite.anims.stopAfterRepeat(0);
    }
    if (
      scene.player.sprite.anims.getName() === `attack2` &&
      Math.abs(scene.rect.x - scene.mobattackrect.x) <= 350
    ) {
      scene.goblin.sprite.anims.play(`goblin-takehit`, true);
      scene.goblin.sprite.anims.stopAfterRepeat(0);
    } else if (
      scene.goblin?.sprite.active &&
      Math.abs(scene.rect.x - scene.mobattackrect.x) <= 350 &&
      Math.abs(scene.rect.x - scene.mobattackrect.x) > 70 &&
      scene.goblin.sprite.anims.getName() !== `goblin-takehit` &&
      scene.goblin.sprite.anims.getName() !== `goblin-attack` &&
      scene.goblin.sprite.anims.getName() !== `goblin-bomb`
    ) {
      // scene.goblin.sprite.anims.play(`goblin-run`, true);
      // scene.goblin.sprite.anims.stopAfterRepeat(0);
      // scene.mobrect.body.setVelocityX(
      //   dirVelocity[scene.goblin.lastdirection] * 150
      // );
      scene.mobattackrect.setVisible(false);
    } else if (
      Math.abs(scene.rect.x - scene.mobattackrect.x) < 70 &&
      scene.rect.y === scene.mobattackrect.y &&
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
      scene.goblin.sprite.anims.play(`goblin-attack`, true);

      scene.goblin.sprite.anims.stopAfterRepeat(0);
      scene.mobrect.body.setVelocityX(0);
      scene.mobattackrect.setVisible(true);
    } else if (
      !scene.goblin.sprite.anims.isPlaying &&
      scene.goblin.sprite.anims.getName() !== `goblin-death`
    ) {
      scene.mobrect.body.setVelocityX(0);
      scene.goblin.sprite.anims.play(`goblin-ıdle`, true);
      scene.mobattackrect.setVisible(false);
    }
    if (scene.mobrect.body.onWall()) {
      scene.mobrect.body.setVelocityY(-400);
    }
    if (
      Math.abs(scene.rect.x - scene.mobattackrect.x) < 70 &&
      scene.rect.y !== scene.mobattackrect.y
    ) {
      scene.mobrect.body.setVelocityX(
        dirVelocity[scene.goblin.lastdirection] * 150
      );
    }
  }
  scene.goblin.sprite.x = scene.mobrect.x;
  scene.goblin.sprite.y = scene.mobrect.y - (8 / 680) * window.innerHeight;
}
