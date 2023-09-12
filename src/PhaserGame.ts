import Phaser from "phaser";

import MenuScene from "./scenes/menu/MenuScene";
import MainScene from "./scenes/main/MainScene";
import { UiScene } from "./scenes/Ui/uiScene";
import LoadScene from "./scenes/preLoad/Load";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",

  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: (2000 / 724) * window.innerHeight },
    },
  },
  scene: [LoadScene, MenuScene, MainScene, UiScene],
};
const game = new Phaser.Game(config);
export default game;
