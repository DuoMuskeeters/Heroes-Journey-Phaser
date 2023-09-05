import type MenuScene from "../menu/MenuScene";
import type MainScene from "./MainScene";

export function Backroundmovement(scene: MainScene | MenuScene) {
  if (scene.backgrounds !== undefined) {
    for (const bg of scene.backgrounds) {
      bg.sprite.tilePositionX = scene.cameras.main.scrollX * bg.rationx;
    }
  }
  // if (scene.road !== undefined) {
  //   scene.road[0].sprite.tilePositionX =
  //     scene.cameras.main.scrollX * scene.road[0].rationx;
  // }
}
