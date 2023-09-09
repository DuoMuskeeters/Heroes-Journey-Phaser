import Phaser from "phaser";
import { JackPlayer, shop } from "../main/Anims";
import { forestBackground, forestRoad } from "../preLoad/assets";
import { Resize } from "../main/Resize";
import { Backroundmovement } from "../main/GameMovement";
import { Direction } from "../../game/types/types";

export default class MenuScene extends Phaser.Scene {
  logo = {} as Phaser.GameObjects.Image;
  brand = {} as Phaser.GameObjects.Text;
  gameTitle = {} as Phaser.GameObjects.Text;
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction["left"],
  };

  backgrounds!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[];
  road!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  };
  shopobject?: Phaser.GameObjects.Sprite;

  constructor() {
    super("menu");
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

    this.logo.setOrigin(1, 1).setDepth(100).setScrollFactor(0);
    this.brand.setDepth(100).setScrollFactor(0);
    this.gameTitle.setDepth(100).setScrollFactor(0);

    forestBackground(this);
    forestRoad(this);
    JackPlayer(this);
    Resize(this);
    this.physics.world.setBounds(0, 0, Infinity, window.innerHeight - 100);
    shop(this);

    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      1,
      0,
      -1 * window.innerHeight * 0.5,
      -1 * window.innerHeight * 0.5
    );
    this?.player.sprite.anims.play("fall", true);
    this.player.sprite.anims.stopAfterRepeat(2);
    this.shopobject?.anims.play("shop", true);

    window.addEventListener("resize", () => {
      this.Resize();
      Resize(this);
      this.physics.world.setBounds(0, 0, Infinity, window.innerHeight);
    });
    this.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (
        this.player.sprite.anims.getName() === "fall" &&
        this.player.sprite.body instanceof Phaser.Physics.Arcade.Body
      ) {
        this.player.sprite.anims.play("run", true);
        this.player.sprite.body.setVelocityX(300);
      }
    });
    this.Resize();
  }

  update(time: number, delta: number): void {
    Backroundmovement(this);
    if (this.road !== undefined) {
      this.road.sprite.tilePositionX =
        this.cameras.main.scrollX * this.road.rationx;
    }
  }

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
