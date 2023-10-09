import { type Character } from "../../../game/Karakter";
import { type MobType } from "../../../game/mobStats";
import { type PlayerType } from "../../../game/playerStats";
import { goblinAnimTypes, mcAnimTypes } from "../../../game/types/types";
import { type Player } from "../../../objects/player";
import type MenuScene from "../menu/MenuScene";
import type MainScene from "./MainScene";
export function loadAnimations(scene: MainScene | MenuScene) {
  createPlayeranims(scene);
  createGoblinAnims(scene);
}

export const IROH_ATTACK1_FRAME_COUNT = 4;
export const FIRE_IROH_ATTACK1_FRAME_COUNT = IROH_ATTACK1_FRAME_COUNT;
export const JACK_ATTACK1_FRAME_COUNT = 6;

const players = [
  {
    type: "iroh" as const,
    ıdle: { start: 0, end: 7 },
    run: { start: 16, end: 23 },
    jump: { start: 96, end: 98 },
    fall: { start: 128, end: 130 },
    death: { start: 384, end: 395 },
    takehit: { start: 368, end: 372 },
    attack1: { start: 160, end: 163 }, // IROH_ATTACK1_FRAME_COUNT
    attack1_combo2: { start: 176, end: 179 },
    attack1_combo3: { start: 192, end: 195 },
    attack2: { start: 304, end: 319 },
    trasform: { start: 320, end: 331 },
  },
  {
    type: "fireiroh" as const,
    ıdle: { start: 0, end: 7 },
    run: { start: 16, end: 23 },
    jump: { start: 96, end: 98 },
    fall: { start: 128, end: 130 },
    death: { start: 384, end: 395 },
    takehit: { start: 368, end: 372 },
    attack1: { start: 160, end: 163 }, // FIRE_IROH_ATTACK1_FRAME_COUNT
    attack1_combo2: { start: 176, end: 179 },
    attack1_combo3: { start: 192, end: 195 },
    attack2: { start: 304, end: 319 },
    trasform: { start: 320, end: 327 }, // fireiroh has different transform anim
  },
  {
    type: "jack" as const,
    ıdle: { start: 32, end: 38 },
    run: { start: 48, end: 55 },
    jump: { start: 40, end: 41 },
    fall: { start: 24, end: 25 },
    attack1: { start: 0, end: 5 }, // JACK_ATTACK1_FRAME_COUNT
    attack2: { start: 8, end: 13 },
    death: { start: 16, end: 21 },
    takehit: { start: 56, end: 59 },
  } as const,
] satisfies (Record<string, unknown> & { type: PlayerType | "fireiroh" })[];

export function createPlayeranims(scene: MainScene | MenuScene) {
  for (const mc of players) {
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.IDLE,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.ıdle.start,
        end: mc.ıdle.end,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.RUN,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.run.start,
        end: mc.run.end,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.JUMP,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.jump.start,
        end: mc.jump.end,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.ATTACK_2,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.attack2.start,
        end: mc.attack2.end,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.ATTACK_1,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.attack1.start,
        end: mc.attack1.end,
      }),
      frameRate: 10,
      repeat: -1,
    });

    if (mc.type === "iroh" || mc.type === "fireiroh") {
      scene.anims.create({
        key: mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO2,
        frames: scene.anims.generateFrameNumbers(mc.type, {
          start: mc.attack1_combo2.start,
          end: mc.attack1_combo2.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
      scene.anims.create({
        key: mc.type + "-" + mcAnimTypes.ATTACK_1_COMBO3,
        frames: scene.anims.generateFrameNumbers(mc.type, {
          start: mc.attack1_combo3.start,
          end: mc.attack1_combo3.end,
        }),
        frameRate: 10,
        repeat: -1,
      });

      scene.anims.create({
        key: mc.type + "-" + mcAnimTypes.TRANSFORM,
        frames: scene.anims.generateFrameNumbers(mc.type, {
          start: mc.trasform.start,
          end: mc.trasform.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.FALL,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.fall.start,
        end: mc.fall.end,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.DEATH,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.death.start,
        end: mc.death.end,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: mc.type + "-" + mcAnimTypes.TAKE_HIT,
      frames: scene.anims.generateFrameNumbers(mc.type, {
        start: mc.takehit.start,
        end: mc.takehit.end,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }
}
export function createGoblinAnims(scene: Phaser.Scene) {
  const goblin = {
    type: "goblin" as const satisfies MobType,
    ıdle: { start: 3, end: 0 },
    run: { start: 19, end: 12 },
    attack1: { start: 31, end: 24 },
    attack2: { start: 47, end: 36 },
    death: { start: 63, end: 60 },
    takehit: { start: 51, end: 48 },
  } as const;
  scene.anims.create({
    key: goblinAnimTypes.ULTI,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.attack2.start,
      end: goblin.attack2.end,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.IDLE,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.ıdle.start,
      end: goblin.ıdle.end,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.TAKE_HIT,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.takehit.start,
      end: goblin.takehit.end,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.DEATH,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.death.start,
      end: goblin.death.end,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.RUN,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.run.start,
      end: goblin.run.end,
    }),
    frameRate: 7,
    repeat: -1,
  });

  scene.anims.create({
    key: goblinAnimTypes.ATTACK,
    frames: scene.anims.generateFrameNumbers("goblin", {
      start: goblin.attack1.start,
      end: goblin.attack1.end,
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
