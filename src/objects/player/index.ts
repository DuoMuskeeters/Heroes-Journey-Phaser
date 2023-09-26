import { Character, Iroh, Jack } from "../../game/Karakter";
import { mcEventTypes, mcEvents } from "../../game/types/events";
import { Direction, McAnimTypes, mcAnimTypes } from "../../game/types/types";
import { playerAttackListener } from "../../scenes/main/Playerattack";
import { getOrThrow } from "../utils";
import { killCharacter, playerMovementUpdate } from "./movements";

export function getCharacterType(character: Character) {
  return character instanceof Jack
    ? "jack"
    : character instanceof Iroh
    ? "iroh"
    : "unknown";
}

export class Player<T extends Character> {
  private _index?: number;
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _attackrect?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public lastdirection: Direction = Direction.right;

  constructor(public character: T) {}

  create(scene: Phaser.Scene, x: number, y: number, i: number) {
    const type = getCharacterType(this.character);

    this._index = i;
    this._scene = scene;
    this._sprite = scene.physics.add
      .sprite(x, y, type + "-" + mcAnimTypes.IDLE)
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
    this.listeners();
    console.log(`player ${this.index} created in scene`, scene.scene.key);
  }

  update(time: number, delta: number) {
    playerMovementUpdate(this);
  }

  play(key: McAnimTypes, ignoreIfPlaying?: boolean) {
    const type = getCharacterType(this.character);
    this.sprite.anims.play(type + "-" + key, ignoreIfPlaying);
    // play("jack-idle") play("iroh-idle")
  }

  destroy() {}
  listeners() {
    mcEvents.on(mcEventTypes.TOOK_HIT, (i: number) => {
      if (i !== this.index) return;
      if (this.character.isDead()) mcEvents.emit(mcEventTypes.DIED, i);
    });
    mcEvents.on(mcEventTypes.DIED, (i: number) => {
      if (i !== this.index) return;
      killCharacter(this);
    });

    this.destroy = () => {
      mcEvents.off(mcEventTypes.TOOK_HIT);
      mcEvents.off(mcEventTypes.DIED);
    };
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
