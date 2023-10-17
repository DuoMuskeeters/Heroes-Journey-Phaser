import {
  type Character,
  CanlıIsDead,
  CharacterType,
} from "../../game/Karakter";
import { PressingKeys, mcEventTypes, mcEvents } from "../../game/types/events";
import { type Direction, direction, mcAnimTypes } from "../../game/types/types";
import { playerAttackListener } from "../../client/scenes/main/Playerattack";
import { getOrThrow } from "../utils";
import { killCharacter, playerMovementUpdate } from "./movements";

export class Player<T extends Character> {
  private _index?: number;
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Physics.Matter.Sprite;
  private _attackrect?: Phaser.Physics.Matter.Sprite;
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
    this._sprite = scene.matter.add
      .sprite(x, y, type + "-" + mcAnimTypes.IDLE)
      .setDepth(300)
      .setBody({})
      .setFixedRotation();

    this._attackrect = scene.matter.add
      .sprite(0, 0, "attackrect")
      .setDisplaySize(100, 70)
      .setVisible(false)
      .setSensor(true)
      .setIgnoreGravity(true);

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

  onCharacterChange(type: CharacterType | "unknown") {
    console.log("onCharacterChange", type);
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
