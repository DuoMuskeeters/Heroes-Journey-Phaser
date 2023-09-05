import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";
import MenuScene from "./scenes/menu/MenuScene";
import MainScene from "./scenes/main/MainScene";
import { UiScene } from "./scenes/main/uiScene";
import LoadScene from "./scenes/menu/Laod";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",

  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 10,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: (2000 / 724) * window.innerHeight },
    },
  },
  scene: [LoadScene,MenuScene,MainScene, UiScene],
};
//npm install phaser3-nineslice --save @ferhat and @ilker
export default new Phaser.Game(config);
//window.innerHeight * 8.5365
