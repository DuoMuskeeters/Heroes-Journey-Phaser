import Phaser from "phaser";
import { loadAnimations, shop } from "../main/Anims";
import { createBackground, forestRoad } from "../preLoad/assets";
import { Backroundmovement } from "../main/GameMovement";
import { Direction, mcAnimTypes } from "../../game/types/types";
import { CONFIG } from "../../PhaserGame";
import { GameCharacter } from "../../objects/player";

export default class MenuScene extends Phaser.Scene {
  logo = {} as Phaser.GameObjects.Image;
  brand = {} as Phaser.GameObjects.Text;
  gameTitle = {} as Phaser.GameObjects.Text;
  player: GameCharacter;
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
    this.player = new GameCharacter("auto");
  }

  create() {
    this.player.create(this, 300, 0);
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

    createBackground(this);
    forestRoad(this);
    loadAnimations(this);
    this.physics.world.setBounds(0, 0, Infinity, CONFIG.height - 140);
    shop(this);

    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      1,
      0,
      -1 * CONFIG.height * 0.5,
      -1 * CONFIG.height * 0.5
    );
    this?.player.sprite.anims.play(mcAnimTypes.FALL, true);
    this.player.sprite.anims.stopAfterRepeat(3);
    this.shopobject?.anims.play("shop", true);

    this.player.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (
        this.player.sprite.anims.getName() === mcAnimTypes.FALL &&
        this.player.sprite.body instanceof Phaser.Physics.Arcade.Body
      ) {
        this.player.sprite.anims.play(mcAnimTypes.RUN, true);
        this.player.sprite.body.setVelocityX(300);
      }
    });
    this.createIntro();
  }

  update(time: number, delta: number): void {
    Backroundmovement(this);
    if (this.road !== undefined) {
      this.road.sprite.tilePositionX =
        this.cameras.main.scrollX * this.road.rationx;
    }
  }

  createIntro() {
    const logoLeft = (CONFIG.width - this.logo.width) / 2;
    const logoTop = (CONFIG.height - this.logo.height) / 2;
    const brandLeft = CONFIG.width / 2;
    const brandTop = CONFIG.height / 4;
    const textLeft = CONFIG.width / 6;
    const textTop = CONFIG.height / 2;

    this.logo.setPosition(logoLeft, logoTop);
    this.brand.setPosition(brandLeft, brandTop);
    this.gameTitle.setPosition(textLeft, textTop);
  }

  handleStartGame() {
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
