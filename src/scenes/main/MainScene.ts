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
import { JackPlayer } from "./Anims";
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
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right as Direction,
    framewidth: 200,
    frameheight: 166,
    standbytime: 5000,
    ultimate: true,
    user: jack,
    healtbar: {} as Phaser.GameObjects.Sprite,
    spbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    frameWidth: 150,
    frameHeight: 145,
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
  preload() {}

  create() {
    
    this.tilemap = this.make.tilemap({ key: "frame-tiled" });

    const tiles = this.tilemap.addTilesetImage("player-frame", "frame-set");
    if (tiles) this.tilemap.createLayer("frame-layer", tiles);
    
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
    forestRoad(this);
    JackPlayer(this);
    jackattack(this);
    this.player.sprite.anims.play("fall-right", true);
    this.player.sprite.anims.stopAfterRepeat(0);
    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      1,
      0,
      -1 * window.innerHeight * 0.1,
      -1 * window.innerHeight * 0.5
    );
    window.addEventListener("resize", () => {
      this.physics.world.gravity.y = window.innerHeight * 8.5365;
      this.physics.world.setBounds(0, 0, Infinity, window.innerHeight);
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
  }
}
