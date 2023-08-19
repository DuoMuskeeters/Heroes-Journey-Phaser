import Phaser from "phaser";
import { Character, Warrior, create_character, create_giant } from "../game/Karakter";

const jack = new Warrior(create_character("Ali"));
const goblin_1sv = create_giant(1);

export default class HelloWorldScene extends Phaser.Scene {
  private direction = {
    Right: "right",
    Left: "left",
    Dirvelocity: 1,
  };

  private shopobject?: Phaser.GameObjects.Sprite;
  private player: {
    sprite: Phaser.GameObjects.Sprite;
    lastdirection: string;
    framewidth: number;
    frameheight: number;
    standbytime: number;
    ultimate: boolean;
    hp: number;
    atk: number;
    canAttack: boolean;
  } = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: this.direction.Right,
    framewidth: 200,
    frameheight: 166,
    standbytime: 3000,
    ultimate: true,
    hp: jack.state.HP,
    atk: jack.state.ATK,
    canAttack: true,
  };
  private goblin: {
    sprite: Phaser.GameObjects.Sprite;
    frameWidth: number;
    frameHeight: number;
    lastdirection: string;
    direction: number;
    hp: number;
    atk: number;
  } = {
    sprite: {} as Phaser.GameObjects.Sprite,
    frameWidth: 150,
    frameHeight: 145,
    lastdirection: this.direction.Left,
    direction: 1,
    hp: goblin_1sv.state.HP,
    atk: goblin_1sv.state.ATK,
  };
  private bomb: { sprite: Phaser.GameObjects.Sprite } = {
    sprite: {} as Phaser.GameObjects.Sprite,
  };

  private backgrounds: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  private road?: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];

  constructor() {
    super("helloworld");
  }
  preload() {
    this.load.image("background1", "background/background_layer_1.png");
    this.load.image("background2", "background/background_layer_2.png");
    this.load.image("background3", "background/background_layer_3.png");
    this.load.image("shop", "shop_anim.png");
    this.load.image("piskel", "Road.png");

    this.load.spritesheet("ıdle-right", "Idle.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("ıdle-left", "Idle2.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("right", "run-right.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("left", "run-left.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("jump-right", "Jump.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("jump-left", "Jump2.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("attack1-right", "Attack1.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("attack1-left", "attack1left.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("fall-right", "Fall.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("fall-left", "Fall2.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("attack2-right", "Attack2.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("attack2-left", "attack2left.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("death-left", "death-left.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("death-right", "death-right.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });
    this.load.spritesheet("goblin-left", "goblin-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-right", "goblin-right.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-bomb-left", "goblin-bomb-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-run-left", "goblin-run-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-run-right", "goblin-run-right.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-attack-left", "goblin-attack-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-attack-right", "goblin-attack-right.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-takehit-left", "goblin-takehit-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });

    this.load.spritesheet("goblin-takehit-right", "goblin-takehit-right.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-death-left", "goblin-death-left.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });

    this.load.spritesheet("goblin-death-right", "goblin-death-right.png", {
      frameWidth: this.goblin?.frameWidth,
      frameHeight: this.goblin?.frameHeight,
    });
    this.load.spritesheet("goblin-attack-bomb", "goblin-attack-bomb.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("shopanim", "shop_anim.png", {
      frameWidth: 118,
      frameHeight: 128,
    });
  }

  create(isrectangle: boolean) {
    if (isrectangle === true) {
      this.Background();
      this.Road();
      this.Player();

      this.player.sprite.anims.play("fall-right", true);
      this.player.sprite.anims.stopAfterRepeat(1);
      this.cameras.main.startFollow(
        this.player.sprite,
        false,
        1,
        0,
        -1 * window.innerHeight * 0.4073,
        -1 * window.innerHeight * 0.5
      );
      this.Resize();
    }

    window.addEventListener("resize", () => {
      this.physics.world.gravity.y = window.innerHeight * 8.5365;
      this.physics.world.setBounds(
        0,
        0,
        window.innerWidth * 5,
        window.innerHeight
      );
      this.Resize();
    });
  }

  update(time: number, delta: number): void {
    this.movement();
  }

  movement() {
    const keySpace = this.input.keyboard?.addKey("SPACE");
    const keyW = this.input.keyboard?.addKey("W");
    const keyA = this.input.keyboard?.addKey("A");
    const keyD = this.input.keyboard?.addKey("D");
    const keyQ = this.input.keyboard?.addKey("Q");
    const keyB = this.input.keyboard?.addKey("B");

    const mouse = this.input.activePointer.leftButtonDown();
    if (keyA?.isDown) {
      this.player.lastdirection = this.direction.Left;
      this.direction.Dirvelocity = -1;
    }
    if (keyD?.isDown) {
      this.player.lastdirection = this.direction.Right;
      this.direction.Dirvelocity = +1;
    }
    if (this.player.sprite.body instanceof Phaser.Physics.Arcade.Body) {
      this.player.sprite.anims.chain(undefined!);
      this.player?.sprite.anims.chain([`fall-${this.player.lastdirection}`]);

      if (
        Math.floor(this.player.sprite.y) ===
        Math.floor(window.innerHeight * 0.72333333333333333333333)
      ) {
        
        if (keyW?.isDown) {
          this.player.sprite.anims.startAnimation(
            `jump-${this.player.lastdirection}`
          );
          this.player.sprite.anims.stopAfterRepeat(0);

          this.player.sprite.body.setVelocityY(
            -1 * window.innerHeight * 2.1951
          );
          if (keyD?.isDown || keyA?.isDown) {
            this.player.sprite.body.setVelocityX(
              this.direction.Dirvelocity * 650
            );
          } else {
            this.player.sprite.body.setVelocityX(0);
          }
        }
        if (
          (keyD?.isDown || keyA?.isDown) &&
          !keyW?.isDown &&
          this.player.sprite.anims.getName() !==
            `attack2-right` &&
          this.player.sprite.anims.getName() !==
            `attack2-left` &&
          this.player.sprite.anims.getName() !==
            `attack1-right` &&
          this.player.sprite.anims.getName() !== `attack1-left`
        ) {
          this.player?.sprite.anims.play(this.player.lastdirection, true);

          this.player?.sprite.body.setVelocityX(
            this.direction.Dirvelocity * 650
          );
        }
        if (
          keyQ?.isDown &&
          !keyD?.isDown &&
          !keyA?.isDown &&
          this.player.sprite.anims.getName() !==
            `attack1-${this.player.lastdirection}` &&
          this.player.ultimate
        ) {
          this.player.sprite.anims.play(
            `attack2-${this.player.lastdirection}`,
            true
          );
          this.player.sprite.anims.stopAfterRepeat(0);
          this.player?.sprite.body.setVelocityX(0);
          this.player.ultimate = false;
          setTimeout(() => {
            this.player.ultimate = true;
          }, this.player.standbytime);
        }
        if (
          (mouse || keySpace?.isDown) &&
          this.player.sprite.anims.getName() !==
            `attack2-${this.player.lastdirection}`
        ) {
          this.player?.sprite.anims.play(
            `attack1-${this.player.lastdirection}`,
            true
          );
          this.player.sprite.anims.stopAfterRepeat(0);
          this.player.sprite.body.setVelocityX(0);
        }
        if (keyB?.isDown) {
          if (!this.goblin?.sprite.active) {
            this.Mob();
            this.goblin?.sprite.anims.play("goblin-left", true);
          }
        } else if (
          this.player.sprite.anims.getName() ===
            `fall-${this.player.lastdirection}` ||
          (!keyD?.isDown &&
            !keyW?.isDown &&
            !keyA?.isDown &&
            !keyB?.isDown &&
            this.player.sprite.anims.getName() !==
              `attack2-${this.player.lastdirection}` &&
            this.player.sprite.anims.getName() !==
              `attack1-${this.player.lastdirection}` &&
            this.player.sprite.anims.getName() !==
              `attack2-${this.player.lastdirection}` &&
            this.player.sprite.anims.getName() !==
              `death-${this.player.lastdirection}`)
        ) {
          this.player.sprite.body.setVelocityX(0);
          this.player.sprite.anims.play(
            `ıdle-${this.player.lastdirection}`,
            true
          );
        }
      }
      if (this.backgrounds !== undefined) {
        {
          for (let i = 0; i < this.backgrounds?.length; i++) {
            const bg = this.backgrounds[i];
            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.rationx;
          }
        }
      }
      if (this.road !== undefined) {
        this.road[0].sprite.tilePositionX =
          this.cameras.main.scrollX * this.road[0].rationx;
      }

      if (this.goblin?.sprite.body instanceof Phaser.Physics.Arcade.Body) {
        const distanceofgoblin = this.goblin.sprite.x - this.player.sprite.x;
        if (distanceofgoblin > 0) {
          this.goblin.lastdirection = this.direction.Left;
          this.goblin.direction = -1;
        } else {
          this.goblin.lastdirection = this.direction.Right;
          this.goblin.direction = 1;
        }
        if (
          this.player.sprite.anims.getName() ===
            `attack2-${this.player.lastdirection}` &&
          Math.abs(distanceofgoblin) <= 400 &&
          this.player.lastdirection !== this.goblin.lastdirection &&
          !keyW?.isDown
        ) {
          this.goblin.sprite.anims.play(
            `goblin-takehit-${this.goblin.lastdirection}`,
            true
          );
          this.goblin.sprite.anims.stopAfterRepeat(0);
        } else if (
          this.goblin?.sprite.active &&
          Math.abs(distanceofgoblin) <= 400 &&
          Math.abs(distanceofgoblin) >= 145 &&
          this.goblin.sprite.anims.getName() !==
            `goblin-takehit-${this.goblin.lastdirection}`
        ) {
          this.goblin.sprite.anims.play(
            `goblin-run-${this.goblin.lastdirection}`,
            true
          );
         
          this.goblin.sprite.body.setVelocityX(this.goblin.direction * 500);
        } else if (
          Math.abs(distanceofgoblin) <145 &&
          this.goblin.sprite.anims.getName() !==
            `goblin-takehit-${this.goblin.lastdirection}` &&
          this.player.sprite.anims.getName() !==
            `death-${this.player.lastdirection}`&&this.player.sprite.anims.getName() !==
            `${this.player.lastdirection}`
        ) {
          this.goblin.sprite.anims.play(
            `goblin-attack-${this.goblin.lastdirection}`,
            true
          );

          this.goblin.sprite.anims.stopAfterRepeat(0);
          this.goblin.sprite.body.setVelocityX(0);
        } else if (
          this.player.sprite.anims.getName() ===
            `death-${this.player.lastdirection}` ||
          (this.goblin.sprite.anims.getName() !==
            `goblin-death-${this.goblin.lastdirection}` )
        ) {
          this.goblin.sprite.body.setVelocityX(0);
          this.goblin.sprite.anims.play(
            `goblin-${this.goblin.lastdirection}`,
            true
          );
        }
  
      }
    }
  }

  Background() {
    this.backgrounds?.push({
      rationx: 0.05,
      sprite: this.add
        .tileSprite(0, 0, 0, 0, "background1")
        .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
        .setOrigin(0, 0)
        .setDepth(-3)
        .setScrollFactor(0),
    });

    this.backgrounds?.push({
      rationx: 0.1,
      sprite: this.add
        .tileSprite(0, 0, 0, 0, "background2")
        .setOrigin(0, 0)
        .setDepth(-2)

        .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
        .setScrollFactor(0),
    });

    this.backgrounds?.push({
      rationx: 0.15,
      sprite: this.add
        .tileSprite(0, 0, 0, 0, "background3")
        .setOrigin(0, 0)
        .setDepth(-1)
        .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
        .setScrollFactor(0),
    });
  }
  Road() {
    this.road?.push({
      rationx: 0.3,
      sprite: this.add
        .tileSprite(0, window.innerHeight * 0.628, 0, 0, "piskel")
        .setOrigin(0)
        .setScale(window.innerHeight * 0.0039)
        .setScrollFactor(0),
    });
  }
  shop() {
    this.shopobject = this.add
      .sprite(window.innerWidth * 0.82, window.innerHeight * 0.63, "shopanim")
      .setScale(window.innerHeight / 290);

    this.anims.create({
      key: "shop",
      frames: this.anims.generateFrameNumbers("shopanim", {
        start: 0,
        end: 6,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }
  Player() {
    this.player.sprite = this.physics.add
      .sprite(100, 0, "right")
      .setCollideWorldBounds(true)
      .setScale(window.innerHeight / 300)
      .setBounce(0.2)
      .setDepth(4);

    this.anims.create({
      key: "ıdle-right",
      frames: this.anims.generateFrameNumbers("ıdle-right", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "ıdle-left",
      frames: this.anims.generateFrameNumbers("ıdle-left", {
        start: 8,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("left", {
        start: 8,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("right", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump-right",
      frames: this.anims.generateFrameNumbers("jump-right", {
        start: 0,
        end: 2,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "jump-left",
      frames: this.anims.generateFrameNumbers("jump-left", {
        start: 2,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "attack1-right",
      frames: this.anims.generateFrameNumbers("attack1-right", {
        start: 0,
        end: 6,
      }),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: "attack1-left",
      frames: this.anims.generateFrameNumbers("attack1-left", {
        start: 6,
        end: 0,
      }),
      frameRate: 14,
      repeat: -1,
    });
    this.anims.create({
      key: "fall-right",
      frames: this.anims.generateFrameNumbers("fall-right", {
        start: 0,
        end: 2,
      }),
      frameRate: 17,
      repeat: -1,
    });
    this.anims.create({
      key: "fall-left",
      frames: this.anims.generateFrameNumbers("fall-left", {
        start: 2,
        end: 0,
      }),
      frameRate: 17,
      repeat: -1,
    });
    this.anims.create({
      key: "attack2-right",
      frames: this.anims.generateFrameNumbers("attack2-right", {
        start: 0,
        end: 6,
      }),
      frameRate: 17,
      repeat: -1,
    });
    this.anims.create({
      key: "attack2-left",
      frames: this.anims.generateFrameNumbers("attack2-left", {
        start: 6,
        end: 0,
      }),
      frameRate: 17,
      repeat: -1,
    });
    this.anims.create({
      key: "death-left",
      frames: this.anims.generateFrameNumbers("death-left", {
        start: 6,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "death-right",
      frames: this.anims.generateFrameNumbers("death-right", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

     this.player.sprite.on("animationstop", () => {
       if (
         (this.player.sprite.anims.getName() ===
           "attack1-right" ||
           this.player.sprite.anims.getName() ===
             "attack1-left") &&
         this.goblin.hp >= 0 && Math.abs(this.goblin.sprite.x - this.player.sprite.x)<=250
       ) {
         this.goblin.hp -= this.player.atk;
         console.log("goblin", Math.max(0,this.goblin.hp));
       }
       else if (
         (this.player.sprite.anims.getName() ===
          "attack2-right" ||
          this.player.sprite.anims.getName() ===
          "attack2-left") &&
          this.goblin.hp >= 0
          ) {
            console.log(`sp${jack.state.SP}`)
            const damage= jack.heavy_strike() 
            this.goblin.hp -= damage;
            console.log("goblin", Math.max(0,this.goblin.hp));
          }
      });

  }
  Mob() {
    if (this.goblin?.sprite !== undefined)
      this.goblin.sprite = this.physics.add
        .sprite(
          window.innerWidth * 0.82,
          window.innerHeight * 0.63,
          "goblin-left"
        )
        .setScale(window.innerHeight / 300)
        .setDepth(4)
        .setCollideWorldBounds(true)
        .setBounce(0.2);

    this.anims.create({
      key: "goblin-bomb",
      frames: this.anims.generateFrameNumbers("goblin-bomb", {
        start: 12,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-left",
      frames: this.anims.generateFrameNumbers("goblin-left", {
        start: 4,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-right",
      frames: this.anims.generateFrameNumbers("goblin-right", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-takehit-left",
      frames: this.anims.generateFrameNumbers("goblin-takehit-left", {
        start: 4,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-takehit-right",
      frames: this.anims.generateFrameNumbers("goblin-takehit-right", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-death-left",
      frames: this.anims.generateFrameNumbers("goblin-death-left", {
        start: 4,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-death-right",
      frames: this.anims.generateFrameNumbers("goblin-death-right", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-run-left",
      frames: this.anims.generateFrameNumbers("goblin-run-left", {
        start: 8,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-run-right",
      frames: this.anims.generateFrameNumbers("goblin-run-right", {
        start: 0,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-attack-left",
      frames: this.anims.generateFrameNumbers("goblin-attack-left", {
        start: 8,
        end: 0,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "goblin-attack-right",
      frames: this.anims.generateFrameNumbers("goblin-attack-right", {
        start: 0,
        end: 8,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.goblin.sprite.on("animationstop", () => {
      if (
        (this.goblin.sprite.anims.currentFrame.textureKey ===
          "goblin-attack-right" ||
          this.goblin.sprite.anims.currentFrame.textureKey ===
            "goblin-attack-left") &&
        this.player.hp >= 0
      ) {
        this.player.hp -= this.goblin.atk;
        console.log("player", Math.max(0, this.player.hp));
      }
    });


    this.bomb.sprite = this.physics.add
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
    this.anims.create({
      key: "goblin-attack-bomb",
      frames: this.anims.generateFrameNumbers("goblin-attack-bomb", {
        start: 19,
        end: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // TODO : doesn?t change scale when change screenwidth
  Resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // this.background1 = this.background1
    //   ?.setOrigin(0)
    //   .setDisplaySize(screenWidth, screenHeight * 0.849);
    // this.background2 = this.background2
    //   ?.setOrigin(0)
    //   .setDisplaySize(screenWidth, screenHeight * 0.849);
    // this.background3 = this.background3
    //   ?.setOrigin(0)
    //   .setDisplaySize(screenWidth, screenHeight * 0.849);

    // this.shopobject = this.shopobject
    //   ?.setScale(screenHeight / 290)
    //   .setPosition(screenWidth * 0.82, screenHeight * 0.63);

    this.player.sprite = this.player?.sprite.setScale(window.innerHeight / 300);

    for (let i = 0; i < 3; i++) {
      this.backgrounds[i].sprite.setDisplaySize(
        window.innerWidth,
        window.innerHeight * 0.849
      );
    }
    if (this.road !== undefined) {
      this.road[0].sprite = this.road[0].sprite
        .setOrigin(0)
        .setScale(window.innerWidth * 0.001388, window.innerHeight * 0.00353658)
        .setPosition(0, window.innerHeight * 0.6560975);
    }
    this.physics.world.setBounds(
      0,
      0,
      window.innerWidth * 5,
      window.innerHeight
    );
  }
}
