import MainScene from "./MainScene";

export function Backroundmovement(scene: MainScene) {
  if (scene.backgrounds !== undefined) {
    {
      for (let i = 0; i < scene.backgrounds?.length; i++) {
        const bg = scene.backgrounds[i];
        bg.sprite.tilePositionX = scene.cameras.main.scrollX * bg.rationx;
      }
    }
  }
  if (scene.road !== undefined) {
    scene.road[0].sprite.tilePositionX =
      scene.cameras.main.scrollX * scene.road[0].rationx;
  }
}
