import { Character } from "../../game/Karakter";
import { mcEventTypes, mcEvents } from "../../game/types/events";
import { Direction, mcAnimTypes } from "../../game/types/types";
import { playerAttackListener } from "../../scenes/main/Playerattack";
import { killCharacter, playerMovementUpdate } from "./movements";

export class Player<T extends Character> {
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = Direction.right;

  constructor(public character: T) {}

  create(scene: Phaser.Scene, x: number, y: number) {
    this._scene = scene;
    this._sprite = scene.physics.add
      .sprite(x, y, mcAnimTypes.IDLE)
      .setCollideWorldBounds(true)
      .setBounce(0.1)
      .setScale(2.55)
      .setBodySize(30, 40, true)
      .setDepth(300);

    this._attackrect = scene.physics.add
      .sprite(500, 500, "attackrect")
      .setDisplaySize(280, 170)
      .setVisible(false);

    (this._attackrect.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    mcEvents.on(mcEventTypes.TOOK_HIT, () => {
      if (this.character.isDead()) mcEvents.emit(mcEventTypes.DIED);
    });

    mcEvents.on(mcEventTypes.DIED, () => {
      killCharacter(this);
    });

    playerAttackListener(this);
    return this;
  }

  update(time: number, delta: number) {
    playerMovementUpdate(this);
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
