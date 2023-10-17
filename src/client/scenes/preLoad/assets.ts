import { CONFIG } from "../../PhaserGame";
import type LoadScene from "./Load";

export function preloadAssets(scene: LoadScene) {
  scene.load.pack("jack", "jack-package.json");
  scene.load.pack("iroh", "iroh-package.json");
  scene.load.pack("game", "game-package.json");
  scene.load.pack("goblin", "goblin-package.json");
}

export function createBackground(scene: Phaser.Scene) {
  const bg1 = {
    rationx: 0.05,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background1")
      .setOrigin(0, 0)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setDepth(-3)
      .setScrollFactor(0),
  };

  const bg2 = {
    rationx: 0.1,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setScrollFactor(0),
  };

  const bg3 = {
    rationx: 0.15,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background3")
      .setOrigin(0, 0)
      .setDepth(-1)
      .setDisplaySize(CONFIG.width, CONFIG.height)
      .setScrollFactor(0),
  };
  return [bg1, bg2, bg3];
}
export function forestRoad(scene: Phaser.Scene) {
  const road = {
    rationx: 0.3,
    sprite: scene.add
      .tileSprite(0, 900, 0, 0, "piskel")
      .setOrigin(0, 1)
      .setScale(3.5)
      .setScrollFactor(0),
  };

  return road;
}
