import { Warrior, create_character, mob_exp_kazancı } from "../../game/Karakter";
import MenuScene from "../menu/MenuScene";
import { goblinHealtbar, healtbar } from "./Components";
import MainScene from "./MainScene";
import { Direction } from "./types";

const jack = Warrior.from_Character(create_character("Ali"));

export function JackPlayer(scene: MainScene | MenuScene) {
  scene.player.sprite = scene.physics.add
    .sprite(100, 0, "right")
    .setCollideWorldBounds(true)
    .setScale(window.innerHeight / 300)
    .setBounce(0.2)
    .setDepth(4);
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
  scene.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
    if (
      scene.player.sprite.anims.getName() ===
        `attack1-${scene.player.lastdirection}` &&
      scene.goblin.mob.state.HP >= 0 &&
      Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250
    ) {
      scene.goblin.mob.state.HP -=
        (1 - scene.goblin.mob.state.Armor) * scene.player.user.state.ATK;
    } else if (
      scene.player.sprite.anims.getName() === "attack2-right" ||
      scene.player.sprite.anims.getName() === "attack2-left"
    ) {
      const damage = scene.player.user.heavy_strike();
      if (
        scene.goblin.mob.state.HP >= 0 &&
        Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250
      ) {
        scene.goblin.mob.state.HP -=
          (1 - scene.goblin.mob.state.Armor) * damage;
      }
    }
    if (scene.goblin.mob.state.HP <= 0) {
      scene.goblin.sprite.play(
        `goblin-death-${scene.goblin.lastdirection}`,
        true
      );
      scene.goblin.sprite.stopAfterRepeat(0);
    }
    if (
      scene.player.sprite.anims.getName() ===
      `death-${scene.player.lastdirection}`
    ) {
      scene.player.sprite.anims.destroy();
    }
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
    key: "goblin-bomb",
    frames: scene.anims.generateFrameNumbers("goblin-bomb", {
      start: 12,
      end: 0,
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

  scene.goblin.sprite.on("animationstop", () => {
    let goblinframe = 0;
    if (scene.goblin.lastdirection == Direction.left) {
      goblinframe = 0;
    } else if (scene.goblin.lastdirection == Direction["right"]) {
      goblinframe = 7;
    }
    if (
      scene.goblin.sprite.anims.getName() ===
        `goblin-attack-${scene.goblin.lastdirection}` &&
      scene.player.user.state.HP >= 0 &&
      Math.abs(scene.goblin.sprite.x - scene.player.sprite.x) <= 250 &&
      Number(scene.goblin.sprite.anims.getFrameName()) == goblinframe
    ) {
      scene.player.user.state.HP -=
        (1 - scene.player.user.state.Armor) * scene.goblin.mob.state.ATK;

      if (scene.player.user.state.HP <= 0) {
        scene.player.sprite.anims.play(
          `death-${scene.player.lastdirection}`,
          true
        );
        scene.player.sprite.anims.stopAfterRepeat(0);
      }
    }
    if (
      scene.goblin.sprite.anims.getName() ===
      `goblin-death-${scene.goblin.lastdirection}`
    ) {
      scene.goblin.sprite.setVisible(false).setActive(false);
      scene.goblin.healtbar.setVisible(false);
      scene.goblin.hptitle.setVisible(false);
      scene.player.user.exp += mob_exp_kazancı(scene.goblin.mob.state.Level)
      scene.player.user.level_up()
    }
  });

  scene.bomb.sprite = scene.physics.add
    .sprite(
      window.innerWidth * 0.82,
      window.innerHeight * 0.63,
      "goblin-attack-bomb"
    )
    .setScale(window.innerHeight / 300)
    .setDepth(4)
    .setCollideWorldBounds(true)
    .setBounce(0.2)
    .setVisible(false);
  scene.anims.create({
    key: "goblin-attack-bomb",
    frames: scene.anims.generateFrameNumbers("goblin-attack-bomb", {
      start: 19,
      end: 0,
    }),
    frameRate: 10,
    repeat: -1,
  });
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
