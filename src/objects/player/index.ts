import { type Character, CanlıIsDead } from "../../game/Karakter";
import { PressingKeys, mcEventTypes, mcEvents } from "../../game/types/events";
import { type Direction, direction, mcAnimTypes } from "../../game/types/types";
import { playerAttackListener } from "../../client/scenes/main/Playerattack";
import { getOrThrow } from "../utils";
import { killCharacter, playerMovementUpdate } from "./movements";

export class Player<T extends Character> {
  private _index?: number;
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = direction.right;
  public pressingKeys: PressingKeys = {
    W: false,
    A: false,
    D: false,
    E: false,
    Q: false,
    Space: false,
  };

  constructor(public character: T, public _sessionId?: string) {}

  create(scene: Phaser.Scene, x: number, y: number, i: number) {
    const type = this.character.type;
    this._index = i;
    this._scene = scene;
    this._sprite = scene.physics.add
      .sprite(x, y, type + "-" + mcAnimTypes.IDLE)
      .setCollideWorldBounds(true)
      .setBodySize(30, 45, true)
      .setDepth(300);
    if (type === "iroh") this._sprite.setOffset(56, 19);
    if (type === "jack") this._sprite.setOffset(85, 77);

    this._attackrect = scene.physics.add
      .sprite(500, 500, "attackrect")
      .setDisplaySize(280, 170)
      .setVisible(false);

    (this._attackrect.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    playerAttackListener(this);
    console.log(`player ${this.index} created in scene`, scene.scene.key);
  }

  onTookHit(_damage: number) {
    if (CanlıIsDead(this.character))
      mcEvents.emit(mcEventTypes.DIED, this.index);
  }

  onDied() {
    killCharacter(this);
  }

  update(_time: number, _delta: number) {
    playerMovementUpdate(this);
  }

  animKey(key: string) {
    const type = this.character.type;
    const prefix = this.character.prefix;
    return prefix + type + "-" + key;
  }

  play(key: string, ignoreIfPlaying?: boolean) {
    this.sprite.anims.play(this.animKey(key), ignoreIfPlaying);
    // play("jack-idle") play("iroh-idle") play("fireiroh-idle")
  }

  destroy() {
    this.sprite.destroy();
    this.attackrect.destroy();
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

  get sessionId() {
    return getOrThrow(this._sessionId, "SessionId");
  }
}
