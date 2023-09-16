import Phaser from "phaser";
import { Direction, mcAnimTypes } from "../../game/types/types";
import { Giant, Warrior, create_character } from "../../game/Karakter";
import { createBackground } from "../preLoad/assets";
import PhaserGame, { CONFIG } from "../../PhaserGame";
import { createPlayeranims } from "./Anims";
import { JackDied, JackOnUpdate } from "./PlayerController";
import { playerhealtbar, playerspbar } from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { UiScene } from "../Ui/uiScene";
import MobController from "./mobController";
import { createCollider, createground } from "./TileGround";
import { createMob } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";
import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";

const jack = Warrior.from_Character(create_character("Ali"));

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  player = {
    sprite: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    attackrect: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
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
  };
  mobController: MobController[] = [];
  mob = {
    sprite: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    attackrect: {} as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    lastdirection: Direction.left as Direction,
    goblin: {} as Giant,
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
    spbar: {} as Phaser.GameObjects.Graphics,
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
    mcEvents.on(mcEventTypes.TOOK_HIT, (damage: number) => {
      console.log(`mc took hit damage: ${damage} after hp: ${jack.state.HP}`);
      if (jack.isDead()) {
        mcEvents.emit(mcEventTypes.DIED);
      }
    });
    mcEvents.on(mcEventTypes.DIED, () => {
      JackDied(this);
      console.log(`mc died`);
    });
    goblinEvents.on(goblinEventsTypes.DIED, () => {
      console.log(`goblin died`);
    });
    goblinEvents.on(
      goblinEventsTypes.TOOK_HIT,
      (id: number, details: GoblinTookHit) => {
        const controller = this.mobController[id - 1]!;
        console.log(
          `goblin ${controller.name} took hit ${
            details.stun ? "(STUN)" : "(NORMAL)"
          } damage: ${details.damage} after hp: ${jack.state.HP}`
        );
        if (controller.mob.goblin.isDead()) {
          goblinEvents.emit(goblinEventsTypes.DIED);
        }
      }
    );

    this.tilemap = this.make.tilemap({ key: "roadfile" });

    createBackground(this);
    createAvatarFrame(this);
    createPlayeranims(this);
    createground(this);

    this.player.attackrect = this.physics.add
      .sprite(500, 500, "attackrect")
      .setDisplaySize(280, 170)
      .setVisible(false);

    (this.player.attackrect.body as Phaser.Physics.Arcade.Body).allowGravity =
      false;

    // this.frontroad.setCollisionByExclusion([-1], true);

    createCollider(this, [this.player.sprite], [this.backroad, this.frontroad]);
    createMob(this);

    setInterval(() => {
      if (this.scene.isPaused()) return;
      this.player.user.regeneration();
      this.mobController.forEach((controller) => {
        controller.mob.goblin.regeneration();
      });
    }, 1000);

    this.cameras.main.startFollow(this.player.sprite, false, 1, 0, -420, -160);

    this.player.hpbar = this.add
      .sprite(238, 76, "hp-bar")
      .setScale(5, 2.7)
      .setDepth(5)
      .setScrollFactor(0);
    this.player.manabar = this.add
      .sprite(214, 112, "mana-bar")
      .setScale(3.8, 2.7)
      .setDepth(5)
      .setScrollFactor(0);

    this.player.sprite.anims.play(mcAnimTypes.FALL, true);
    this.player.sprite.anims.stopAfterRepeat(2);

    this.physics.world.setBounds(0, 0, Infinity, CONFIG.height - 300);

    this.player.hptitle = this.add
      .text(370, 65, `${this.player.user.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0)
      
    this.player.sptitle = this.add
      .text(340, 103, `${this.player.user.state.SP}`)
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0)
      

    this.scene.launch("ui");
  }

  update(time: number, delta: number): void {
    const uiscene = PhaserGame.scene.keys.ui as UiScene;
    JackOnUpdate(this);
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
  }
}
