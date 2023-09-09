import Phaser from "phaser";
import { Direction, dirVelocity } from "./types";
import {
  Giant,
  Warrior,
  create_character,
  create_giant,
} from "../../game/Karakter";
import { forestBackground } from "./assets";
import PhaserGame from "../../PhaserGame";
import { JackPlayer } from "./Anims";
import { JackMovement } from "./PlayerMovemet";
import { Resize } from "./Resize";
import { healtbar, playerspbar } from "./Components";
import { Backroundmovement } from "./GameMovement";
import { UiScene } from "./uiScene";
import { eventTypes, gameEvents } from "../../game/events";
import MobController from "./mobController";

const jack = Warrior.from_Character(create_character("Ali"));

export default class MainScene extends Phaser.Scene {
  rect!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  attackrect!: Phaser.GameObjects.Rectangle;
  mobrect!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  mobattackrect!: Phaser.GameObjects.Rectangle;
  frontroad!: Phaser.Tilemaps.TilemapLayer;
  backroad!: Phaser.Tilemaps.TilemapLayer;
  // mobreclist: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
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
  goblinsprite: MobController[] = [];
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.left as Direction,
    mob: {} as Giant,
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
    spbar: {} as Phaser.GameObjects.Graphics,
    SawMc: {} as boolean,
    Attacking: {} as boolean,
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
  create() {
    JackPlayer(this);
    gameEvents.on(eventTypes.PAUSE_TOGGLE_REQUESTED, () => {
      // goblin vuracak kadar yakın ise izin verme
      if (this.scene.isActive()) this.scene.pause();
      else this.scene.resume();
    });
    // goblinEvents.on(goblinEventsTypes.TAKE_HİT, () => {
    //   this.goblin.sprite.anims.play("goblin-takehit", true);
    //   this.goblin.sprite.anims.stopAfterRepeat(0);
    // });

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
      //@ts-ignore
      this.frontroad = this.tilemap
        .createLayer("backroad", tiles)
        ?.setScale(
          (2.04 / 1311) * window.innerWidth,
          (2.04 / 724) * window.innerHeight
        );
      //@ts-ignore
      this.backroad = this.tilemap
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
      this.backroad?.setCollisionByProperty({ collides: true });
      this.frontroad?.setCollisionByProperty({ collides: true });
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
      // this.mobrect = this.physics.add
      //   .sprite(1000, 0, "mobrect")
      //   .setVisible(false)
      //   .setCollideWorldBounds(true)
      //   .setBounce(0.1);
      // this.mobattackrect = this.add.rectangle(
      //   this.mobrect.x,
      //   this.mobrect.y,
      //   undefined,
      //   undefined,
      //   0xff2400
      // );

      this.rect.setDisplaySize(
        (64 / 1311) * window.innerWidth,
        (125 / 724) * window.innerHeight
      );
      this.attackrect.setDisplaySize(
        (160 / 1283) * window.innerWidth,
        (32 / 724) * window.innerHeight
      );
      // this.mobrect.setDisplaySize(
      //   (64 / 1311) * window.innerWidth,
      //   (125 / 724) * window.innerHeight
      // );
      // this.mobattackrect.setDisplaySize(
      //   (75 / 1311) * window.innerWidth,
      //   (32 / 724) * window.innerHeight
      // );

      this.tilemap.getObjectLayer("goblin")?.objects.forEach((objData) => {
        const { x = 0, y = 0, name, id } = objData;

        const { healtbar, hptitle, spbar, SawMc, Attacking } = this.goblin;
        const sprite = this.add.sprite(x, y, "goblin-ıdle");
        const mob = create_giant(this.player.user.state.Level);
        this.mobrect = this.physics.add
          .sprite(x, y, "mobrect")
          .setVisible(false)
          // .setCollideWorldBounds(true)
          // .setBounce(0.1)
          .setDisplaySize(
            (64 / 1311) * window.innerWidth,
            (125 / 724) * window.innerHeight
          );

        // this.mobreclist.push(this.mobrect);
        const mobattackrect = this.add
          .rectangle(
            this.mobrect.x,
            this.mobrect.y,
            undefined,
            undefined,
            0xff2400
          )
          .setDisplaySize(
            (75 / 1311) * window.innerWidth,
            (32 / 724) * window.innerHeight
          );
        this.goblinsprite.push(
          new MobController(
            id,
            name,
            this,
            {
              sprite: sprite,
              lastdirection: Direction.left as Direction,
              mob: mob,
              healtbar,
              hptitle,
              spbar,
              SawMc,
              Attacking,
            },
            this.mobrect,
            mobattackrect
          ).reset()
        );

        this.physics.add.collider(
          [this.mobrect],
          [this.backroad, this.frontroad]
        );
        // this.obstacles.add("snowman", snowman.body as MatterJS.BodyType);
      });
      // this.physics.add.collider(this.mobreclist, this.mobreclist);
      this.physics.add.collider([this.rect], [this.backroad, this.frontroad]);
    }
    this.player.frame = this.make.tilemap({ key: "player-avatar" });
    const avatarframe = this.player.frame.addTilesetImage(
      "frame-set",
      "frame-set"
    );
    const avatarpng = this.player.frame.addTilesetImage(
      "jack-avatar",
      "jack-avatar"
    );
    if (avatarframe && avatarpng) {
      this.player.frame
        .createLayer("frame", avatarframe)
        ?.setScrollFactor(0)
        .setDepth(200)
        .setScale(
          (1 / 1440) * window.innerWidth,
          (1 / 900) * window.innerHeight
        );
      this.player.frame
        .createLayer("parchment", avatarframe)
        ?.setScrollFactor(0)
        .setScale(
          (1 / 1440) * window.innerWidth,
          (1 / 900) * window.innerHeight
        );
      //@ts-ignore
      this.player.hearticon = this.player.frame
        .createLayer(
          "hearticon",
          avatarframe,
          (10 / 1440) * window.innerWidth,
          0
        )
        ?.setScrollFactor(0)
        .setScale(
          (1 / 1440) * window.innerWidth,
          (1 / 900) * window.innerHeight
        );
      //@ts-ignore
      this.player.manaicon = this.player.frame
        .createLayer(
          "manaicon",
          avatarframe,
          (10 / 1440) * window.innerWidth,
          (3 / 900) * window.innerHeight
        )
        ?.setScrollFactor(0)
        .setScale(
          (1 / 1440) * window.innerWidth,
          (1 / 900) * window.innerHeight
        );

      this.player.frame
        .createLayer(
          "bar",
          avatarframe,
          (-37 / 1440) * window.innerWidth,
          (-10 / 900) * window.innerHeight
        )
        ?.setScale(
          (1.1 / 1440) * window.innerWidth,
          (1.1 / 900) * window.innerHeight
        )
        ?.setScrollFactor(0)
        .setDepth(100);
      this.player.frame
        .createLayer(
          "avatarpng",
          avatarpng,
          (-155 / 1440) * window.innerWidth,
          (-155 / 900) * window.innerHeight
        )
        ?.setScale(
          (3 / 1440) * window.innerWidth,
          (3 / 900) * window.innerHeight
        )
        .setScrollFactor(0);
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

    forestBackground(this);
    // goblinMob(this);
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
    // goblinMovement(this);
    Backroundmovement(this);
    healtbar(this);
    playerspbar(this);
    // goblinHealtbar(this);
    // goblinspbar(this);
    uiscene.statemenu.remaininpoints.setText(
      `Remaining Points :  ${this.player.user.state.stat_point}`
    );
    uiscene.statemenu.jacktext.setText(
      `Name: Jack    Level: ${this.player.user.state.Level}

Job: Samurai  MAX HP: ${this.player.user.state.max_hp}`
    );
    this.attackrect.x =
      this.rect.x +
      dirVelocity[this.player.lastdirection] * (80 / 899) * window.innerWidth;
    this.attackrect.y = this.rect.y;

    this.goblinsprite.forEach((goblinsprite) => goblinsprite.update(delta));
  }
}
