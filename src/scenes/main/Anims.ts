import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";
import { mobattack } from "./MobAttack";

export function JackPlayer(scene: MainScene | MenuScene) {
  const isMainScene = scene instanceof MainScene;

  if (isMainScene) {
    scene.player.sprite = scene.add
      .sprite(100, 0, "ıdle")
      // .setCollideWorldBounds(true)
      .setScale(window.innerHeight / 300)
      .setDepth(300);
  } else {
    scene.player.sprite = scene.physics.add
      .sprite(100, 0, "ıdle")
      .setCollideWorldBounds(true)
      .setScale(window.innerHeight / 300)
      .setDepth(300);
  }

  scene.anims.create({
    key: "ıdle",
    frames: scene.anims.generateFrameNumbers("ıdle", {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "run",
    frames: scene.anims.generateFrameNumbers("run", {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "jump",
    frames: scene.anims.generateFrameNumbers("jump", {
      start: 0,
      end: 2,
    }),
    frameRate: 8,
    repeat: -1,
  });

  if (isMainScene)
    scene.anims.create({
      key: "attack1",
      frames: scene.anims.generateFrameNumbers("attack1", {
        start: 0,
        end: 6,
      }),
      frameRate: scene.player.user.state.ATKRATE * 10,
      repeat: -1,
    });

  scene.anims.create({
    key: "fall",
    frames: scene.anims.generateFrameNumbers("fall", {
      start: 0,
      end: 2,
    }),
    frameRate: 17,
    repeat: -1,
  });

  scene.anims.create({
    key: "attack2",
    frames: scene.anims.generateFrameNumbers("attack2", {
      start: 0,
      end: 6,
    }),
    frameRate: 17,
    repeat: -1,
  });

  scene.anims.create({
    key: "death",
    frames: scene.anims.generateFrameNumbers("death", {
      start: 0,
      end: 6,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "take-hit",
    frames: scene.anims.generateFrameNumbers("take-hit", {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
export function goblinMob(scene: MainScene, atkrate: number) {
  scene.anims.create({
    key: "goblin-bomb",
    frames: scene.anims.generateFrameNumbers("goblin-bomb", {
      start: 12,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "goblin-ıdle",
    frames: scene.anims.generateFrameNumbers("goblin-ıdle", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: "goblin-takehit",
    frames: scene.anims.generateFrameNumbers("goblin-takehit", {
      start: 4,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "goblin-death",
    frames: scene.anims.generateFrameNumbers("goblin-death", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: "goblin-run",
    frames: scene.anims.generateFrameNumbers("goblin-run", {
      start: 8,
      end: 0,
    }),
    frameRate: 7,
    repeat: -1,
  });

  scene.anims.create({
    key: "goblin-attack",
    frames: scene.anims.generateFrameNumbers("goblin-attack", {
      start: 8,
      end: 0,
    }),
    frameRate: atkrate * 6.5,
    repeat: -1,
  });

  // scene.bomb.sprite = scene.add
  //   .sprite(
  //     window.innerWidth * 0.82,
  //     window.innerHeight * 0.63,
  //     `goblin-attack-bomb`
  //   )
  //   .setScale(window.innerHeight / 300)
  //   .setDepth(4)
  //   .setVisible(false);

  scene.anims.create({
    key: "goblin-attack-bomb",
    frames: scene.anims.generateFrameNumbers("goblin-attack-bomb", {
      start: 19,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // mobattack(scene);
}
export function shop(scene: MainScene | MenuScene) {
  scene.shopobject = scene.add
    .sprite(window.innerWidth * 0.82, window.innerHeight * 0.62, "shopanim")
    .setScale(window.innerHeight / 290)
    .setDepth(0);

  scene.anims.create({
    key: "shop",
    frames: scene.anims.generateFrameNumbers("shopanim", {
      start: 0,
      end: 6,
    }),
    frameRate: 8,
    repeat: -1,
  });
}
