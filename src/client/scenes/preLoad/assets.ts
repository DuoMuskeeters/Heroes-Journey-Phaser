export function preloadAssets(scene: Phaser.Scene) {
  scene.load.pack("jack", "jack-package.json");
  scene.load.pack("iroh", "iroh-package.json");
  scene.load.pack("game", "game-package.json");
  scene.load.pack("goblin", "goblin-package.json");
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
