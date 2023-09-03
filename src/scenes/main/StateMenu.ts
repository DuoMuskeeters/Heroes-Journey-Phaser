import { Scene } from "phaser";
import MainScene from "./MainScene";
import PhaserGame from "../../PhaserGame";

export default class statemenu {
  scene!: Phaser.Scene;
  container!: Phaser.GameObjects.Container;
  remaininpoints!: Phaser.GameObjects.Text;
  jacktext!:Phaser.GameObjects.Text
  private opened = false;
  get isOpen() {
    return this.opened;
  }
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;

    this.container = scene.add.container(
      window.innerWidth,
      window.innerHeight - 400
    );
    const title = scene.add
      .image(-265, -300, "title-iron")
      .setScale(0.3)
      .setOrigin(1, 0);
    const titletext = scene.add.text(-350, -290, "Stats");
    const panel = scene.add
      .image(0, -430, "statepanel")
      .setOrigin(1, 0)
      .setScale(0.6, 0.7);
    const line = scene.add
      .image(-12, -320, "line")
      .setOrigin(1, 0)
      .setScale(0.55, 1)
      .setTint(0x8b4513);
    const playeravatar = scene.add
      .image(-320, -370, "jack-avatar")
      .setScale(2);
    this.jacktext = scene.add.text(
      -270,
      -390,
      `Name: Jack    Level: ${mainscene.player.user.state.Level}\n
Job: Samurai  MAX HP: ${mainscene.player.user.state.max_hp}`
    );
    this.remaininpoints = scene.add
      .text(
        -50,
        -150,
        `Remaining Points:${mainscene.player.user.state.stat_point}`
      )
      .setOrigin(1, 0);
    const Strenght = scene.add
      .image(-200, -260, "plus")
      .setScale(0.3)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Strenghttext = scene.add.text(
      -375,
      -260,
      `Strenght:${mainscene.player.user.state.Strength}`
    );
    Strenght.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      mainscene.player.user.increase_Strenght();
      Strenghttext.setText(`Strenght:${mainscene.player.user.state.Strength}`);
    });
    const Agility = scene.add
      .image(-200, -235, "plus")
      .setScale(0.3)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Agilitytext = scene.add.text(
      -375,
      -235,
      `Agility:${mainscene.player.user.state.Agility}`
    );
    Agility.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      mainscene.player.user.increase_Agility();
      Agilitytext.setText(`Agility:${mainscene.player.user.state.Agility}`);
    });
    const Intelligence = scene.add
      .image(-200, -210, "plus")
      .setScale(0.3)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Intelligencetext = scene.add.text(
      -375,
      -210,
      `Intelligence:${mainscene.player.user.state.Intelligence}`
    );
    Intelligence.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      mainscene.player.user.increase_Intelligence();
      Intelligencetext.setText(
        `Intelligence:${mainscene.player.user.state.Intelligence}`
      );
    });
    const Constitution = scene.add
      .image(-200, -185, "plus")
      .setScale(0.3)
      .setOrigin(1, 0)
      .setTint(0x000000);
    const Constitutiontext = scene.add.text(
      -375,
      -185,
      `Constitution:${mainscene.player.user.state.Constitution}`
    );
    Constitution.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
      mainscene.player.user.increase_Constitution();
      Constitutiontext.setText(
        `Constitution:${mainscene.player.user.state.Constitution}`
      );
    });
    const preesc = scene.add
      .text(
        -30,
        -250,
        ` Press+C to 
    open or close`
      )
      .setOrigin(1, 0);
    this.container.add(panel);
    this.container.add(playeravatar);
    this.container.add(this.jacktext);
    this.container.add(Constitution);
    this.container.add(Constitutiontext);
    this.container.add(Intelligence);
    this.container.add(Intelligencetext);
    this.container.add(Agility);
    this.container.add(Agilitytext);
    this.container.add(Strenght);
    this.container.add(Strenghttext);
    this.container.add(line);
    this.container.add(title);
    this.container.add(titletext);
    this.container.add(this.remaininpoints);
    this.container.add(preesc);
  }
  show() {
    this.scene.tweens.add({
      targets: this.container,
      x: window.innerWidth,
      y: window.innerHeight - 800,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = true;
  }
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      x: window.innerWidth,
      y: window.innerHeight - 400,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = false;
  }
}
