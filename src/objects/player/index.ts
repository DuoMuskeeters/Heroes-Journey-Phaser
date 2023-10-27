import {
  type Character,
  CanlıIsDead,
  type CharacterType,
} from "../../game/Karakter";
import {
  type PressingKeys,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
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
  public pressingKeys!: PressingKeys;

  clearKeys() {
    this.pressingKeys = {
      W: false,
      A: false,
      D: false,
      E: false,
      Q: false,
      Space: false,
    };
  }

  getKeys() {
    // return the key name if true
    return Object.keys(this.pressingKeys).filter(
      (key) => this.pressingKeys[key as keyof PressingKeys]
    ) as (keyof PressingKeys)[];
  }

  constructor(public character: T, public _sessionId?: string) {
    this.clearKeys();
  }

  create(scene: Phaser.Scene, x: number, y: number, i: number) {
    const type = this.character.type;
    this._index = i;
    this._scene = scene;
    this._sprite = scene.matter.add
      .sprite(x, y, type + "-" + mcAnimTypes.IDLE, undefined, {
        label: type,
        shape: {
          type: "rectangle",
          width: 30,
          height: 50,
        },
        render: {
          sprite: {
            yOffset: -0.02,
          },
        },
      })
      .setDepth(300)
      .setFixedRotation();

    this._attackrect = scene.matter.add
      .sprite(0, 0, "attackrect", undefined, {
        label: "attackrect",
        shape: {
          type: "rectangle",
          width: 110,
          height: 50,
        },
        ignoreGravity: true,
        isSensor: true,
      })
      .setVisible(false);

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
    console.log("[Player.index] onCharacterChange", type);
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

  isMainPlayer() {
    return this.index === 0;
  }

  reduceIndex(by = 1) {
    getOrThrow(this._index, "Index");
    this._index! -= by;
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
