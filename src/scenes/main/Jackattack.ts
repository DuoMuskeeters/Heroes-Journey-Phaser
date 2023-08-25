import MainScene from "./MainScene";

export function jackattack(scene:MainScene){
    scene.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (
        scene.player.sprite.anims.getName() ===
          `attack1-${scene.player.lastdirection}` &&
        scene.goblin.mob.state.HP >= 0 &&
        Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250
      ) {
        scene.goblin.mob.state.HP -=
          (1 - scene.goblin.mob.state.Armor) * scene.player.user.state.ATK;
      } else if (
        scene.player.sprite.anims.getName() === "attack2-right" ||
        scene.player.sprite.anims.getName() === "attack2-left"
      ) {
        const damage = scene.player.user.heavy_strike();
        if (
          scene.goblin.mob.state.HP >= 0 &&
          Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250
        ) {
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