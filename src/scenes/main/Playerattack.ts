import { platform } from "os";
import MainScene from "./MainScene";

export function jackattack(scene: MainScene) {
  const keyW = scene.input.keyboard?.addKey("W");

  scene.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
    const attackright =
      Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250 &&
      scene.goblin.sprite.x - scene.player.sprite.x >= 0 &&
      scene.goblin.mob.state.HP >= 0 &&
      !keyW?.isDown;
    const attackleft =
      scene.goblin.sprite.x - scene.player.sprite.x <= 0 &&
      Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250 &&
      !keyW?.isDown &&
      scene.goblin.mob.state.HP >= 0;

    if (
      scene.player.sprite.anims.getName() === `attack1-right` &&
      attackright &&
      Number(scene.player.sprite.anims.getFrameName()) >= 5
    ) {
      scene.goblin.mob.state.HP -=
        (1 - scene.goblin.mob.state.Armor) * scene.player.user.state.ATK;
    }
    if (
      scene.player.sprite.anims.getName() === `attack1-left` &&
      attackleft &&
      Number(scene.player.sprite.anims.getFrameName()) <= 2
    ) {
      scene.goblin.mob.state.HP -=
        (1 - scene.goblin.mob.state.Armor) * scene.player.user.state.ATK;
    }
    if (
      scene.player.sprite.anims.getName() === "attack2-right" &&
      attackright
    ) {
      const damage = scene.player.user.heavy_strike();
      if (scene.goblin.mob.state.HP >= 0) {
        scene.goblin.mob.state.HP -=
          (1 - scene.goblin.mob.state.Armor) * damage;
      }
    }
    if (scene.player.sprite.anims.getName() === "attack2-left" && attackleft) {
      const damage = scene.player.user.heavy_strike();
      if (scene.goblin.mob.state.HP >= 0) {
        scene.goblin.mob.state.HP -=
          (1 - scene.goblin.mob.state.Armor) * damage;
      }
    }

    if (
      scene.player.sprite.anims.getName() ===
      `death-${scene.player.lastdirection}`
    ) {
      scene.player.sprite.anims.destroy();
    }
  });
}
