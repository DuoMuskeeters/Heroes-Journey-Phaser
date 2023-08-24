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
import { goblinHealtbar, healtbar, playerspbar } from "./Components";
import { Backroundmovement } from "./GameMovement";
import { goblinMovement } from "./GoblinMovement";
import { threadId } from "worker_threads";
import { UiScene } from "./uiScene";

const jack = Warrior.from_Character(create_character("Ali"));

export default class MainScene extends Phaser.Scene {
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right,
    framewidth: 200,
    frameheight: 166,
    standbytime: 5000,
    ultimate: true,
    user: jack,
    healtbar: {} as Phaser.GameObjects.Graphics,
    spbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    frameWidth: 150,
    frameHeight: 145,
    lastdirection: Direction["left"],
    mob: create_giant(1),
    healtbar: {} as Phaser.GameObjects.Graphics,
    hptitle: {} as Phaser.GameObjects.Text,
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
    super("mainscene");
  }
  preload() {}

  create() {
    //user icin jack vermek zorunda kaldik.
    setInterval(() => {
      this.player.user.regeneration();
    }, 1000);
    setInterval(() => {
      this.goblin.mob.mob_regeneration();
    }, 1000);
    this.player.healtbar = this.add.graphics();
    this.goblin.healtbar = this.add.graphics();
    this.player.spbar = this.add.graphics();
    forestBackground(this);
    forestRoad(this);
    JackPlayer(this);
    this.player.sprite.anims.play("fall-right", true);
    this.player.sprite.anims.stopAfterRepeat(0);
    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      1,
      0,
      -1 * window.innerHeight * 0.4073,
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
    this.player.hptitle.setPosition(this.player.sprite.x - 240, 10);
    this.player.healtbar.setPosition(this.player.sprite.x - 240, 10);
    this.player.spbar.setPosition(this.player.sprite.x - 240, 63);
    this.goblin.hptitle.setPosition(
      this.goblin.sprite.x - 70,
      this.goblin.sprite.y - 72
    );
    this.goblin.healtbar.setPosition(
      this.goblin.sprite.x - 50,
      this.goblin.sprite.y - 40
    );
    uiscene.statemenu.remaininpoints.setText(
      `Remaining Points:${this.player.user.state.stat_point}`
    );
  }
}
