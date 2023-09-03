import { mob_exp_kazancı } from "../../game/Karakter";
import MainScene from "./MainScene";
import { Direction, dirVelocity } from "./types";

export function mobattack(scene: MainScene) {
  scene.goblin.sprite.on("animationstop", () => {
    const distanceofBetweenY =
      30 > Math.abs(scene.player.sprite.y - scene.goblin.sprite.y);

    let goblinattackframe = 0;
    if (scene.goblin.lastdirection == Direction["right"]) {
      goblinattackframe = 7;
    }

    let goblinbombframe =
      Number(scene.goblin.sprite.anims.getFrameName()) <= 5 ||
      Number(scene.goblin.sprite.anims.getFrameName()) >= 8;

    if (
      scene.goblin.sprite.anims.getName() ===
        `goblin-attack-${scene.goblin.lastdirection}` &&
      scene.player.user.state.HP >= 0 &&
      Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250 &&
      Number(scene.goblin.sprite.anims.getFrameName()) == goblinattackframe &&
      distanceofBetweenY
    ) {
      scene.player.user.state.HP -=
        (1 - scene.player.user.state.Armor) * scene.goblin.mob.state.ATK;
    }
    if (
      (scene.goblin.sprite.anims.getName() === `goblin-bomb-right` ||
        scene.goblin.sprite.anims.getName() === `goblin-bomb-left`) &&
      scene.bomb.sprite.body instanceof Phaser.Physics.Arcade.Body &&
      goblinbombframe
    ) {
      console.log(1);
      scene.bomb.sprite
        .setVisible(true)
        .setPosition(
          scene.player.sprite.x - dirVelocity[scene.goblin.lastdirection] * 50,
          scene.goblin.sprite.y - 100
        )
        .setScale(3);
      scene.bomb.sprite.anims.play(
        `goblin-attack-bomb-${scene.goblin.lastdirection}`,
        true
      );
      scene.bomb.sprite.anims.stopAfterRepeat(0);
      scene.bomb.sprite.body.setVelocityX(0);
    }
    if (
      scene.goblin.sprite.anims.getName() ===
      `goblin-death-${scene.goblin.lastdirection}`
    ) {
      scene.goblin.sprite.setVisible(false).setActive(false);
      scene.goblin.healtbar.setVisible(false);
      scene.goblin.hptitle.setVisible(false);
      scene.goblin.spbar.setVisible(false);
      scene.player.user.exp += mob_exp_kazancı(scene.goblin.mob.state.Level);
      scene.player.user.level_up();
    }
  });

  scene.bomb.sprite.on("animationstop", () => {
    if (scene.bomb.sprite.body instanceof Phaser.Physics.Arcade.Body) {
      scene.bomb.sprite.body.setVelocityX(0);
      scene.bomb.sprite.setVisible(false);
    }
  });
  scene.bomb.sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
    const distanceofBetweenY =
      280 > Math.abs(scene.player.sprite.y - scene.bomb.sprite.y);
    let getFrameName = 7;
    if (scene.goblin.lastdirection === Direction.right) {
      getFrameName = 13;
    }
    if (
      Number(scene.bomb.sprite.anims.getFrameName()) === getFrameName &&
      Math.abs(scene.player.sprite.x - scene.bomb.sprite.x) < 90 &&
      distanceofBetweenY
    ) {
      scene.player.sprite.anims.play(
        `take-hit-${scene.player.lastdirection}`,
        true
      );
      scene.player.sprite.anims.stopAfterRepeat(0);
      scene.player.user.state.HP -= scene.goblin.mob.giant_skill();
    }
  });
}
