import MainScene from "../main/MainScene";
import PhaserGame, { CONFIG } from "../../PhaserGame";

export default class statemenu {
  scene!: Phaser.Scene;
  container!: Phaser.GameObjects.Container;
  remaininpoints!: Phaser.GameObjects.Text;
  jacktext!: Phaser.GameObjects.Text;
  character;
  private opened = false;
  get isOpen() {
    return this.opened;
  }
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;

    this.container = scene.add.container(CONFIG.width, 0);
    this.character = mainscene.player.character;
    const title = scene.add
      .image(-265, -300, "title-iron")
      .setScale(0.3, 0.3)
      .setOrigin(1, 0);
    const titletext = scene.add
      .text(-350, -290, "Stats")
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold");

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
      .setScale(2, 2);
    this.jacktext = scene.add
      .text(
        -270,
        -390,
        `Name:   Jack    Level:   ${this.character.state.Level}\n
Job: Samurai    MAX HP:   ${this.character.state.max_hp}`
      )
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold")
      .setScale(1.1, 1.1);
    this.remaininpoints = scene.add
      .text(-50, -150, `Remaining Points:  ${this.character.state.stat_point}`)
      .setOrigin(1, 0);
    const Strenght = scene.add.image(-200, -260, "plus");
    const Strenghttext = scene.add.text(
      -375,
      -260,
      `Strenght:  ${this.character.state.Strength}`
    );
    const Agility = scene.add.image(-200, -235, "plus");
    const Agilitytext = scene.add.text(
      -375,
      -235,
      `Agility:  ${this.character.state.Agility}`
    );
    const Intelligence = scene.add.image(-200, -210, "plus");
    const Intelligencetext = scene.add.text(
      -375,
      -210,
      `Intelligence: ${this.character.state.Intelligence}`
    );
    const Constitution = scene.add.image(-200, -185, "plus");
    const Constitutiontext = scene.add.text(
      -375,
      -185,
      `Constitution: ${this.character.state.Constitution}`
    );
    const buttons = [
      { type: "Strength", image: Strenght, text: Strenghttext },
      { type: "Agility", image: Agility, text: Agilitytext },
      { type: "Intelligence", image: Intelligence, text: Intelligencetext },
      { type: "Constitution", image: Constitution, text: Constitutiontext },
    ] as const;

    buttons.forEach((button) => {
      button.image.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.character.state.stat_point > 0) {
          // button type -> "Agility"
          this.character.increase(button.type);
          button.text.setText(
            `${button.type}: ${this.character.state[button.type]}`
          );
          this.remaininpoints.setText(
            `Remaining Points :  ${this.character.state.stat_point}`
          );
        }
      });
      button.image.setScale(0.3, 0.3).setOrigin(1, 0).setTint(0x000000);

      button.text.setFontFamily("Bradley Hand, cursive").setFontStyle("bold");
    });

    const preesc = scene.add
      .text(
        -30,
        -250,
        ` Press+C to 
    open or close`
      )
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold")
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
      x: CONFIG.width,
      y: 420,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = true;
  }
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      x: CONFIG.width,
      y: 20,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = false;
  }
  update() {
    this.remaininpoints.setText(
      `Remaining Points :  ${this.character.state.stat_point}`
    );
    this.jacktext.setText(
      `Name: Jack    Level: ${this.character.state.Level}

Job: Samurai  MAX HP: ${this.character.state.max_hp}`
    );
  }
}
