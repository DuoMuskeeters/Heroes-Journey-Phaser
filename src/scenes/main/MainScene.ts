import Phaser from "phaser";
import { Direction, mcAnimTypes } from "../../game/types/types";
import { Giant, Warrior } from "../../game/Karakter";
import { createBackground } from "../preLoad/assets";
import PhaserGame, { CONFIG } from "../../PhaserGame";
import { loadAnimations } from "./Anims";
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
import { Player } from "../../objects/player";

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;

  player;
  playerUI = {
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
    this.player = new Player(new Warrior());
  }

  create() {
    this.player.create(this, 300, 0);

    mcEvents.on(mcEventTypes.TOOK_HIT, (damage: number) => {
      console.log(
        `mc took hit damage: ${damage} after hp: ${this.player.character.state.HP}`
      );
    });
    mcEvents.on(mcEventTypes.DIED, () => {
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
          } damage: ${details.damage} after hp: ${
            controller.mob.goblin.state.HP
          }`
        );
      }
    );

    this.tilemap = this.make.tilemap({ key: "roadfile" });

    createBackground(this);
    createAvatarFrame(this);
    loadAnimations(this);
    createground(this);

    // this.frontroad.setCollisionByExclusion([-1], true);

    createCollider(this, [this.player.sprite], [this.backroad, this.frontroad]);
    createMob(this);

    setInterval(() => {
      if (this.scene.isPaused()) return;
      this.player.character.regeneration();
      this.mobController.forEach((controller) => {
        controller.mob.goblin.regeneration();
      });
    }, 1000);

    this.cameras.main.startFollow(this.player.sprite, false, 1, 0, -420, -160);

    this.playerUI.hpbar = this.add
      .sprite(238, 76, "hp-bar")
      .setScale(5, 2.7)
      .setDepth(5)
      .setScrollFactor(0);
    this.playerUI.manabar = this.add
      .sprite(214, 112, "mana-bar")
      .setScale(3.8, 2.7)
      .setDepth(5)
      .setScrollFactor(0);

    this.player.sprite.anims.play(mcAnimTypes.FALL, true);
    this.player.sprite.anims.stopAfterRepeat(2);

    this.physics.world.setBounds(0, 0, Infinity, CONFIG.height - 300);

    this.playerUI.hptitle = this.add
      .text(370, 65, `${this.player.character.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0);

    this.playerUI.sptitle = this.add
      .text(340, 103, `${this.player.character.state.SP}`)
      .setStyle({
        fontSize: "22px Arial",
        align: "center",
      })
      .setFontFamily("URW Chancery L, cursive")
      .setFontStyle("bold")
      .setScrollFactor(0);

    this.scene.launch("ui");
  }

  update(time: number, delta: number): void {
    const uiscene = PhaserGame.scene.keys.ui as UiScene;
    this.player.update(time, delta);
    Backroundmovement(this);
    playerhealtbar(this);
    playerspbar(this);
    uiscene.statemenu.remaininpoints.setText(
      `Remaining Points :  ${this.player.character.state.stat_point}`
    );
    uiscene.statemenu.jacktext.setText(
      `Name: Jack    Level: ${this.player.character.state.Level}

Job: Samurai  MAX HP: ${this.player.character.state.max_hp}`
    );

    this.mobController.forEach((mobCcontroller) => {
      if (mobCcontroller.mob.sprite.body) mobCcontroller.update(delta);
    });
  }
}
