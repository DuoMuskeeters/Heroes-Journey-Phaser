import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { createGoblinBomb, goblinMob } from "./Anims";
import { goblinHealtbar, goblinspbar } from "../Ui/Components";
import MainScene from "./MainScene";
import { playerAttackListener } from "./Playerattack";
import { Direction, dirVelocity } from "../../game/types/types";
import { createCollider } from "./TileGround";

export default class MobController {
  private goblinmod = 0;
  private ıdletime = 0;

  /**
   * @returns true if mob is hitting player and attack animation is at first frame
   */
  private isMobHitting = () => {
    const atFrame = Number(this.mob.sprite.anims.getFrameName()) === 0;

    const isAttacking =
      this.mob.sprite.anims.getName() === goblinEventsTypes.ATTACKING;

    const isOverlapping = this.scene.physics.overlap(
      this.mob.attackrect,
      this.scene.player.sprite
    );

    return isOverlapping && isAttacking && atFrame;
  };

  public isMcHitting = () => {
    const atFrame = Number(this.scene.player.sprite.anims.getFrameName()) >= 4;

    const isAttacking = [
      mcEventTypes.REGULAR_ATTACK,
      mcEventTypes.ULTI,
    ].includes(this.scene.player.sprite.anims.getName());

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

        if (animation.key === goblinEventsTypes.TOOK_HIT) {
          mob.sprite.anims.play(goblinEventsTypes.IDLE, true);
        }
        if (animation.key === goblinEventsTypes.ULTI) {
          mob.goblin.state.SP = 0;
          mob.bomb = createGoblinBomb(scene);
          createCollider(scene, mob.bomb, [scene.frontroad, scene.backroad]);
          this.mob.bomb.anims.play(goblinEventsTypes.BOMB, true);
          this.mob.bomb.anims.stopAfterRepeat(0);
          this.BombListener();
        }
        if (animation.key === goblinEventsTypes.DIED) {
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
          this.mob.sprite.anims.play(goblinEventsTypes.TOOK_HIT, true);
          this.mob.sprite.anims.stopAfterRepeat(0);
        }
      }
    );
    goblinEvents.on(goblinEventsTypes.ULTI, (index: number) => {
      if (this.id === index) {
        mob.sprite.setVelocityX(0);
        mob.sprite.anims.play(goblinEventsTypes.ULTI, true);
        mob.sprite.anims.stopAfterRepeat(0);
      }
    });
  }

  playerAlive() {
    return !this.scene.player.user.isDead();
  }

  hitPlayer() {
    const playerState = this.scene.player.user.state;
    const goblinState = this.mob.goblin.state;

    const damage = (1 - playerState.Armor) * goblinState.ATK;
    const hp = Math.max(playerState.HP - damage, 0);

    playerState.HP = hp;

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
      if (this.mob.bomb.anims.getName() === goblinEventsTypes.BOMB) {
        this.mob.bomb.destroy();
      }
    });

    this.mob.bomb.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
      if (this.isMcTouchingBomb()) {
        this.scene.player.sprite.anims.play(mcEventTypes.TOOK_HIT, true);
        this.scene.player.sprite.anims.stopAfterRepeat(0);
        this.scene.player.user.state.HP -= this.mob.goblin.giant_skill();
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
      return animsKey === goblinEventsTypes.TOOK_HIT;
    } else return false;
  }
  canSeeMc() {
    return (
      Math.abs(this.scene.player.sprite.body.x - this.mob.sprite.x) <=
        (300 / 1440) * window.innerWidth &&
      !this.OnStun() &&
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
      this.mob.sprite.anims.play(goblinEventsTypes.DIED, true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else if (this.hasUltimate()) {
      goblinEvents.emit(goblinEventsTypes.ULTI, this.id);
    } else if (this.canHitMc()) {
      this.attackOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.ATTACKING, this.id);
    } else if (this.canSeeMc()) {
      this.runOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.STARTED_RUNNING, this.id);
    } else if (!this.OnStun() && !this.isDead()) {
      this.ıdleOnUpdate(dt);
    }

    if (!this.canSeeMc()) {
      this.mob.goblin.state.SP = 0;
    }

    this.mob.attackrect.setPosition(
      this.mob.sprite.x +
        dirVelocity[this.mob.lastdirection] * (5 / 1440) * window.innerWidth,
      this.mob.sprite.y
    );
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
    this.mob.sprite = this.mob.sprite.setScale(
      (2.3 / 1328) * window.innerWidth,
      (2.7 / 787) * window.innerHeight
    );
    goblinMob(this);
    playerAttackListener(this);
    this.scene.physics.add.collider(
      [this.mob.sprite],
      [this.scene.backroad, this.scene.frontroad]
    );

    // this.scene.physics.add.overlap(this.mob.sprite,this.scene.player.sprite,()=>{
    //   console.log(1)
    // }
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
    this.mob.sprite.anims.play(goblinEventsTypes.IDLE, true);
  }

  private runOnUpdate(dt: number) {
    const mcOntHeLeft = this.mob.sprite.x - this.scene.player.sprite.body.x > 0;
    this.goblinmod += 1;
    if (this.mob.sprite.body.onWall()) {
      this.mob.sprite.setVelocityY(-300);
    }
    if (mcOntHeLeft) {
      this.mob.sprite.setVelocityX((-150 / 1440) * window.innerWidth);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play(goblinEventsTypes.STARTED_RUNNING, true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else {
      this.mob.sprite.setVelocityX((+150 / 1440) * window.innerWidth);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play(goblinEventsTypes.STARTED_RUNNING, true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    }
  }

  private attackOnUpdate(dt: number) {
    if (this.mob.goblin.isDead()) return;
    const mcOntHeLeft = this.mob.sprite.x - this.scene.player.sprite.body.x > 0;

    if (mcOntHeLeft) {
      this.mob.sprite.setVelocityX(0);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play(goblinEventsTypes.ATTACKING, true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else {
      this.mob.sprite.setVelocityX(0);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play(goblinEventsTypes.ATTACKING, true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    }
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
