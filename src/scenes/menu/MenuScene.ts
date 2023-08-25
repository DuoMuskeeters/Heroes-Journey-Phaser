import Phaser from "phaser";
import { JackPlayer, shop } from "../main/Anims";
import MainScene from "../main/MainScene";
import { forestBackground, forestRoad, preloadAssets } from "../main/assets";
import PhaserGame from "../../PhaserGame";
import { Resize } from "../main/Resize";
import { Backroundmovement } from "../main/GameMovement";
import { Direction } from "../main/types";
import { Warrior, create_character, create_giant } from "../../game/Karakter";
const jack = Warrior.from_Character(create_character("Ali"));
const goblin_1sv = create_giant(10);
export default class MenuScene extends Phaser.Scene {
  logo = {} as Phaser.GameObjects.Image;
  brand = {} as Phaser.GameObjects.Text;
  gameTitle = {} as Phaser.GameObjects.Text;
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right,
    framewidth: 200,
    frameheight: 166,
    standbytime: 3000,
    ultimate: true,
    user: jack,
    healtbar: {} as Phaser.GameObjects.Graphics,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    frameWidth: 150,
    frameHeight: 145,
    lastdirection: Direction["left"],
    mob:goblin_1sv,
    
  };
  backgrounds: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];

  road?: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  bomb: { sprite: Phaser.GameObjects.Sprite } = {
    sprite: {} as Phaser.GameObjects.Sprite,
  };

  shopobject?: Phaser.GameObjects.Sprite;

  constructor() {
    super("menu");
  }

  preload() {
    this.load.on("progress", function (value: any) {
      console.log(value);
    });
    this.load.image("logo", "DuoMuskeeters.jpg");

    preloadAssets(this);
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

    forestBackground(this);
    forestRoad(this);
    JackPlayer(this);
    Resize(this);
    shop(this);

    this?.player.sprite.anims.play("fall-right", true);
    this.player.sprite.anims.stopAfterRepeat(2);
    this.shopobject?.anims.play("shop", true);

    window.addEventListener("resize", () => {
      this.Resize();
      Resize(this);
    });
    this.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (this.player.sprite.anims.getName() === "fall-right") {
        this.player.sprite.anims.play("ıdle-right", true);
      }
    });
    this.Resize();
    
  }

  update(time: number, delta: number): void {}

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
        this.scene.start("mainscene");
      }
    );
  }
}
