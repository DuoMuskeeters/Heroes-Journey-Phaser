import Phaser from "phaser";

import MenuScene from "./scenes/menu/MenuScene";
import MainScene from "./scenes/main/MainScene";
import { UiScene } from "./scenes/Ui/uiScene";
import LoadScene from "./scenes/preLoad/Load";

export const CONFIG = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",
  fps: {
    target: 30,
  },

  width: 1600,
  height: 900,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 1 },
    },
  },
} as const satisfies Phaser.Types.Core.GameConfig;

const game = new Phaser.Game({
  ...CONFIG,
  scene: [LoadScene, MenuScene, MainScene, UiScene],
});
export default game;
