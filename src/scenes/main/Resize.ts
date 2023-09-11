import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";

export function Resize(scene: MainScene | MenuScene) {
  // scene.shopobject = scene.shopobject
  //   ?.setScale(screenHeight / 290)
  //   .setPosition(screenWidth * 0.82, screenHeight * 0.63);

  scene.player.sprite = scene.player?.sprite.setScale(
    (2.2 / 1328) * window.innerWidth,
    (2.6 / 787) * window.innerHeight
  );
  // if (scene instanceof MainScene) {
  //   scene.goblin.sprite = scene.goblin.sprite.setScale(
  //     (2.3 / 1328) * window.innerWidth,
  //     (2.7 / 787) * window.innerHeight
  //   );
  // }
  scene.backgrounds.forEach((bg)=>{
     bg.sprite.setDisplaySize(
       window.innerWidth,
       window.innerHeight
     );
  })
  
  // if (scene.road !== undefined) {
  //   scene.road[0].sprite = scene.road[0].sprite
  //     .setOrigin(0)
  //     .setScale(window.innerWidth * 0.001388, window.innerHeight * 0.00353658)
  //     .setPosition(0, window.innerHeight * 0.6560975);
  // }
  scene.physics.world.setBounds(0, 0, Infinity, Infinity);
}
