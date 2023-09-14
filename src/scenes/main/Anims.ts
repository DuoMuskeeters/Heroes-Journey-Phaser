import { goblinEventsTypes } from "../../game/types/events";
import { dirVelocity } from "../../game/types/types";
import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function createPlayeranims(scene: MainScene | MenuScene) {
  const isMainScene = scene instanceof MainScene;
  scene.player.sprite = scene.physics.add
    .sprite(300, 0, "ıdle")
    .setCollideWorldBounds(true)
    .setBounce(0.1)
    .setScale(window.innerHeight / 300)
    .setDepth(300)
    .setBodySize(30, 40, true);

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
    frameRate: 10,
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
    frameRate: 10,
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
    repeat: 1,
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
export function goblinMob(controller: MobController) {
  controller.scene.anims.create({
    key: "goblin-bomb",
    frames: controller.scene.anims.generateFrameNumbers("goblin-bomb", {
      start: 12,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: "goblin-ıdle",
    frames: controller.scene.anims.generateFrameNumbers("goblin-ıdle", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: "goblin-takehit",
    frames: controller.scene.anims.generateFrameNumbers("goblin-takehit", {
      start: 4,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: "goblin-death",
    frames: controller.scene.anims.generateFrameNumbers("goblin-death", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: "goblin-run",
    frames: controller.scene.anims.generateFrameNumbers("goblin-run", {
      start: 8,
      end: 0,
    }),
    frameRate: 7,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: "goblin-attack",
    frames: controller.scene.anims.generateFrameNumbers("goblin-attack", {
      start: 8,
      end: 0,
    }),
    frameRate: controller.mob.goblin.state.ATKRATE * 6.5,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.BOMB,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.BOMB,
      {
        start: 19,
        end: 0,
      }
    ),
    frameRate: 10,
    repeat: -1,
  });
}
export function createGoblinBomb(scene: MainScene) {
  return scene.physics.add
    .sprite(
      window.innerWidth * 0.82,
      window.innerHeight * 0.63,
      goblinEventsTypes.BOMB
    )
    .setScale(
      (2.5 / 1405) * window.innerWidth,
      (2.5 / 569) * window.innerHeight
    )
    .setDepth(4)
    .setPosition(
      scene.player.sprite.x,
      scene.player.sprite.y - (200 / 900) * window.innerHeight
    )
    .setBodySize(25, 15, true);
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
