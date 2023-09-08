import { goblinEvents, goblinEventsTypes } from "../../game/events";
import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";
let goblinmod = 0;
export function goblinMovement(scene: MainScene) {
  // if (scene.mobrect.body instanceof Phaser.Physics.Arcade.Body) {
  //   const distanceofgoblin = scene.goblin.sprite.x - scene.player.sprite.x > 0;
  //   goblinmod += 1;
  //   if (goblinmod % 20 === 0) {
  //     if (distanceofgoblin) {
  //       scene.goblin.lastdirection = Direction.left;
  //       scene.goblin.sprite.setFlipX(false);
  //     } else {
  //       scene.goblin.lastdirection = Direction.right;
  //       scene.goblin.sprite.setFlipX(true);
  //     }
  //   }
  //   if (scene.goblin.mob.state.HP <= 0) {
  //     scene.goblin.sprite.play(`goblin-death`, true);
  //     scene.goblin.sprite.stopAfterRepeat(0);
  //     goblinEvents.emit(goblinEventsTypes.GOBLIN_DIED);
  //   }
  //   if (
  //     scene.goblin.mob.skill_barı() &&
  //     !scene.bomb.sprite.anims.isPlaying &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-death`
  //   ) {
  //     goblinEvents.emit(goblinEventsTypes.ULTI);
  //   } else if (
  //     scene.goblin?.sprite.active &&
  //     Math.abs(scene.rect.x - scene.mobattackrect.x) <=
  //       (300 / 1440) * window.innerWidth &&
  //     Math.abs(scene.rect.x - scene.mobattackrect.x) >
  //       (60 / 1440) * window.innerWidth &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-takehit` &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-attack` &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-bomb` &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-death`
  //   ) {
  //     goblinEvents.emit(goblinEventsTypes.SAW_MC);

  //     scene.goblin.sprite.anims.play(`goblin-run`, true);
  //     scene.goblin.sprite.anims.stopAfterRepeat(0);
  //     scene.mobrect.body.setVelocityX(
  //       ((dirVelocity[scene.goblin.lastdirection] * 150) / 1440) *
  //         window.innerWidth
  //     );
  //     scene.mobattackrect.setVisible(false);
  //   } else if (
  //     Math.abs(scene.rect.x - scene.mobattackrect.x) <
  //       (60 / 1440) * window.innerWidth &&
  //     Math.floor(scene.rect.y) === Math.floor(scene.mobattackrect.y) &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-takehit` &&
  //     scene.player.sprite.anims.getName() !==
  //       `death-${scene.player.lastdirection}` &&
  //     scene.player.sprite.anims.getName() !== `${scene.player.lastdirection}` &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-death` &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-bomb`
  //   ) {
  //     scene.goblin.sprite.anims.play(`goblin-attack`, true);

  //     scene.goblin.sprite.anims.stopAfterRepeat(0);
  //     scene.mobrect.body.setVelocityX(0);
  //     scene.mobattackrect.setVisible(true);
  //   } else if (
  //     !scene.goblin.sprite.anims.isPlaying &&
  //     scene.goblin.sprite.anims.getName() !== `goblin-death`
  //   ) {
  //     scene.mobrect.body.setVelocityX(0);
  //     scene.goblin.sprite.anims.play(`goblin-ıdle`, true);
  //     scene.mobattackrect.setVisible(false);
  //   }
  //   if (scene.mobrect.body.onWall()) {
  //     scene.mobrect.body.setVelocityY((-400 / 900) * window.innerHeight);
  //   }
  //   scene.goblin.sprite.x = scene.mobrect.x;
  //   scene.goblin.sprite.y = scene.mobrect.y - (8 / 680) * window.innerHeight;
  // }
}
