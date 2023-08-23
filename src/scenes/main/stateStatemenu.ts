import { Scene } from "phaser";
import MainScene from "./MainScene";
import PhaserGame from "../../PhaserGame";

export default class statemenu {
  scene!: Phaser.Scene;
  container!: Phaser.GameObjects.Container;
  private opened = false;
  get isOpen() {
    return this.opened;
  }
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;

    this.container = scene.add.container(window.innerWidth + 400, 500);
    const panel = scene.add
      .image(0, -430, "statepanel")
      .setOrigin(1, 0)
      .setScale(0.6);
    const strenght = scene.add
      .image(-350, -400, "plus")
      .setScale(0.5)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const strenghttext = scene.add.text(
      -330,
      -395,
      `Strenght:${mainscene.player.user.state.Strength}`
    );
    strenght.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      if (mainscene.player.user.state.stat_point > 0) {
        mainscene.player.user.state.Strength += 1;
        mainscene.player.user.state.stat_point -= 1;
        mainscene.player.user.calculate_power();
        strenghttext.setText(
          `Strenght:${mainscene.player.user.state.Strength}`
        );
      }
    });
    this.container.add(panel);
    this.container.add(strenght);
    this.container.add(strenghttext);
  }
  show() {
    this.scene.tweens.add({
      targets: this.container,
      x: window.innerWidth,
      y: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = true;
  }
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      x: window.innerWidth + 400,
      y: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = false;
  }
}
