import MainScene from "../main/MainScene";
import PhaserGame from "../../PhaserGame";

export default class statemenu {
  scene!: Phaser.Scene;
  container!: Phaser.GameObjects.Container;
  remaininpoints!: Phaser.GameObjects.Text;
  jacktext!: Phaser.GameObjects.Text;
  private opened = false;
  get isOpen() {
    return this.opened;
  }
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const mainscene = PhaserGame.scene.keys.mainscene as MainScene;

    this.container = scene.add.container(window.innerWidth, 0);
    const title = scene.add
      .image(
        (-265 / 1440) * window.innerWidth,
        (-300 / 900) * window.innerHeight,
        "title-iron"
      )
      .setScale(
        (0.3 / 1440) * window.innerWidth,
        (0.3 / 900) * window.innerHeight
      )
      .setOrigin(1, 0);
    const titletext = scene.add
      .text(
        (-350 / 1440) * window.innerWidth,
        (-290 / 900) * window.innerHeight,
        "Stats"
      )
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold")
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
    const panel = scene.add
      .image(0, (-430 / 900) * window.innerHeight, "statepanel")
      .setOrigin(1, 0)
      .setScale(
        (0.6 / 1440) * window.innerWidth,
        (0.7 / 900) * window.innerHeight
      );
    const line = scene.add
      .image(
        (-12 / 1440) * window.innerWidth,
        (-320 / 900) * window.innerHeight,
        "line"
      )
      .setOrigin(1, 0)
      .setScale(
        (0.55 / 1440) * window.innerWidth,
        (1 / 900) * window.innerHeight
      )
      .setTint(0x8b4513);
    const playeravatar = scene.add
      .image(
        (-320 / 1440) * window.innerWidth,
        (-370 / 900) * window.innerHeight,
        "jack-avatar"
      )
      .setScale((2 / 1440) * window.innerWidth, (2 / 900) * window.innerHeight);
    this.jacktext = scene.add
      .text(
        (-270 / 1440) * window.innerWidth,
        (-390 / 900) * window.innerHeight,
        `Name:   Jack    Level:   ${mainscene.player.user.state.Level}\n
Job: Samurai    MAX HP:   ${mainscene.player.user.state.max_hp}`
      )
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold")
      .setScale(
        (1.1 / 1440) * window.innerWidth,
        (1.1 / 900) * window.innerHeight
      );
    this.remaininpoints = scene.add
      .text(
        (-50 / 1440) * window.innerWidth,
        (-150 / 900) * window.innerHeight,
        `Remaining Points:  ${mainscene.player.user.state.stat_point}`
      )
      .setOrigin(1, 0);
    const Strenght = scene.add.image(
      (-200 / 1440) * window.innerWidth,
      (-260 / 900) * window.innerHeight,
      "plus"
    );
    const Strenghttext = scene.add.text(
      (-375 / 1440) * window.innerWidth,
      (-260 / 900) * window.innerHeight,
      `Strenght:  ${mainscene.player.user.state.Strength}`
    );
    const Agility = scene.add.image(
      (-200 / 1440) * window.innerWidth,
      (-235 / 900) * window.innerHeight,
      "plus"
    );
    const Agilitytext = scene.add.text(
      (-375 / 1440) * window.innerWidth,
      (-235 / 900) * window.innerHeight,
      `Agility:  ${mainscene.player.user.state.Agility}`
    );
    const Intelligence = scene.add.image(
      (-200 / 1440) * window.innerWidth,
      (-210 / 900) * window.innerHeight,
      "plus"
    );
    const Intelligencetext = scene.add.text(
      (-375 / 1440) * window.innerWidth,
      (-210 / 900) * window.innerHeight,
      `Intelligence: ${mainscene.player.user.state.Intelligence}`
    );
    const Constitution = scene.add.image(
      (-200 / 1440) * window.innerWidth,
      (-185 / 900) * window.innerHeight,
      "plus"
    );
    const Constitutiontext = scene.add.text(
      (-375 / 1440) * window.innerWidth,
      (-185 / 900) * window.innerHeight,
      `Constitution: ${mainscene.player.user.state.Constitution}`
    );
    const buttons = [
      { type: "Strength", image: Strenght, text: Strenghttext },
      { type: "Agility", image: Agility, text: Agilitytext },
      { type: "Intelligence", image: Intelligence, text: Intelligencetext },
      { type: "Constitution", image: Constitution, text: Constitutiontext },
    ] as const;

    buttons.forEach((button) => {
      button.image.setInteractive().on(Phaser.Input.Events.POINTER_UP, () => {
        if (mainscene.player.user.state.stat_point > 0) {
          // button type -> "Agility"
          mainscene.player.user.increase(button.type);
          button.text.setText(
            `${button.type}: ${mainscene.player.user.state[button.type]}`
          );
          this.remaininpoints.setText(
            `Remaining Points :  ${mainscene.player.user.state.stat_point}`
          );
        }
      });
      button.image
        .setScale(
          (0.3 / 1440) * window.innerWidth,
          (0.3 / 900) * window.innerHeight
        )
        .setOrigin(1, 0)
        .setTint(0x000000);

      button.text
        .setFontFamily("Bradley Hand, cursive")
        .setFontStyle("bold")
        .setScale(
          (1 / 1440) * window.innerWidth,
          (1 / 900) * window.innerHeight
        );
    });

    

    const preesc = scene.add
      .text(
        (-30 / 1440) * window.innerWidth,
        (-250 / 900) * window.innerHeight,
        ` Press+C to 
    open or close`
      )
      .setFontFamily("Bradley Hand, cursive")
      .setFontStyle("bold")
      .setOrigin(1, 0)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
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
      y: (420 / 900) * window.innerHeight,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = true;
  }
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      x: window.innerWidth,
      y: (20 / 900) * window.innerHeight,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
    this.opened = false;
  }
}
