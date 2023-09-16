import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { createGoblinBomb, createGoblinAnims } from "./Anims";
import { goblinHealtbar, goblinspbar } from "../Ui/Components";
import MainScene from "./MainScene";
import {
  Direction,
  goblinAnimTypes,
  mcAnimTypes,
} from "../../game/types/types";
import { createCollider } from "./TileGround";

export default class MobController {
  private ıdletime = 0;

  /**
   * @returns true if mob is hitting player and attack animation is at first frame
   */
  private isMobHitting = () => {
    const atFrame = Number(this.mob.sprite.anims.getFrameName()) === 0;

    const isAttacking =
      this.mob.sprite.anims.getName() === goblinAnimTypes.ATTACK;

    const isOverlapping = this.scene.physics.overlap(
      this.mob.attackrect,
      this.scene.player.sprite
    );

    return isOverlapping && isAttacking && atFrame;
  };

  public isMcHitting = () => {
    const atFrame = Number(this.scene.player.sprite.anims.getFrameName()) >= 4;
    const animsName = this.scene.player.sprite.anims.getName() as
      | typeof mcAnimTypes.ATTACK_1
      | typeof mcAnimTypes.ATTACK_2;
    const isAttacking = [mcAnimTypes.ATTACK_1, mcAnimTypes.ATTACK_2].includes(
      animsName
    );

    const isOverlapping = this.scene.physics.overlap(
      this.mob.sprite,
      this.scene.player.attackrect
    );

    return isOverlapping && isAttacking && atFrame;
  };

  private isMcTouchingBomb() {
    const atFrame = Number(this.mob.bomb.anims.getFrameName()) === 6;

    const isOverlapping = this.scene.physics.overlap(
      this.scene.player.sprite,
      this.mob.bomb
    );

    return isOverlapping && atFrame;
  }
  private mobPlay = (animation: string) => {
    this.mob.sprite.anims.play(animation, true);
    this.mob.sprite.anims.stopAfterRepeat(0);
  };

  private leftoRight = () => {
    return this.mob.sprite.x - this.scene.player.sprite.body.x > 0
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
    public id: number,
    public name: string,
    public scene: MainScene,
    public mob: MainScene["mob"]
  ) {
    this.scene = scene;
    this.mob = mob;

    this.createAnimations();

    this.mob.sprite.on(
      Phaser.Animations.Events.ANIMATION_STOP,
      (animation: Phaser.Animations.Animation) => {
        if (this.isMobHitting()) {
          this.hitPlayer();
        }

        if (animation.key === goblinAnimTypes.TAKE_HIT) {
          mob.sprite.anims.play(goblinAnimTypes.IDLE, true);
        }
        if (animation.key === goblinAnimTypes.ULTI) {
          mob.goblin.state.SP = 0;
          mob.bomb = createGoblinBomb(scene);
          createCollider(scene, mob.bomb, [scene.frontroad, scene.backroad]);
          this.mob.bomb.anims.play(goblinAnimTypes.BOMB, true);
          this.mob.bomb.anims.stopAfterRepeat(0);
          this.BombListener();
        }
        if (animation.key === goblinAnimTypes.DEATH) {
          mob.sprite.destroy();
          mob.sprite.removeAllListeners();
          mob.healtbar.destroy();
          mob.spbar.destroy();
          mob.hptitle.destroy();
          mob.attackrect.destroy();
          goblinEvents.emit(goblinEventsTypes.DIED, this.id);
        }
      }
    );

    goblinEvents.on(
      goblinEventsTypes.TOOK_HIT,
      (index: number, details: GoblinTookHit) => {
        if (this.id === index && details.stun) {
          mob.sprite.setVelocityX(0);
          this.mobPlay(goblinAnimTypes.TAKE_HIT);
        }
      }
    );
    goblinEvents.on(goblinEventsTypes.ULTI, (index: number) => {
      if (this.id === index) {
        mob.sprite.setVelocityX(0);
        this.mobPlay(goblinAnimTypes.ULTI);
      }
    });
  }

  playerAlive() {
    return !this.scene.player.user.isDead();
  }

  hitPlayer() {
    const player = this.scene.player.user;
    const goblin = this.mob.goblin;

    const { damage, hit } = goblin.basicAttack(player);
    hit();

    this.scene.player.hearticon.setTint(0x020000);
    this.scene.player.hptitle.setTint(0x020000);
    setTimeout(() => {
      this.scene.player.hearticon.setTint(0xffffff);
      this.scene.player.hptitle.clearTint();
    }, 400);

    mcEvents.emit(mcEventTypes.TOOK_HIT, damage);
  }

