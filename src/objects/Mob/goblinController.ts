import {
  GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { createGoblinBomb } from "../../scenes/main/Anims";
import { goblinHealtbar, goblinspbar } from "../../scenes/Ui/Components";
import MainScene from "../../scenes/main/MainScene";
import {
  Direction,
  GoblinAnimTypes,
  goblinAnimTypes,
  mcAnimTypes,
} from "../../game/types/types";
import { createCollider } from "../../scenes/main/TileGround";
import { Character, Giant } from "../../game/Karakter";
import { Player } from "../player";
import { MOB } from "./goblinobj";

export default class goblinController {
  private ıdletime = 0;
  goblin: MOB<Giant>;
  player: Player<Character>;
  private bomb?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public mobUI!: MainScene["mobUI"];
  /**
   * @returns true if mob is hitting player and attack animation is at first frame
   */
  private isMobHitting = () => {
    const atFrame = Number(this.goblin.sprite.anims.getFrameName()) === 0;

    const isAttacking =
      this.goblin.sprite.anims.getName() === goblinAnimTypes.ATTACK;

    const isOverlapping = this.goblin.scene.physics.overlap(
      this.goblin.attackrect,
      this.player.sprite
    );

    return isOverlapping && isAttacking && atFrame;
  };

  public isMcHitting = () => {
    const atFrame = Number(this.player.sprite.anims.getFrameName()) >= 4;
    const animsName = this.player.sprite.anims.getName() as
      | typeof mcAnimTypes.ATTACK_1
      | typeof mcAnimTypes.ATTACK_2;
    const isAttacking = [mcAnimTypes.ATTACK_1, mcAnimTypes.ATTACK_2].includes(
      animsName
    );

    const isOverlapping = this.goblin.scene.physics.overlap(
      this.goblin.sprite,
      this.player.attackrect
    );

    return isOverlapping && isAttacking && atFrame;
  };

  private isMcTouchingBomb() {
    const atFrame = Number(this.bomb?.anims.getFrameName()) === 6;

    const isOverlapping = this.goblin.scene.physics.overlap(
      this.player.sprite,
      this.bomb
    );

    return isOverlapping && atFrame;
  }
  private mobPlay = (animation: GoblinAnimTypes) => {
    if (animation !== goblinAnimTypes.DEATH && this.isDead()) return;
    this.goblin.sprite.anims.play(animation, true);
    this.goblin.sprite.anims.stopAfterRepeat(0);
  };

  private leftoRight = () => {
    return this.goblin.sprite.x - this.player.sprite.body.x > 0
      ? {
          velocity: {
            run: -150,
            ıdle: 0,
          },
          flip: false,
          Direction: Direction.left,
        }
      : {
          velocity: {
            run: 150,
            ıdle: 0,
          },
          flip: true,
          Direction: Direction.right,
        };
  };

  constructor(
    goblin: MOB<Giant>,
    player: Player<Character>,
    mobUI: MainScene["mobUI"]
  ) {
    this.goblin = goblin;
    this.mobUI = mobUI;
    this.player = player;

    this.goblin.sprite.on(
      Phaser.Animations.Events.ANIMATION_STOP,
      (animation: Phaser.Animations.Animation) => {
        if (this.isMobHitting()) {
          this.hitPlayer();
        }

        if (animation.key === goblinAnimTypes.TAKE_HIT) {
          goblin.sprite.anims.play(goblinAnimTypes.IDLE, true);
        }
        if (animation.key === goblinAnimTypes.ULTI) {
          goblin.mob.state.SP = 0;
          this.bomb = createGoblinBomb(goblin.scene, player);
          createCollider(this.bomb);
          this.bomb?.anims.play(goblinAnimTypes.BOMB, true);
          this.bomb?.anims.stopAfterRepeat(0);
          this.BombListener();
        }
        if (animation.key === goblinAnimTypes.DEATH) {
          goblin.sprite.removeAllListeners();
          goblin.sprite.destroy();
          mobUI.healtbar.destroy();
          mobUI.spbar.destroy();
          mobUI.hptitle.destroy();
          goblin.attackrect.destroy();
          mobEvents.emit(mobEventsTypes.DIED, this.goblin.id);
        }
      }
    );

    mobEvents.on(
      mobEventsTypes.TOOK_HIT,
      (index: number, details: GoblinTookHit) => {
        if (this.goblin.id === index && details.stun) {
          goblin.sprite.setVelocityX(0);
          this.mobPlay(goblinAnimTypes.TAKE_HIT);
        }
      }
    );
    mobEvents.on(mobEventsTypes.ULTI, (index: number) => {
      if (this.goblin.id === index) {
        goblin.sprite.setVelocityX(0);
        this.mobPlay(goblinAnimTypes.ULTI);
      }
    });
  }

  playerAlive() {
    return !this.player.character.isDead();
  }

  hitPlayer() {
    const player = this.player;
    const goblin = this.goblin.mob;

    const { damage, hit } = goblin.basicAttack(player.character);
    hit();

    mcEvents.emit(mcEventTypes.TOOK_HIT, damage);
  }

  BombListener() {
    this.bomb?.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (this.bomb?.anims.getName() === goblinAnimTypes.BOMB) {
        this.bomb?.destroy();
      }
    });

    this.bomb?.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
      if (this.isMcTouchingBomb()) {
        this.player.sprite.setVelocityX(0);
        this.player.sprite.anims.play(mcAnimTypes.TAKE_HIT, true);
        this.player.sprite.anims.stopAfterRepeat(0);
        this.goblin.mob.giant_skill().hit(this.player.character);
      }
    });
  }
  hasUltimate() {
    const { state } = this.goblin.mob;
    if (state.SP === state.max_sp && this.canSeeMc()) return true;
    return false;
  }

  isDead = () => this.goblin.mob.state.HP <= 0;

  OnStun() {
    if (this.goblin.sprite.body) {
      const animsKey = this.goblin.sprite?.anims.getName();
      return animsKey === goblinAnimTypes.TAKE_HIT;
    } else return false;
  }
  canSeeMc() {
    return (
      Math.abs(this.player.sprite.body.x - this.goblin.sprite.x) <= 300 &&
      !this.isDead() &&
      this.playerAlive()
    );
  }
  canHitMc() {
    const mcOntHeLeft =
      this.goblin.sprite.body.x - this.player.sprite.body.x > 0;
    let canHit = false;
    if (
      mcOntHeLeft &&
      this.player.sprite.body.center.x >=
        this.goblin.attackrect.getLeftCenter().x!
    ) {
      canHit = true;
    }
    if (
      !mcOntHeLeft &&
      this.player.sprite.body.center.x <=
        this.goblin.attackrect.getRightCenter().x!
    ) {
      canHit = true;
    }

    return canHit && !this.OnStun() && !this.hasUltimate() && this.canSeeMc();
  }

  update(dt: number) {
    if (this.isDead()) {
      this.mobPlay(goblinAnimTypes.DEATH);
    } else if (this.hasUltimate()) {
      mobEvents.emit(mobEventsTypes.ULTI, this.goblin.id);
    } else if (this.canHitMc()) {
      this.attackOnUpdate(dt);
      mobEvents.emit(mobEventsTypes.ATTACKING, this.goblin.id);
    } else if (this.canSeeMc() && !this.OnStun()) {
      this.runOnUpdate(dt);
      mobEvents.emit(mobEventsTypes.STARTED_RUNNING, this.goblin.id);
    } else if (!this.OnStun() && !this.isDead()) {
      this.ıdleOnUpdate(dt);
    }
    if (!this.canSeeMc()) {
      this.goblin.mob.state.SP = 0;
    }

    this.goblin.attackrect.setPosition(
      this.goblin.sprite.x,
      this.goblin.sprite.y
    );
    goblinspbar(this);
    goblinHealtbar(this);
  }

  private ıdleOnUpdate(dt: number) {
    this.ıdletime += dt;
    this.goblin.sprite.setVelocityX(0);

    if (this.ıdletime > 4000) {
      if (this.goblin.lastdirection === Direction.left) {
        this.goblin.sprite.setFlipX(true);
        this.goblin.lastdirection = Direction.right;
      } else {
        this.goblin.sprite.setFlipX(false);
        this.goblin.lastdirection = Direction.left;
      }
      this.ıdletime = 0;
    }
    this.mobPlay(goblinAnimTypes.IDLE);
  }

  private runOnUpdate(dt: number) {
    if (this.goblin.sprite.body.onWall()) {
      this.goblin.sprite.setVelocityY(-300);
    }
    const leftorRight = this.leftoRight();

    this.goblin.sprite.setVelocityX(leftorRight.velocity.run);
    this.goblin.sprite.setFlipX(leftorRight.flip);
    this.goblin.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.RUN);
  }

  private attackOnUpdate(dt: number) {
    if (this.goblin.mob.isDead()) return;
    const leftorRight = this.leftoRight();
    this.goblin.sprite.setVelocityX(leftorRight.velocity.ıdle);
    this.goblin.sprite.setFlipX(leftorRight.flip);
    this.goblin.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.ATTACK);
  }

  // private handleStomped(
  //   goblinmob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  // ) {
  //   if (this.mobrect !== goblinmob) {
  //     return;
  //   }

  //   goblinEvents.off(goblinEventsTypes.DIED, this.handleStomped, this);

  //   this.mainscene.tweens.add({
  //     targets: this.mobrect,
  //     displayHeight: 0,
  //     y: this.mobrect.y + this.mobrect.displayHeight * 0.5,
  //     duration: 200,
  //     onComplete: () => {
  //       this.mobrect.destroy();
  //     },
  //   });

  //   // this.stateMachine.setState("goblin-death");
  // }
}
