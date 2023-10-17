import { CONFIG } from "../../PhaserGame";

export default class HeroesJourneyMap {
  mapcontainer!: Phaser.GameObjects.Container;
  scene!: Phaser.Scene;
  private opened = false;
  get isOpen() {
    return this.opened;
  }
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.mapcontainer = scene.add.container();
    // const map = scene.add
    //   .image(0, 0, "HeroesJourneyMap")
    //   .setOrigin(0)
    //   .setScale(0.65, 0.54);

    // this.mapcontainer.add(map);
  }
  show() {
    this.scene.tweens.add({
      targets: this.mapcontainer,
      x: CONFIG.width,
      y: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = true;
  }
  hide() {
    this.scene.tweens.add({
      targets: this.mapcontainer,
      x: 0,
      y: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = false;
  }
}
