import Phaser from "phaser";
import { Direction, dirVelocity } from "./types";
import {
  Character,
  Mob,
  Warrior,
  create_character,
  create_giant,
} from "../../game/Karakter";
import { forestBackground, forestRoad, preloadAssets } from "./assets";
import HelloWorldScene from "../HelloWorldScene";
import PhaserGame from "../../PhaserGame";
import { JackPlayer } from "./Anims";
import { JackMovement } from "./PlayerMovemet";
import { Resize } from "./Resize";
import { healtbar } from "./Components";
import { Backroundmovement } from "./GameMovement";
import { goblinMovement } from "./GoblinMovement";

const jack = Warrior.from_Character(create_character("Ali"));
const goblin_1sv = create_giant(3);
export default class MainScene extends Phaser.Scene {
  player = {
    sprite: {} as Phaser.GameObjects.Sprite,
    lastdirection: Direction.right,
    framewidth: 200,
    frameheight: 166,
    standbytime: 3000,
    ultimate: true,
    user: jack,
    healtbar: {} as Phaser.GameObjects.Graphics,
  };
  goblin = {
    sprite: {} as Phaser.GameObjects.Sprite,
    frameWidth: 150,
    frameHeight: 145,
    lastdirection: Direction["left"],
    mob: goblin_1sv,
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
      console.log(`player ${this.player.user.state.HP}`);
    }, 1000);
    setInterval(() => {
      this.goblin.mob.regeneration();
      console.log(`goblin ${this.goblin.mob.state.HP}`);
    }, 1000);
    this.player.healtbar = this.add.graphics();
    forestBackground(this);
    forestRoad(this);
    JackPlayer(this);
    this.player.sprite.anims.play("fall-right", true);
    this.player.sprite.anims.stopAfterRepeat(1);
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
  }

  update(time: number, delta: number): void {
    JackMovement(this);
    goblinMovement(this);
    Backroundmovement(this);
    if (this.player.user.state.SP < 50) {
      this.player.ultimate = false;
    } else this.player.ultimate = true;
  }
}
