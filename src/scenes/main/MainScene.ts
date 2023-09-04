import Phaser from "phaser";
import { Direction, dirVelocity } from "./types";
import {
  Character,
  Mob,
  Warrior,
  create_character,
  create_giant,
  level,
} from "../../game/Karakter";
import { forestBackground, forestRoad, preloadAssets } from "./assets";
import HelloWorldScene from "../HelloWorldScene";
import PhaserGame from "../../PhaserGame";
import { JackPlayer, goblinMob } from "./Anims";
import { JackMovement } from "./PlayerMovemet";
import { Resize } from "./Resize";
import {
  goblinHealtbar,
  goblinspbar,
  healtbar,
  playerspbar,
} from "./Components";
import { Backroundmovement } from "./GameMovement";
import { goblinMovement } from "./MobMovement";
import { threadId } from "worker_threads";
import { UiScene } from "./uiScene";
import { jackattack } from "./Playerattack";
import { mobattack } from "./MobAttack";

const jack = Warrior.from_Character(create_character("Ali"));

export default class MainScene extends Phaser.Scene {
  rect!: Phaser.GameObjects.Sprite;
  attackrect!: Phaser.GameObjects.Rectangle;
  mobrect!: Phaser.GameObjects.Sprite;
  mobattackrect!: Phaser.GameObjects.Rectangle;
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right as Direction,

    standbytime: 500,
    ultimate: true,
    user: jack,
    healtbar: {} as Phaser.GameObjects.Sprite,
    spbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,

    lastdirection: Direction.left as Direction,
    mob: create_giant(1),
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
    spbar: {} as Phaser.GameObjects.Graphics,
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
  tilemap!: Phaser.Tilemaps.Tilemap;
  constructor() {
    super("mainscene");
  }
  preload() {
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "roadfile" });

    const tiles = this.tilemap.addTilesetImage("road-set", "road-set");
    const lamp = this.tilemap.addTilesetImage("lamp", "lamp");
    const fence = this.tilemap.addTilesetImage("fence_2", "fence_2");
    const grass2 = this.tilemap.addTilesetImage("grass_2", "grass_2");
    const grass3 = this.tilemap.addTilesetImage("grass_3", "grass_3");
    const grass1 = this.tilemap.addTilesetImage("grass_1", "grass_1");
    const rock3 = this.tilemap.addTilesetImage("rock_3", "rock_3");
    const rock2 = this.tilemap.addTilesetImage("rock_2", "rock_2");
    const sign = this.tilemap.addTilesetImage("sign", "sign");

    if (
      tiles &&
      lamp &&
      fence &&
      rock2 &&
      rock3 &&
      sign &&
      grass1 &&
      grass2 &&
      grass3
    ) {
      this.tilemap
        .createLayer("backroad", tiles)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      const backroad = this.tilemap
        .createLayer("frontroad", tiles)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      this.tilemap
        .createLayer("lamp", lamp, 0, -(50 / 724) * window.innerHeight)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      this.tilemap
        .createLayer("fence", fence, 0, (25 / 724) * window.innerHeight)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      this.tilemap
        .createLayer("rock_3", rock3, 0, (30 / 724) * window.innerHeight)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      this.tilemap
        .createLayer("rock_2", rock2, 0, (40 / 724) * window.innerHeight)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );

      this.tilemap
        .createLayer("sign", sign)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      this.tilemap
        .createLayer(
          "grass",
          [grass1, grass2, grass3],
          0,
          (60 / 724) * window.innerHeight
        )
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );

      // backroad.setCollisionByExclusion([-1], true);
      backroad?.setCollisionByProperty({ collides: true });
      this.rect = this.physics.add
        .sprite(500, 0, "rect")
        .setVisible(false)
        .setCollideWorldBounds(true)
        .setBounce(0.1);
      this.attackrect = this.add.rectangle(
        this.rect.x,
        this.rect.y,
        undefined,
        undefined,
        0xff2400
      );
      this.mobrect = this.physics.add
        .sprite(1000, 0, "mobrect")
        .setVisible(false)
        .setCollideWorldBounds(true)
        .setBounce(0.1);
      this.mobattackrect = this.add.rectangle(
        this.mobrect.x,
        this.mobrect.y,
        undefined,
        undefined,
        0xff2400
      );

      this.rect.setDisplaySize(
        (64 / 1311) * window.innerWidth,
        (125 / 724) * window.innerHeight
      );
      this.attackrect.setDisplaySize(
        (160 / 1283) * window.innerWidth,
        (32 / 724) * window.innerHeight
      );
      this.mobrect.setDisplaySize(
        (64 / 1311) * window.innerWidth,
        (125 / 724) * window.innerHeight
      );
      this.mobattackrect.setDisplaySize(
        (75 / 1311) * window.innerWidth,
        (32 / 724) * window.innerHeight
      );

      if (backroad)
        this.physics.add.collider([this.rect, this.mobrect], backroad);
    }

    this.cameras.main.startFollow(
      this.rect,
      false,
      1,
      0,
      -(220 / 1403) * window.innerWidth,
      -(290 / 724) * window.innerHeight
    );
    setInterval(() => {
      this.player.user.regeneration();
    }, 1000);
    setInterval(() => {
      this.goblin.mob.mob_regeneration();
    }, 1000);
    this.player.healtbar = this.add.sprite(100, 300, "hp-bar").setScale(3);
    this.add
      .image(0, 0, "jack-avatar")
      .setOrigin(0)
      .setScale(4)
      .setPosition(-300, 0)
      .setCrop(0, 0, 150, 21);
    this.goblin.healtbar = this.add.graphics();
    this.player.spbar = this.add.graphics();
    this.goblin.spbar = this.add.graphics();
    forestBackground(this);
    JackPlayer(this);
    goblinMob(this);
    jackattack(this);
    this.player.sprite.anims.play("fall-right", true);
    this.player.sprite.anims.stopAfterRepeat(0);

    window.addEventListener("resize", () => {
      this.physics.world.gravity.y = (2000 / 724) * window.innerHeight;
      Resize(this);
    });
    Resize(this);
    this.player.hptitle = this.add
      .text(0, 0, `${this.player.user.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
      .setFontStyle("bold");
    this.goblin.hptitle = this.add
      .text(0, 0, `${this.goblin.mob.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
      .setFontStyle("bold");
    this.scene.launch("ui");
  }

  update(time: number, delta: number): void {
    const uiscene = PhaserGame.scene.keys.ui as UiScene;
    JackMovement(this);
    goblinMovement(this);
    Backroundmovement(this);
    healtbar(this);
    playerspbar(this);
    goblinHealtbar(this);
    goblinspbar(this);
    uiscene.statemenu.remaininpoints.setText(
      `Remaining Points:${this.player.user.state.stat_point}`
    );
    uiscene.statemenu.jacktext.setText(
      `Name: Jack    Level: ${this.player.user.state.Level}

Job: Samurai  MAX HP: ${this.player.user.state.max_hp}`
    );
    this.attackrect.x =
      this.rect.x +
      dirVelocity[this.player.lastdirection] * (80 / 899) * window.innerWidth;
    this.attackrect.y = this.rect.y;
    this.mobattackrect.x =
      this.mobrect.x +
      dirVelocity[this.goblin.lastdirection] * (48 / 899) * window.innerWidth;
    this.mobattackrect.y = this.mobrect.y;
  }
}
