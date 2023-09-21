import { Mob } from "../../game/Karakter";
import {
  Direction,
  GoblinAnimTypes,
  GoblinTookHit,
  mobEvents,
  mobEventsTypes,
} from "../../game/types";

export class MOB<T extends Mob> {
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = Direction.right;
  public id?: number;
  public name?: string;

  constructor(public mob: T) {}

  create(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    name: string,
    anim: GoblinAnimTypes,
    Rectx: number,
    Recty: number,
    scaleSize: number,
    bdySizeX: number,
    bdySizeY: number
  ) {
    this._scene = scene;
    this.id = id;
    this.name = name;
    this._sprite = scene.physics.add
      .sprite(x * 2.55, y * 2.55, anim)
      .setBodySize(bdySizeX, bdySizeY, true)
      .setCollideWorldBounds(true)
      .setBounce(0)
      .setDepth(100)
      .setScale(scaleSize);
    this._attackrect = scene.physics.add.sprite(x, y, `$${name}-attackrect`);

    (this._attackrect.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    this.attackrect.setDisplaySize(Rectx, Recty).setDepth(0).setVisible(false);

    this.listeners();
  }

  update(time: number, delta: number) {}

  listeners() {
    mobEvents.on(mobEventsTypes.DIED, (id: number) => {
      if (this.id === id) console.log(`${this.name} died`);
    });
    mobEvents.on(
      mobEventsTypes.TOOK_HIT,
      (id: number, details: GoblinTookHit) => {
        if (this.id === id)
          console.log(
            `goblin ${this.name} took hit ${
              details.stun ? "(STUN)" : "(NORMAL)"
            } damage: ${details.damage} after hp: ${this.mob.state.HP}`
          );
      }
    );
  }

  get scene() {
    if (!this._scene)
      throw new Error("Scene is not defined, call create first");
    return this._scene;
  }

  get sprite() {
    if (!this._sprite)
      throw new Error("Sprite is not defined, call create first");
    return this._sprite;
  }

  get attackrect() {
    if (!this._attackrect)
      throw new Error("Attackrect is not defined, call create first");
    return this._attackrect;
  }
}
