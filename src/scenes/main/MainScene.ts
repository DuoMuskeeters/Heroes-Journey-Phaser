import Phaser from "phaser";
import { Direction, dirVelocity } from "../../game/types/types";
import { Giant, Warrior, create_character } from "../../game/Karakter";
import { createBackground as createBackground } from "../preLoad/assets";
import PhaserGame from "../../PhaserGame";
import { createPlayeranims as createPlayeranims } from "./Anims";
import { JackMovement } from "./PlayerMovemet";
import { Resize } from "./Resize";
import { playerhealtbar, playerspbar } from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { UiScene } from "../Ui/uiScene";
import MobController from "./mobController";
import { createground as createground } from "./TileGround";
import { createMob } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";
import { goblinEvents, goblinEventsTypes } from "../../game/types/events";

const jack = Warrior.from_Character(create_character("Ali"));

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  player = {
    sprite: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    attackrect: {} as Phaser.GameObjects.Rectangle,
    lastdirection: Direction.right as Direction,
    standbytime: 5000,
    ultimate: true,
    user: jack,
    hpbar: {} as Phaser.GameObjects.Sprite,
    manabar: {} as Phaser.GameObjects.Sprite,
    hptitle: {} as Phaser.GameObjects.Text,
    sptitle: {} as Phaser.GameObjects.Text,
    frame: {} as Phaser.Tilemaps.Tilemap,
    hearticon: {} as Phaser.Tilemaps.TilemapLayer,
    manaicon: {} as Phaser.Tilemaps.TilemapLayer,
    tookhit: {} as boolean,
    ultiDamage: {} as number,
  };
  mobController: MobController[] = [];
  mob = {
    sprite: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    attackrect: {} as Phaser.GameObjects.Rectangle,
    lastdirection: Direction.left as Direction,
    goblin: {} as Giant,
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
    spbar: {} as Phaser.GameObjects.Graphics,
    SawMc: {} as boolean,
    Attacking: {} as boolean,
    stun: {} as boolean,
    bomb: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  };
  backgrounds!: {
    rationx: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[];

  shopobject?: Phaser.GameObjects.Sprite;
  tilemap!: Phaser.Tilemaps.Tilemap;
  constructor() {
    super("mainscene");
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "roadfile" });
    createBackground(this);
    createAvatarFrame(this);
    createPlayeranims(this);
    createground(this);
    this.player.attackrect = this.add.rectangle(
      500,
      500,
      undefined,
      undefined,
      0xff2400
    );

    this.player.attackrect.setDisplaySize(
      (250 / 1440) * window.innerWidth,
      (200 / 900) * window.innerHeight
    );

    // this.frontroad.setCollisionByExclusion([-1], true);

    this.physics.add.collider(
      [this.player.sprite],
      [this.backroad, this.frontroad]
    );
    createMob(this);

    setInterval(() => {
      this.player.user.regeneration();
    }, 1000);

    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      1,
      0,
      -(220 / 1403) * window.innerWidth,
      -(290 / 724) * window.innerHeight
    );

    this.player.hpbar = this.add
      .sprite(
        (238 / 1440) * window.innerWidth,
        (76 / 900) * window.innerHeight,
        "hp-bar"
      )
      .setScale(
        (5 / 1440) * window.innerWidth,
        (2.7 / 900) * window.innerHeight
      )
      .setDepth(5)
      .setScrollFactor(0);
    this.player.manabar = this.add
      .sprite(
        (214 / 1440) * window.innerWidth,
        (112 / 900) * window.innerHeight,
        "mana-bar"
      )
      .setScale(
        (3.8 / 1440) * window.innerWidth,
        (2.7 / 900) * window.innerHeight
      )
      .setDepth(5)
      .setScrollFactor(0);

    this.player.sprite.anims.play("fall", true);
    this.player.sprite.anims.stopAfterRepeat(0);

    window.addEventListener("resize", () => {
      this.physics.world.gravity.y = (2000 / 724) * window.innerHeight;
      Resize(this);
    });
    Resize(this);
    this.player.hptitle = this.add
      .text(
        (370 / 1440) * window.innerWidth,
        (65 / 900) * window.innerHeight,
        `${this.player.user.state.HP}`
      )
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0)
      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);
    this.player.sptitle = this.add
      .text(
        (340 / 1440) * window.innerWidth,
        (103 / 900) * window.innerHeight,
        `${this.player.user.state.SP}`
      )
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0)

      .setScale((1 / 1440) * window.innerWidth, (1 / 900) * window.innerHeight);

    this.scene.launch("ui");
  }

  update(time: number, delta: number): void {
    const uiscene = PhaserGame.scene.keys.ui as UiScene;
    JackMovement(this);
    Backroundmovement(this);
    playerhealtbar(this);
    playerspbar(this);
    uiscene.statemenu.remaininpoints.setText(
      `Remaining Points :  ${this.player.user.state.stat_point}`
    );
    uiscene.statemenu.jacktext.setText(
      `Name: Jack    Level: ${this.player.user.state.Level}

Job: Samurai  MAX HP: ${this.player.user.state.max_hp}`
    );

    this.mobController.forEach((mobCcontroller) => {
      if (mobCcontroller.mob.sprite.body) mobCcontroller.update(delta);
    });
    this.player.attackrect.setVisible(false);
  }
}
