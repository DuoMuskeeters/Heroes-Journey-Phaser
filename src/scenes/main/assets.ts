import Phaser from "phaser";
import MainScene from "./MainScene";
import MenuScene from "../menu/MenuScene";
import LoadScene from "../menu/Laod";

export function preloadAssets(scene: LoadScene) {
  scene.load.pack("mainscene", "player-package.json");
  scene.load.pack("game", "game-package.json");
  scene.load.pack("goblin", "goblin-package.json");
}

export function forestBackground(scene: MainScene | MenuScene) {
  scene.backgrounds?.push({
    rationx: 0.05,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background1")
      .setDisplaySize(window.innerWidth, window.innerHeight)
      .setOrigin(0, 0)
      .setDepth(-3)
      .setScrollFactor(0),
  });

  scene.backgrounds?.push({
    rationx: 0.1,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background2")
      .setOrigin(0, 0)
      .setDepth(-2)

      .setDisplaySize(window.innerWidth, window.innerHeight)
      .setScrollFactor(0),
  });

  scene.backgrounds?.push({
    rationx: 0.15,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background3")
      .setOrigin(0, 0)
      .setDepth(-1)
      .setDisplaySize(window.innerWidth, window.innerHeight)
      .setScrollFactor(0),
  });
}
export function forestRoad(scene: MenuScene) {
  scene.road?.push({
    rationx: 0.3,
    sprite: scene.add
      .tileSprite(0, window.innerHeight * 0.628, 0, 0, "piskel")
      .setOrigin(0)
      .setScale(window.innerHeight * 0.0039)
      .setScrollFactor(0),
  });
}