  BombListener() {
    this.mob.bomb.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (this.mob.bomb.anims.getName() === goblinAnimTypes.BOMB) {
        this.mob.bomb.destroy();
      }
    });

    this.mob.bomb.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
      if (this.isMcTouchingBomb()) {
        this.scene.player.sprite.setVelocityX(0);
        this.scene.player.sprite.anims.play(mcAnimTypes.TAKE_HIT, true);
        this.scene.player.sprite.anims.stopAfterRepeat(0);
        this.mob.goblin.giant_skill().hit(this.scene.player.user);
      }
    });
  }
  hasUltimate() {
    const { state } = this.mob.goblin;
    if (state.SP === state.max_sp && this.canSeeMc()) return true;
    return false;
  }

  isDead = () => this.mob.goblin.state.HP <= 0;

  OnStun() {
    if (this.mob.sprite.body) {
      const animsKey = this.mob.sprite?.anims.getName();
      return animsKey === goblinAnimTypes.TAKE_HIT;
    } else return false;
  }
  canSeeMc() {
    return (
      Math.abs(this.scene.player.sprite.body.x - this.mob.sprite.x) <= 300 &&
      !this.isDead() &&
      this.playerAlive()
    );
  }
  canHitMc() {
    const mcOntHeLeft =
      this.mob.sprite.body.x - this.scene.player.sprite.body.x > 0;
    let canHit = false;
    if (
      mcOntHeLeft &&
      this.scene.player.sprite.body.center.x >=
        this.mob.attackrect.getLeftCenter().x!
    ) {
      canHit = true;
    }
    if (
      !mcOntHeLeft &&
      this.scene.player.sprite.body.center.x <=
        this.mob.attackrect.getRightCenter().x!
    ) {
      canHit = true;
    }

    return canHit && !this.OnStun() && !this.hasUltimate() && this.canSeeMc();
  }

  update(dt: number) {
    if (this.isDead()) {
      this.mobPlay(goblinAnimTypes.DEATH);
    } else if (this.hasUltimate()) {
      goblinEvents.emit(goblinEventsTypes.ULTI, this.id);
    } else if (this.canHitMc()) {
      this.attackOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.ATTACKING, this.id);
    } else if (this.canSeeMc() && !this.OnStun()) {
      this.runOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.STARTED_RUNNING, this.id);
    } else if (!this.OnStun() && !this.isDead()) {
      this.ıdleOnUpdate(dt);
    }
    if (!this.canSeeMc()) {
      this.mob.goblin.state.SP = 0;
    }

    this.mob.attackrect.setPosition(this.mob.sprite.x, this.mob.sprite.y);
    goblinspbar(this);
    goblinHealtbar(this);
  }

  private createAnimations() {
    this.mob.healtbar = this.scene.add.graphics();
    this.mob.spbar = this.scene.add.graphics();
    this.mob.hptitle = this.scene.add
      .text(0, 0, `${this.mob.goblin.state.HP}`)
      .setStyle({
        fontSize: "22px Arial",
        color: "red",
        align: "center",
      })
      .setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif')
      .setFontStyle("bold");

    createGoblinAnims(this);
  }

  private ıdleOnUpdate(dt: number) {
    this.ıdletime += dt;
    this.mob.sprite.setVelocityX(0);

    if (this.ıdletime > 4000) {
      if (this.mob.lastdirection === Direction.left) {
        this.mob.sprite.setFlipX(true);
        this.mob.lastdirection = Direction.right;
      } else {
        this.mob.sprite.setFlipX(false);
        this.mob.lastdirection = Direction.left;
      }
      this.ıdletime = 0;
    }
    this.mobPlay(goblinAnimTypes.IDLE);
  }

  private runOnUpdate(dt: number) {
    if (this.mob.sprite.body.onWall()) {
      this.mob.sprite.setVelocityY(-300);
    }
    const leftorRight = this.leftoRight();

    this.mob.sprite.setVelocityX(leftorRight.velocity.run);
    this.mob.sprite.setFlipX(leftorRight.flip);
    this.mob.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.RUN);
  }

  private attackOnUpdate(dt: number) {
    if (this.mob.goblin.isDead()) return;
    const leftorRight = this.leftoRight();

    this.mob.sprite.setVelocityX(leftorRight.velocity.ıdle);
    this.mob.sprite.setFlipX(leftorRight.flip);
    this.mob.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.ATTACK);
  }

  // private handleStomped(
  //   goblinmob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  // ) {
  //   if (this.mobrect !== goblinmob) {
  //     return;
  //   }

  //   goblinEvents.off(goblinEventsTypes.DIED, this.handleStomped, this);

  //   this.scene.tweens.add({
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
