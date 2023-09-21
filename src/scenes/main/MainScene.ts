import Phaser from "phaser";
import { createBackground } from "../preLoad/assets";
import { loadAnimations } from "./Anims";
import { playerhealtbar, playerspbar } from "../Ui/Components";
import { Backroundmovement } from "./GameMovement";
import { createCollider, createground } from "./TileGround";
import { createMob } from "./CreateMob";
import { createAvatarFrame } from "../Ui/AvatarUi";

import { Player } from "../../objects/player";
import { Warrior } from "../../game/Karakter";
import { mcAnimTypes, mcEventTypes, mcEvents } from "../../game/types";
import { CONFIG } from "../../PhaserGame";
import goblinController from "../../objects/Mob/goblinController";

export default class MainScene extends Phaser.Scene {
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;
  keySpace!: Phaser.Input.Keyboard.Key;
  keyW!: Phaser.Input.Keyboard.Key;
  keyA!: Phaser.Input.Keyboard.Key;
  keyD!: Phaser.Input.Keyboard.Key;
  keyQ!: Phaser.Input.Keyboard.Key;
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

  mobController: goblinController[] = [];
  mobUI = {
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
    spbar: {} as Phaser.GameObjects.Graphics,
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

      this.playerUI.hearticon.setTint(0x020000);
      this.playerUI.hptitle.setTint(0x020000);

      this.time.addEvent({
        delay: 400,
        callback: () => {
          this.playerUI.hearticon.setTint(0xffffff);
          this.playerUI.hptitle.clearTint();
        },
      });
    });

    mcEvents.on(mcEventTypes.DIED, () => {
      console.log(`mc died`);
    });

    this.tilemap = this.make.tilemap({ key: "roadfile" });

    this.Addkey();
    createBackground(this);
    createAvatarFrame(this);
    loadAnimations(this);
    createground(this);

    // this.frontroad.setCollisionByExclusion([-1], true);

    createCollider(this.player.sprite);
    createMob(this);

    setInterval(() => {
      if (this.scene.isPaused()) return;
      this.player.character.regeneration();
      this.mobController.forEach((controller) => {
        controller.goblin.mob.regeneration();
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
    this.player.update(time, delta);
    Backroundmovement(this);
    playerhealtbar(this);
    playerspbar(this);
    this.mobController.forEach((mobCcontroller) => {
      if (mobCcontroller.goblin.sprite.body) mobCcontroller.update(delta);
    });
  }
  Addkey() {
    this.keySpace = this.input.keyboard?.addKey("SPACE")!;
    this.keyW = this.input.keyboard?.addKey("W")!;
    this.keyA = this.input.keyboard?.addKey("A")!;
    this.keyD = this.input.keyboard?.addKey("D")!;
    this.keyQ = this.input.keyboard?.addKey("Q")!;
  }
}
