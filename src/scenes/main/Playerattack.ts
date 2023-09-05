import MainScene from "./MainScene";

export function jackattack(scene: MainScene) {
  scene.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
    const attack =
      Math.abs(scene.mobrect.x - scene.attackrect.x) < 110 &&
      scene.goblin.mob.state.HP >= 0 &&
      scene.mobrect.y === scene.attackrect.y;

    if (
      scene.player.sprite.anims.getName() === `attack1` &&
      attack &&
      Number(scene.player.sprite.anims.getFrameName()) >= 5
    ) {
      scene.goblin.mob.state.HP -=
        (1 - scene.goblin.mob.state.Armor) * scene.player.user.state.ATK;
    }

    if (scene.player.sprite.anims.getName() === "attack2") {
      const damage = scene.player.user.heavy_strike();
      if (scene.goblin.mob.state.HP >= 0 && attack) {
        scene.goblin.mob.state.HP -=
          (1 - scene.goblin.mob.state.Armor) * damage;
      }
    }

    if (scene.player.sprite.anims.getName() === `death`) {
      // scene.player.sprite.anims.destroy();
    }
  });
}
