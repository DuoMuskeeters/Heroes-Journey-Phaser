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
    const Strenght = scene.add
      .image(-350, -400, "plus")
      .setScale(0.5)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Strenghttext = scene.add.text(
      -330,
      -395,
      `Strenght:${mainscene.player.user.state.Strength}`
    );
    Strenght.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
     mainscene.player.user.increase_Strenght()
        Strenghttext.setText(
          `Strenght:${mainscene.player.user.state.Strength}`
        );
    });
    this.container.add(panel);
    this.container.add(Strenght);
    this.container.add(Strenghttext);
    const Agility = scene.add
      .image(-350, -350, "plus")
      .setScale(0.5)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Agilitytext = scene.add.text(
      -330,
      -345,
      `Agility:${mainscene.player.user.state.Agility}`
    );
    Agility.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
     mainscene.player.user.increase_Agility()
        Agilitytext.setText(
          `Agility:${mainscene.player.user.state.Agility}`
        );
      });
      this.container.add(panel);
      this.container.add(Agility);
      this.container.add(Agilitytext);
      const Intelligence = scene.add
        .image(-350, -300, "plus")
        .setScale(0.5)
        .setOrigin(1, 0)
        .setTint(0x000000);
      const Intelligencetext = scene.add.text(
        -330,
        -295,
        `Intelligence:${mainscene.player.user.state.Intelligence}`
      );
      Intelligence.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
       mainscene.player.user.increase_Intelligence()
          Intelligencetext.setText(
            `Intelligence:${mainscene.player.user.state.Intelligence}`
          );
      });
      this.container.add(panel);
      this.container.add(Intelligence);
      this.container.add(Intelligencetext);
    const Constitution = scene.add
      .image(-350, -250, "plus")
      .setScale(0.5)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Constitutiontext = scene.add.text(
      -330,
      -245,
      `Constitution:${mainscene.player.user.state.Constitution}`
    );
    Constitution.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
     mainscene.player.user.increase_Constitution()
      Constitutiontext.setText(
          `Constitution:${mainscene.player.user.state.Constitution}`
        );
    });
    this.container.add(panel);
    this.container.add(Constitution);
    this.container.add(Constitutiontext);
    
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
