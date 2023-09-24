import { Character } from "../../game/Karakter";
import { mcEventTypes, mcEvents } from "../../game/types/events";
import { type Direction, direction, mcAnimTypes } from "../../game/types/types";
import { playerAttackListener } from "../../scenes/main/Playerattack";
import { getOrThrow } from "../utils";
import { killCharacter, playerMovementUpdate } from "./movements";

export class Player<T extends Character> {
  private _index?: number;
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = direction.right;

  constructor(public character: T) {}

  create(scene: Phaser.Scene, x: number, y: number, i: number) {
    this._index = i;
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

    playerAttackListener(this);
    console.log(`player ${this.index} created in scene`, scene.scene.key);
  }

  onTookHit(damage: number) {
    if (this.character.isDead()) mcEvents.emit(mcEventTypes.DIED, this.index);
  }

  onDied() {
    killCharacter(this);
  }

  update(time: number, delta: number) {
    playerMovementUpdate(this);
  }

  get index() {
    return getOrThrow(this._index, "Index");
  }

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
