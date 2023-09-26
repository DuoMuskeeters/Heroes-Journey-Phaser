import { Character } from "../../game/Karakter";
import { goblinAnimTypes, mcAnimTypes } from "../../game/types/types";
import { Player } from "../../objects/player";
import MenuScene from "../menu/MenuScene";
import MainScene from "./MainScene";
export function loadAnimations(scene: MainScene | MenuScene) {
  createPlayeranims(scene);
  createGoblinAnims(scene);
}

export function createPlayeranims(scene: MainScene | MenuScene) {
  const players = [
    {
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
    } as const,
    {
      type: "jack" as const,
      ıdle: 7,
      run: 7,
      jump: 2,
      fall: 3,
      attack1: 6,
      attack2: 6,
      death: 6,
      takehit: 4,
    } as const,
  ];

  players.forEach((mc) => {
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.IDLE,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.IDLE,
        {
          start: 0,
          end: mc.ıdle,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.RUN,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.RUN,
        {
          start: 0,
          end: mc.run,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.JUMP,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.JUMP,
        {
          start: 0,
          end: mc.jump,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.ATTACK_2,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.ATTACK_2,
        {
          start: 0,
          end: mc.attack2,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.ATTACK_1,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.ATTACK_1,
        {
          start: 0,
          end: mc.attack1,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });

    if (mc.type === "iroh") {
      scene.anims.create({
        key: mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO2,
        frames: scene.anims.generateFrameNumbers(
          mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO2,
          {
            start: 0,
            end: mc.attack1_combo2,
          }
        ),
        frameRate: 10,
        repeat: 0,
      });
      scene.anims.create({
        key: mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO3,
        frames: scene.anims.generateFrameNumbers(
          mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO3,
          {
            start: 0,
            end: mc.attack1_combo3,
          }
        ),
        frameRate: 10,
        repeat: 0,
      });
    }
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.FALL,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.FALL,
        {
          start: 0,
          end: mc.fall,
        }
      ),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.DEATH,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.DEATH,
        {
          start: 0,
          end: mc.death,
        }
      ),
      frameRate: 10,
      repeat: 1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.TAKE_HIT,
      frames: scene.anims.generateFrameNumbers(
        mc.type + "-" + mcAnimTypes.TAKE_HIT,
        {
          start: 0,
          end: mc.takehit,
        }
      ),
      frameRate: 4,
      repeat: -1,
    });
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

export function createBar(
  scene: MainScene,
  framepercent: number,
  bar: "hpBar" | "spBar",
  index: number
) {
  const keyAnim = `${bar}-${index}` as const;

  if (bar === "spBar" && index > 1) index = 1;

  const keySpriteSheet =
    bar === "spBar" ? (`${bar}-${index as 0 | 1}` as const) : bar;
  // bu kadar saçmalığa gerek yoktu ama mouse üstüne götürünce çok havalı

  scene.anims.remove(keyAnim);
  scene.anims.create({
    key: keyAnim,
    frames: scene.anims.generateFrameNumbers(keySpriteSheet, {
      start: framepercent,
      end: framepercent,
    }),
    frameRate: 10,
    repeat: 0,
  });
}
