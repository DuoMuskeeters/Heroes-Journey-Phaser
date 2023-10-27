import { type MobCanlı } from "../../game/Karakter";
import {
  type Direction,
  direction,
  type GoblinAnimTypes,
} from "../../game/types";
import { getOrThrow } from "../utils";

export class Mob<T extends MobCanlı> {
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Physics.Matter.Sprite;
  private _attackrect?: Phaser.Physics.Matter.Sprite;
  public lastdirection: Direction = direction.right;
  public id?: number;

  constructor(public mob: T) {}

  create(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    anim: GoblinAnimTypes,
    args: {
      attackRectX: number;
      attackRectY: number;
      bodySizeX: number;
      bodySizeY: number;
    }
  ) {
    this._scene = scene;
    this.id = id;
    this._sprite = scene.matter.add
      .sprite(x, y, anim, undefined, {
        label: this.mob.name,
        render: {
          sprite: {
            yOffset: 0.06,
          },
        },
      })
      .setDepth(100)
      .setFixedRotation();

    this._attackrect = scene.matter.add
      .sprite(x, y, `$${this.mob.name}-attackrect`, undefined, {
        label: `$${this.mob.name}-attackrect`,
        shape: {
          type: "rectangle",
          width: args.attackRectX,
          height: args.attackRectY,
        },
        ignoreGravity: true,
        isSensor: true,
      })
      .setDepth(0)
      .setVisible(false);
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
