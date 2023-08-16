import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  private shopobject?: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Sprite = {} as Phaser.GameObjects.Sprite;
  private goblin?: { sprite: Phaser.GameObjects.Sprite, hp: number } = {
  sprite: {} as Phaser.GameObjects.Sprite,
  hp: 300
};
  private bomb: Phaser.GameObjects.Sprite = {} as Phaser.GameObjects.Sprite;

  private direction = {
    Right: "right",
    Left: "left",
    Dirvelocity: 1,
  };
  private sprisheeets = {
    framewidth: 200,
    frameheight: 166,
  };
  backgrounds: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  road?: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  private lastdirection = this.direction.Right; //

  constructor() {
    super("helloworld");
  }
  preload() {
    this.load.image("background1", "background/background_layer_1.png");
    this.load.image("background2", "background/background_layer_2.png");
    this.load.image("background3", "background/background_layer_3.png");
    this.load.image("shop", "shop_anim.png");

    this.load.image("piskel", "Merged_document-13.png");
    this.load.spritesheet("ıdle-right", "Idle.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("ıdle-left", "Idle2.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("right", "Run.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("left", "Run2.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("jump-right", "Jump.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("jump-left", "Jump2.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("shopanim", "shop_anim.png", {
      frameWidth: 118,
      frameHeight: 128,
    });
    this.load.spritesheet("attack1-right", "Attack1.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("attack1-left", "attack1left.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("fall-right", "Fall.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("fall-left", "Fall2.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("attack2-right", "Attack2.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("attack2-left", "attack2left.png", {
      frameWidth: this.sprisheeets.framewidth,
      frameHeight: this.sprisheeets.frameheight,
    });
    this.load.spritesheet("goblin-left", "goblin-left.png", {
      frameWidth: 150,
      frameHeight: 145,
    });
    this.load.spritesheet("goblin-right", "goblin-right.png", {
      frameWidth: 150,
      frameHeight: 145,
    });
    this.load.spritesheet("goblin-bomb", "goblin-bomb.png", {
      frameWidth: 150,
      frameHeight: 145,
    });
    this.load.spritesheet("goblin-attack-bomb", "goblin-attack-bomb.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
  }

  create(isrectangle: boolean) {
    if (isrectangle === true) {
      this.Background();
      this.Road();
      this.Player();

      this.player.anims.play("fall-right", true);
      this.player.anims.stopAfterRepeat(1);
      this.cameras.main.startFollow(
        this.player,
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
    const keySpace = this.input.keyboard.addKey("SPACE");
    const keyW = this.input.keyboard.addKey("W");
    const keyA = this.input.keyboard.addKey("A");
    const keyD = this.input.keyboard.addKey("D");
    const keyQ = this.input.keyboard.addKey("Q");
    const keyB = this.input.keyboard.addKey("B");

    const mouse = this.input.activePointer.leftButtonDown();
    if (keyA.isDown) {
      this.lastdirection = this.direction.Left;
      this.direction.Dirvelocity = -1;
    }
    if (keyD.isDown) {
      this.lastdirection = this.direction.Right;
      this.direction.Dirvelocity = +1;
    }
    if (this.player.body instanceof Phaser.Physics.Arcade.Body) {
      this.player.anims.chain(undefined!);
      this.player?.anims.chain([`fall-${this.lastdirection}`]);

      if (
        Math.floor(this.player.y) ===
        Math.floor(window.innerHeight * 0.72333333333333333333333)
      ) {
        if (keyW.isDown) {
          this.player.anims.startAnimation(`jump-${this.lastdirection}`);
          this.player.anims.stopAfterRepeat(0);

          this.player.body.setVelocityY(-1 * window.innerHeight * 2.1951);
          if (keyD.isDown || keyA.isDown) {
            this.player.body.setVelocityX(this.direction.Dirvelocity * 650);
          } else {
            this.player.body.setVelocityX(0);
          }
        }
        if (
          (keyD.isDown || keyA.isDown) &&
          !keyW.isDown &&
          this.player.anims.currentFrame.textureKey !==
            `attack2-${this.lastdirection}` &&
          this.player.anims.currentFrame.textureKey !==
            `attack1-${this.lastdirection}`
        ) {
          this.player?.anims.play(this.lastdirection, true);

          this.player?.body.setVelocityX(this.direction.Dirvelocity * 650);
        }
        if (
          keyQ.isDown &&
          this.player.anims.currentFrame.textureKey !==
            `attack1-${this.lastdirection}`
        ) {
          this.player.anims.play(`attack2-${this.lastdirection}`, true);
          this.player.anims.stopAfterRepeat(0);
          this.player?.body.setVelocityX(this.direction.Dirvelocity * 650);
        }
        if (
          (mouse || keySpace.isDown) &&
          this.player.anims.currentFrame.textureKey !==
            `attack2-${this.lastdirection}`
        ) {
          this.player?.anims.play(`attack1-${this.lastdirection}`, true);
          this.player.anims.stopAfterRepeat(0);
          this.player.body.setVelocityX(0);
        }
        if (keyB.isDown) {
          this.Goblin();
        }
        if (this.goblin?.sprite.x == this.player.x) {
          console.log(1);
        } else if (
          this.player.anims.currentFrame.textureKey ===
            `fall-${this.lastdirection}` ||
          (!keyD.isDown &&
            !keyW.isDown &&
            !keyA.isDown &&
            !keyB.isDown &&
            this.player.anims.currentFrame.textureKey !==
              `attack2-${this.lastdirection}` &&
            this.player.anims.currentFrame.textureKey !==
              `attack1-${this.lastdirection}` &&
            this.player.anims.currentFrame.textureKey !==
              `attack2-${this.lastdirection}`)
        ) {
          this.player.body.setVelocityX(0);
          this.player.anims.play(`ıdle-${this.lastdirection}`, true);
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
      if (
        this.goblin?.sprite.active &&
        Math.abs(this.goblin.sprite.x - this.player.x) <= 250 &&
        this.player.anims.currentFrame.textureKey ==
          `attack1-${this.lastdirection}` &&
        this.player.anims.currentFrame.textureFrame == "5"
      ) {
        console.log(1);
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
    this.player = this.physics.add
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
  }
  Mob() {
    if(this.goblin?.sprite!==undefined)
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

    this.bomb = this.physics.add
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
  Goblin() {
    if (!this.goblin?.sprite.active) {
      this.Mob();
    }
    this.goblin?.sprite.anims.startAnimation("goblin-left");
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

    this.player = this.player?.setScale(window.innerHeight / 300);

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
