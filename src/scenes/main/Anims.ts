import {
  Warrior,
  create_character,
  mob_exp_kazancı,
} from "../../game/Karakter";
import MenuScene from "../menu/MenuScene";
import { goblinHealtbar, healtbar } from "./Components";
import MainScene from "./MainScene";
import { mobattack } from "./MobAttack";
import { Direction, dirVelocity } from "./types";

export function JackPlayer(scene: MainScene | MenuScene) {
  scene.player.sprite = scene.physics.add
    .sprite(100, 0, "right")
    .setCollideWorldBounds(true)
    .setScale(window.innerHeight / 300)
    .setBounce(0.2)
    .setDepth(300);
  scene.anims.create({
    key: "ıdle-right",
    frames: scene.anims.generateFrameNumbers("ıdle-right", {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "ıdle-left",
    frames: scene.anims.generateFrameNumbers("ıdle-left", {
      start: 8,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "left",
    frames: scene.anims.generateFrameNumbers("left", {
      start: 8,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "right",
    frames: scene.anims.generateFrameNumbers("right", {
      start: 0,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "jump-right",
    frames: scene.anims.generateFrameNumbers("jump-right", {
      start: 0,
      end: 2,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "jump-left",
    frames: scene.anims.generateFrameNumbers("jump-left", {
      start: 2,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "attack1-right",
    frames: scene.anims.generateFrameNumbers("attack1-right", {
      start: 0,
      end: 6,
    }),
    frameRate: scene.player.user.state.ATKRATE * 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "attack1-left",
    frames: scene.anims.generateFrameNumbers("attack1-left", {
      start: 6,
      end: 0,
    }),
    frameRate: scene.player.user.state.ATKRATE * 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "fall-right",
    frames: scene.anims.generateFrameNumbers("fall-right", {
      start: 0,
      end: 2,
    }),
    frameRate: 17,
    repeat: -1,
  });
  scene.anims.create({
    key: "fall-left",
    frames: scene.anims.generateFrameNumbers("fall-left", {
      start: 2,
      end: 0,
    }),
    frameRate: 17,
    repeat: -1,
  });
  scene.anims.create({
    key: "attack2-right",
    frames: scene.anims.generateFrameNumbers("attack2-right", {
      start: 0,
      end: 6,
    }),
    frameRate: 17,
    repeat: -1,
  });
  scene.anims.create({
    key: "attack2-left",
    frames: scene.anims.generateFrameNumbers("attack2-left", {
      start: 6,
      end: 0,
    }),
    frameRate: 17,
    repeat: -1,
  });
  scene.anims.create({
    key: "death-left",
    frames: scene.anims.generateFrameNumbers("death-left", {
      start: 6,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "death-right",
    frames: scene.anims.generateFrameNumbers("death-right", {
      start: 0,
      end: 6,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "take-hit-left",
    frames: scene.anims.generateFrameNumbers("take-hit-left", {
      start: 4,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "take-hit-right",
    frames: scene.anims.generateFrameNumbers("take-hit-right", {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
export function goblinMob(scene: MainScene) {
  scene.goblin.sprite = scene.physics.add
    .sprite(
      scene.player.sprite.x + 500,
      window.innerHeight * 0.63,
      "goblin-left"
    )
    .setScale(window.innerHeight / 300)
    .setDepth(4)
    .setCollideWorldBounds(true)
    .setBounce(0.2);
  scene.anims.create({
    key: "goblin-bomb-left",
    frames: scene.anims.generateFrameNumbers("goblin-bomb-left", {
      start: 12,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-bomb-right",
    frames: scene.anims.generateFrameNumbers("goblin-bomb-right", {
      start: 0,
      end: 12,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-left",
    frames: scene.anims.generateFrameNumbers("goblin-left", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-right",
    frames: scene.anims.generateFrameNumbers("goblin-right", {
      start: 0,
      end: 4,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-takehit-left",
    frames: scene.anims.generateFrameNumbers("goblin-takehit-left", {
      start: 4,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-takehit-right",
    frames: scene.anims.generateFrameNumbers("goblin-takehit-right", {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-death-left",
    frames: scene.anims.generateFrameNumbers("goblin-death-left", {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-death-right",
    frames: scene.anims.generateFrameNumbers("goblin-death-right", {
      start: 0,
      end: 4,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-run-left",
    frames: scene.anims.generateFrameNumbers("goblin-run-left", {
      start: 8,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-run-right",
    frames: scene.anims.generateFrameNumbers("goblin-run-right", {
      start: 0,
      end: 8,
    }),
    frameRate: 8,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-attack-left",
    frames: scene.anims.generateFrameNumbers("goblin-attack-left", {
      start: 8,
      end: 0,
    }),
    frameRate: scene.goblin.mob.state.ATKRATE * 6.5,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-attack-right",
    frames: scene.anims.generateFrameNumbers("goblin-attack-right", {
      start: 0,
      end: 8,
    }),
    frameRate: scene.goblin.mob.state.ATKRATE * 6.5,
    repeat: -1,
  });

  scene.bomb.sprite = scene.physics.add
    .sprite(
      window.innerWidth * 0.82,
      window.innerHeight * 0.63,
      `goblin-attack-bomb-${scene.goblin.lastdirection}`
    )
    .setScale(window.innerHeight / 300)
    .setDepth(4)
    .setCollideWorldBounds(true)
    .setBounce(0.2)
    .setVisible(false);

  scene.anims.create({
    key: "goblin-attack-bomb-left",
    frames: scene.anims.generateFrameNumbers("goblin-attack-bomb-left", {
      start: 19,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: "goblin-attack-bomb-right",
    frames: scene.anims.generateFrameNumbers("goblin-attack-bomb-right", {
      start: 0,
      end: 19,
    }),
    frameRate: 10,
    repeat: -1,
  });

  mobattack(scene);
}
export function shop(scene: MainScene | MenuScene) {
  scene.shopobject = scene.add
    .sprite(window.innerWidth * 0.82, window.innerHeight * 0.63, "shopanim")
    .setScale(window.innerHeight / 290);

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
