import { type MobCanlı } from "../../game/Karakter";
import {
  type Direction,
  direction,
  type GoblinAnimTypes,
} from "../../game/types";
import { getOrThrow } from "../utils";

export class Mob<T extends MobCanlı> {
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = direction.right;
  public id?: number;

  constructor(public mob: T) {}

  create(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    anim: GoblinAnimTypes,
    Rectx: number,
    Recty: number,
    scaleSize: number,
    bdySizeX: number,
    bdySizeY: number
  ) {
    this._scene = scene;
    this.id = id;
    this._sprite = scene.physics.add
      .sprite(x * 2.55, y * 2.55, anim)
      .setBodySize(bdySizeX, bdySizeY, true)
      .setCollideWorldBounds(true)
      .setBounce(0)
      .setDepth(100)
      .setScale(scaleSize)
      .setOffset(60, 65);
    this._attackrect = scene.physics.add.sprite(
      x,
      y,
      `$${this.mob.name}-attackrect`
    );

    (this._attackrect.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    this.attackrect.setDisplaySize(Rectx, Recty).setDepth(0).setVisible(false);
  }

  // update(time: number, delta: number) {}

  get scene() {
    return getOrThrow(this._scene, "Scene");
  }

  get sprite() {
    return getOrThrow(this._sprite, "Sprite");
  }

  get attackrect() {
    return getOrThrow(this._attackrect, "Attackrect");
  }
}
