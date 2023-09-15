import { goblinEventsTypes, mcEventTypes } from "../../game/types/events";
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
    key: mcEventTypes.IDLE,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.IDLE, {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcEventTypes.RUN,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.RUN, {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcEventTypes.JUMP,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.JUMP, {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });

  if (isMainScene)
    scene.anims.create({
      key: mcEventTypes.REGULAR_ATTACK,
      frames: scene.anims.generateFrameNumbers(mcEventTypes.REGULAR_ATTACK, {
        start: 0,
        end: 6,
      }),
      frameRate: scene.player.user.state.ATKRATE * 10,
      repeat: -1,
    });

  scene.anims.create({
    key: mcEventTypes.FALL,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.FALL, {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcEventTypes.ULTI,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.ULTI, {
      start: 0,
      end: 6,
    }),
    frameRate: 17,
    repeat: -1,
  });

  scene.anims.create({
    key: mcEventTypes.DIED,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.DIED, {
      start: 0,
      end: 6,
    }),
    frameRate: 10,
    repeat: 1,
  });

  scene.anims.create({
    key: mcEventTypes.TOOK_HIT,
    frames: scene.anims.generateFrameNumbers(mcEventTypes.TOOK_HIT, {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
export function goblinMob(controller: MobController) {
  controller.scene.anims.create({
    key: goblinEventsTypes.ULTI,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.ULTI,
      { start: 12, end: 0 }
    ),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.IDLE,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.IDLE,
      { start: 4, end: 0 }
    ),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.TOOK_HIT,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.TOOK_HIT,
      { start: 4, end: 0 }
    ),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.DIED,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.DIED,
      { start: 4, end: 0 }
    ),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.STARTED_RUNNING,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.STARTED_RUNNING,
      { start: 8, end: 0 }
    ),
    frameRate: 7,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.ATTACKING,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.ATTACKING,
      { start: 8, end: 0 }
    ),
    frameRate: controller.mob.goblin.state.ATKRATE * 6.5,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinEventsTypes.BOMB,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinEventsTypes.BOMB,
      { start: 19, end: 0 }
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
