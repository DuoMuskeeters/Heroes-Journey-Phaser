import Phaser from "phaser";
import MainScene from "./MainScene";
import MenuScene from "../menu/MenuScene";
export function preloadAssets(scene: MainScene | MenuScene) {
  console.log(1);
  scene.load.image("background1", "background/background_layer_1.png");
  scene.load.image("background2", "background/background_layer_2.png");
  scene.load.image("background3", "background/background_layer_3.png");
  scene.load.image("shop", "shop_anim.png");
  scene.load.image("piskel", "Road.png");
  scene.load.image("statebutton", "statebutton.png");
  scene.load.image("statepanel", "statepanel.png");
  scene.load.image("plus", "Plus.png");
  scene.load.image("player-avatar","jack-avatar.png");
  scene.load.image("line", "Division-line.png");
  scene.load.image("title-iron", "title-iron.png");




  scene.load.spritesheet("ıdle-right", "Idle.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("ıdle-left", "Idle2.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("right", "run-right.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("left", "run-left.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("jump-right", "Jump.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("jump-left", "Jump2.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("attack1-right", "Attack1.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("attack1-left", "attack1left.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("fall-right", "Fall.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("fall-left", "Fall2.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("attack2-right", "Attack2.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("attack2-left", "attack2left.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("death-left", "death-left.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("death-right", "death-right.png", {
    frameWidth: scene.player.framewidth,
    frameHeight: scene.player.frameheight,
  });
  scene.load.spritesheet("goblin-left", "goblin-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-right", "goblin-right.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-bomb-left", "goblin-bomb-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-run-left", "goblin-run-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-run-right", "goblin-run-right.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-attack-left", "goblin-attack-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-attack-right", "goblin-attack-right.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-takehit-left", "goblin-takehit-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });

  scene.load.spritesheet("goblin-takehit-right", "goblin-takehit-right.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-death-left", "goblin-death-left.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });

  scene.load.spritesheet("goblin-death-right", "goblin-death-right.png", {
    frameWidth: scene.goblin?.frameWidth,
    frameHeight: scene.goblin?.frameHeight,
  });
  scene.load.spritesheet("goblin-attack-bomb", "goblin-attack-bomb.png", {
    frameWidth: 100,
    frameHeight: 100,
  });
  scene.load.spritesheet("shopanim", "shop_anim.png", {
    frameWidth: 118,
    frameHeight: 128,
  });
}

export function forestBackground(scene: MainScene | MenuScene) {
  scene.backgrounds?.push({
    rationx: 0.05,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background1")
      .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
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

      .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
      .setScrollFactor(0),
  });

  scene.backgrounds?.push({
    rationx: 0.15,
    sprite: scene.add
      .tileSprite(0, 0, 0, 0, "background3")
      .setOrigin(0, 0)
      .setDepth(-1)
      .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
      .setScrollFactor(0),
  });
}
export function forestRoad(scene: MainScene | MenuScene) {
  scene.road?.push({
    rationx: 0.3,
    sprite: scene.add
      .tileSprite(0, window.innerHeight * 0.628, 0, 0, "piskel")
      .setOrigin(0)
      .setScale(window.innerHeight * 0.0039)
      .setScrollFactor(0),
  });
}
