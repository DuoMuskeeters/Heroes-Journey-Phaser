export function Backroundmovement(
  scene: {
    backgrounds: { rationx: number; sprite: Phaser.GameObjects.TileSprite }[];
  },
  cameras: { main: { scrollX: number } }
) {
  if (scene.backgrounds !== undefined) {
    for (const bg of scene.backgrounds) {
      bg.sprite.tilePositionX = cameras.main.scrollX * bg.rationx;
    }
  }
}
