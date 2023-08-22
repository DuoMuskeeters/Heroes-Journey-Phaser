import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";

export function Resize(scene: MainScene|MenuScene) {
  // scene.background1 = scene.background1
  //   ?.setOrigin(0)
  //   .setDisplaySize(screenWidth, screenHeight * 0.849);
  // scene.background2 = scene.background2
  //   ?.setOrigin(0)
  //   .setDisplaySize(screenWidth, screenHeight * 0.849);
  // scene.background3 = scene.background3
  //   ?.setOrigin(0)
  //   .setDisplaySize(screenWidth, screenHeight * 0.849);

  // scene.shopobject = scene.shopobject
  //   ?.setScale(screenHeight / 290)
  //   .setPosition(screenWidth * 0.82, screenHeight * 0.63);

  scene.player.sprite = scene.player?.sprite.setScale(window.innerHeight / 300);

  for (let i = 0; i < 3; i++) {
    scene.backgrounds[i].sprite.setDisplaySize(
      window.innerWidth,
      window.innerHeight * 0.849
    );
  }
  if (scene.road !== undefined) {
    scene.road[0].sprite = scene.road[0].sprite
      .setOrigin(0)
      .setScale(window.innerWidth * 0.001388, window.innerHeight * 0.00353658)
      .setPosition(0, window.innerHeight * 0.6560975);
  }
  scene.physics.world.setBounds(0, 0, Infinity, window.innerHeight);
}
