import { goblinEvents, goblinEventsTypes } from "../../game/events";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function jackattack(scene: MobController) {
  scene.scene.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
    const attack =
      Math.abs(scene.mobrect.x - scene.scene.attackrect.x) <
        (100 / 1440) * window.innerWidth && scene.mob.mob.state.HP >= 0;

    if (
      scene.scene.player.sprite.anims.getName() === `attack1` &&
      attack &&
      Number(scene.scene.player.sprite.anims.getFrameName()) >= 5
    ) {
      scene.mob.mob.state.HP -=
        (1 - scene.mob.mob.state.Armor) * scene.scene.player.user.state.ATK;
    }

    if (scene.scene.player.sprite.anims.getName() === "attack2") {
      const damage = scene.scene.player.user.heavy_strike();
      if (scene.mob.mob.state.HP >= 0 && attack) {
        goblinEvents.emit(goblinEventsTypes.TAKE_HİT);
        scene.mob.mob.state.HP -= (1 - scene.mob.mob.state.Armor) * damage;
      }
    }
  });
}
