import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  logo = {} as Phaser.GameObjects.Image;
  brand = {} as Phaser.GameObjects.Text;
  gameTitle = {} as Phaser.GameObjects.Text;
  backgrounds = [
    { rationx: 0.05, sprite: {} as Phaser.GameObjects.TileSprite },
    { rationx: 0.1, sprite: {} as Phaser.GameObjects.TileSprite },
    { rationx: 0.15, sprite: {} as Phaser.GameObjects.TileSprite },
  ];
  road = {
    rationx: 0.3,
    sprite: {} as Phaser.GameObjects.TileSprite,
  };
  shopobject = {} as Phaser.GameObjects.Sprite;
  player = {
    sprite: {} as Phaser.Physics.Arcade.Sprite,
    lastdirection: "right",
    framewidth: 200,
    frameheight: 166,
    standbytime: 3000,
  };
  constructor() {
    super("menu");
  }
  preload() {
    this.load.on("progress", function (value: any) {
      console.log(value);
    });
    this.load.image("logo", "DuoMuskeeters.jpg");
    this.load.image("background1", "background/background_layer_1.png");
    this.load.image("background2", "background/background_layer_2.png");
    this.load.image("background3", "background/background_layer_3.png");
    this.load.image("shop", "shop_anim.png");
    this.load.image("piskel", "Road.png");

    this.load.spritesheet("ıdle-right", "Idle.png", {
      frameWidth: this.player.framewidth,
      frameHeight: this.player.frameheight,
    });

    this.load.spritesheet("shopanim", "shop_anim.png", {
      frameWidth: 118,
      frameHeight: 128,
    });
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.postFX.addBloom(
      undefined,
      undefined,
      undefined,
      undefined,
      0.1
    );

    this.input.keyboard?.on("keydown-SPACE", () => this.handleStartGame());
    this.logo = this.add.image(0, 0, "logo");
    this.brand = this.add
      .text(0, 0, "Created By\nDuoMuskeeters")
      .setStyle({
        // fontSize: "48px",
        fontSize: "65px Arial",
        color: "green",
        align: "center",
      })
      .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
      .setFontStyle("bold");

    this.gameTitle = this.add
      .text(0, 0, "Hero's Journey (Press Space to Start)")
      .setStyle({
        fontSize: "48px",
        color: "black",
      })
      .setFontFamily("Times, serif")
      .setFontStyle("italic");

    this.logo.setOrigin(1, 1).setDepth(100);
    this.brand.setDepth(100);
    this.gameTitle.setDepth(100);

    this.anims.create({
      key: "ıdle-right",
      frames: this.anims.generateFrameNumbers("ıdle-right", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
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
      key: "shop",
      frames: this.anims.generateFrameNumbers("shopanim", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].sprite = this.add
        .tileSprite(0, 0, 0, 0, "background1")
        .setDisplaySize(window.innerWidth, window.innerHeight * 0.849)
        .setOrigin(0, 0)
        .setDepth(i - 3)
        .setScrollFactor(0);
    }

    this.road.sprite = this.add
      .tileSprite(0, window.innerHeight * 0.628, 0, 0, "piskel")
      .setOrigin(0)
      .setScale(window.innerHeight * 0.0039)
      .setScrollFactor(0);

    this.shopobject = this.add
      .sprite(window.innerWidth * 0.82, window.innerHeight * 0.63, "shopanim")
      .setScale(window.innerHeight / 290);

    this.player.sprite = this.physics.add
      .sprite(100, 0, "ıdle-right")
      .setCollideWorldBounds(true)
      .setScale(window.innerHeight / 300)
      .setBounce(0.2)
      .setDepth(4);

    this.player.sprite.anims.play("ıdle-right", true);

    window.addEventListener("resize", this.Resize);
    this.Resize();
  }

  update(time: number, delta: number): void {
    this.movement();
  }

  movement() {
    this.player.sprite.anims.chain(undefined!);
    this.player?.sprite.anims.chain([`fall-${this.player.lastdirection}`]);

    for (let i = 0; i < this.backgrounds.length; i++) {
      const bg = this.backgrounds[i];
      bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.rationx;
    }
    this.road.sprite.tilePositionX =
      this.cameras.main.scrollX * this.road.rationx;
  }

  // TODO : doesn?t change scale when change screenwidth
  Resize() {
    const logoLeft = (window.innerWidth - this.logo.width) / 2;
    const logoTop = (window.innerHeight - this.logo.height) / 2;
    const brandLeft = window.innerWidth / 2;
    const brandTop = window.innerHeight / 4;
    const textLeft = window.innerWidth / 6;
    const textTop = window.innerHeight / 2;

    this.logo.setScale(window.innerHeight / 900).setPosition(logoLeft, logoTop);
    this.brand.setPosition(brandLeft, brandTop);
    this.gameTitle.setPosition(textLeft, textTop);
    this.player?.sprite.setScale(window.innerHeight / 300);

    for (let i = 0; i < 3; i++) {
      this.backgrounds[i].sprite.setDisplaySize(
        window.innerWidth,
        window.innerHeight * 0.849
      );
    }
    this.road.sprite = this.road.sprite
      .setOrigin(0)
      .setScale(window.innerWidth * 0.001388, window.innerHeight * 0.00353658)
      .setPosition(0, window.innerHeight * 0.6560975);
    this.physics.world.gravity.y = window.innerHeight * 8.5365;
    this.physics.world.setBounds(0, 0, Infinity, window.innerHeight);
  }
  handleStartGame() {
    window.removeEventListener("resize", this.Resize);
    this.cameras.main.postFX.addBlur(0, 0, 0.1);
    this.cameras.main.shake(1000, 0.002);
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        console.log("Starting game");
        this.scene.start("helloworld");
      }
    );
  }
}
