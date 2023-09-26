import PhaserGame from "../../PhaserGame";
import { Character, Warrior } from "../../game/Karakter";
import { goblinAnimTypes, mcAnimTypes } from "../../game/types/types";
import { Player } from "../../objects/player";
import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";
export function loadAnimations(scene: MainScene | MenuScene) {
  createPlayeranims(scene);
  createGoblinAnims(scene);
}

export function createPlayeranims(scene: MainScene | MenuScene) {
  const iroh = {
    type: "iroh" as const,
    ıdle: 7,
    run: 7,
    jump: 2,
    fall: 2,
    death: 10,
    takehit: 3,
    attack1: 4,
    attack1_combo2: 3,
    attack1_combo3: 3,
    attack2: 15,
  } as const;

  const jack = {
    type: "jack" as const,
    ıdle: 7,
    run: 7,
    jump: 2,
    fall: 3,
    attack1: 6,
    attack2: 6,
    death: 6,
    takehit: 4,
  } as const;

  const mc = scene.player.character instanceof Warrior ? iroh : jack;

  scene.anims.create({
    key: mcAnimTypes.IDLE,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.IDLE, {
      start: 0,
      end: mc.ıdle,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.RUN,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.RUN, {
      start: 0,
      end: mc.run,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.JUMP,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.JUMP, {
      start: 0,
      end: mc.jump,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: mcAnimTypes.ATTACK_2,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_2, {
      start: 0,
      end: mc.attack2,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: mcAnimTypes.ATTACK_1,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_1, {
      start: 0,
      end: mc.attack1,
    }),
    frameRate: 10,
    repeat: -1,
  });

  if (mc.type === "iroh") {
    scene.anims.create({
      key: mcAnimTypes.ATTACK_1_COMBO2,
      frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_1_COMBO2, {
        start: 0,
        end: mc.attack1_combo2,
      }),
      frameRate: 10,
      repeat: 0,
    });
    scene.anims.create({
      key: mcAnimTypes.ATTACK_1_COMBO3,
      frames: scene.anims.generateFrameNumbers(mcAnimTypes.ATTACK_1_COMBO3, {
        start: 0,
        end: mc.attack1_combo3,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }
  scene.anims.create({
    key: mcAnimTypes.FALL,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.FALL, {
      start: 0,
      end: mc.fall,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: mcAnimTypes.DEATH,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.DEATH, {
      start: 0,
      end: mc.death,
    }),
    frameRate: 10,
    repeat: 1,
  });

  scene.anims.create({
    key: mcAnimTypes.TAKE_HIT,
    frames: scene.anims.generateFrameNumbers(mcAnimTypes.TAKE_HIT, {
      start: 0,
      end: mc.takehit,
    }),
    frameRate: 4,
    repeat: -1,
  });
}
export function createGoblinAnims(scene: Phaser.Scene) {
  scene.anims.create({
    key: goblinAnimTypes.ULTI,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.ULTI, {
      start: 12,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.IDLE,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.IDLE, {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.TAKE_HIT,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.TAKE_HIT, {
      start: 4,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.DEATH,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.DEATH, {
      start: 4,
      end: 0,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.RUN,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.RUN, {
      start: 8,
      end: 0,
    }),
    frameRate: 7,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.ATTACK,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.ATTACK, {
      start: 8,
      end: 0,
    }),
    frameRate: 6.6,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.BOMB,
    frames: scene.anims.generateFrameNumbers(goblinAnimTypes.BOMB, {
      start: 19,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
}
export function createGoblinBomb(
  scene: Phaser.Scene,
  player: Player<Character>
) {
  return scene.physics.add
    .sprite(
      player.sprite.body.center.x,
      player.sprite.y - 200,
      goblinAnimTypes.BOMB
    )
    .setScale(2.5, 2.5)
    .setDepth(4)
    .setBodySize(25, 15, true);
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

export function createBar(framepercent: number, key: string) {
  const mainscene = PhaserGame.scene.keys.mainscene as MainScene;
  let idxandBar = key.split("-")[1]; // find id
  if (key.split("-")[0] === "spBar" && idxandBar !== "0") {
    idxandBar = "spBar-1"; // others-sp
  } else if (key.split("-")[0] === "spBar") {
    idxandBar = "spBar-0"; //mainplayer-sp
  } else {
    idxandBar = key.split("-")[0]; //hp same for everyone
  }
  mainscene.anims.remove(key);
  mainscene.anims.create({
    key: key,
    frames: mainscene.anims.generateFrameNumbers(idxandBar, {
      start: framepercent,
      end: framepercent,
    }),
    frameRate: 10,
    repeat: 0,
  });
}
