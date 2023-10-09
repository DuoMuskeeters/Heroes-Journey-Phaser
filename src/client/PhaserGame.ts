import Phaser from "phaser";

import MenuScene from "./scenes/menu/MenuScene";
import MainScene from "./scenes/main/MainScene";
import { UiScene } from "./scenes/Ui/uiScene";
import LoadScene from "./scenes/preLoad/Load";

export const CONFIG = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",

  width: 1600,
  height: 900,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: (2000 / 724) * /*CONFIG.height*/ 900 },
    },
  },
} as const; // satisfies Phaser.Types.Core.GameConfig;

const game = new Phaser.Game({
  ...CONFIG,
  scene: [LoadScene, MenuScene, MainScene, UiScene],
});
export default game;
