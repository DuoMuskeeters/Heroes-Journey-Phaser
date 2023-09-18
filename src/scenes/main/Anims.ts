import { CONFIG } from "../../PhaserGame";
import { goblinEventsTypes, mcEventTypes } from "../../game/types/events";
import { goblinAnimTypes, mcAnimTypes } from "../../game/types/types";
import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";
import MobController from "./mobController";

export function createPlayeranims(scene: MainScene | MenuScene) {
  const isMainScene = scene instanceof MainScene;
  scene.player.sprite = scene.physics.add
    .sprite(300, 0, mcAnimTypes.IDLE)
    .setCollideWorldBounds(true)
    .setBounce(0.1)
    .setScale(2.55)
    .setBodySize(30, 40, true)
    .setDepth(300);

  scene.anims.create({
    key: mcAnimTypes.IDLE,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.IDLE, {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.RUN,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.RUN, {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.JUMP,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.JUMP, {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });

  if (isMainScene)
    scene.anims.create({
      key: mcAnimTypes.ATTACK_1,
      frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_1, {
        start: 0,
        end: 6,
      }),
      frameRate: scene.player.user.state.ATKRATE * 10,
      repeat: -1,
    });

  scene.anims.create({
    key: mcAnimTypes.FALL,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.FALL, {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.ATTACK_2,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_2, {
      start: 0,
      end: 6,
    }),
    frameRate: 17,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.DEATH,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.DEATH, {
      start: 0,
      end: 6,
    }),
    frameRate: 10,
    repeat: 1,
  });

  scene.anims.create({
    key: mcAnimTypes.TAKE_HIT,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.TAKE_HIT, {
      start: 0,
      end: 4,
    }),
    frameRate: 4,
    repeat: -1,
  });
}
export function createGoblinAnims(controller: MobController) {
  controller.scene.anims.create({
    key: goblinAnimTypes.ULTI,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.ULTI,
      { start: 12, end: 0 }
    ),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.IDLE,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.IDLE,
      { start: 4, end: 0 }
    ),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.TAKE_HIT,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.TAKE_HIT,
      { start: 4, end: 0 }
    ),
    frameRate: 10,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.DEATH,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.DEATH,
      { start: 4, end: 0 }
    ),
    frameRate: 8,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.RUN,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.RUN,
      { start: 8, end: 0 }
    ),
    frameRate: 7,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.ATTACK,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.ATTACK,
      { start: 8, end: 0 }
    ),
    frameRate: controller.mob.goblin.state.ATKRATE * 6.5,
    repeat: -1,
  });

  controller.scene.anims.create({
    key: goblinAnimTypes.BOMB,
    frames: controller.scene.anims.generateFrameNumbers(
      goblinAnimTypes.BOMB,
      { start: 19, end: 0 }
    ),
    frameRate: 10,
    repeat: -1,
  });
}
export function createGoblinBomb(scene: MainScene) {
  return scene.physics.add
    .sprite(
      scene.player.sprite.body.center.x,
      scene.player.sprite.y - 200,
      goblinAnimTypes.BOMB
    )
    .setScale(2.5, 2.5)
    .setDepth(4)
    .setBodySize(25, 15, true)
}
export function shop(scene: MainScene | MenuScene) {
  scene.shopobject = scene.add
    .sprite(1400, 560, "shopanim")
    .setScale(3)
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
