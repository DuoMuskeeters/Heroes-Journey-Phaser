import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",

  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: window.innerHeight * 8.5365 },
    },
  },
  scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
