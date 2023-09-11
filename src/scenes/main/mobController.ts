import { goblinEvents, goblinEventsTypes } from "../../game/types/events";
import { goblinMob } from "./Anims";
import { goblinHealtbar, goblinspbar } from "../Ui/Components";
import MainScene from "./MainScene";
import { jackattack } from "./Playerattack";
import { Direction, dirVelocity } from "../../game/types/types";

export default class MobController {
  scene: MainScene;
  mob: MainScene["goblin"];

  private goblinmod = 0;
  private ıdletime = 0;

  constructor(
    public index: number,
    public name: string,
    scene: MainScene,
    mob: MainScene["goblin"]
  ) {
    this.scene = scene;
    this.mob = mob;
   

    this.createAnimations();
    this.mob.stun = false;
    this.mob.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      const playerBodyTopY = Math.floor(scene.player.sprite.body.top);
      const attackrectBottomY = Math.floor(mob.attackrect.getBottomCenter().y!);
      const playerBodyBotY = Math.floor(scene.player.sprite.body.bottom);
      const attackrectTopY = Math.floor(mob.attackrect.getTopCenter().y!);
      const attackActive_Y_line =
        (playerBodyTopY <= attackrectBottomY &&
          playerBodyBotY >= attackrectBottomY) ||
        (playerBodyTopY <= attackrectTopY && playerBodyBotY >= attackrectTopY);

      if (
        this.mob.sprite?.anims.getName() === "goblin-attack" &&
        scene.player.user.state.HP >= 0 &&
        attackActive_Y_line &&
        Number(this.mob.sprite.anims.getFrameName()) < 2
      ) {
        this.scene.player.user.state.HP -=
          (1 - this.scene.player.user.state.Armor) * this.mob.mob.state.ATK;
        this.scene.player.hearticon.setTint(0x020000);
        this.scene.player.hptitle.setTint(0x020000);
        setTimeout(() => {
          this.scene.player.hearticon.setTint(0xffffff);
          this.scene.player.hptitle.clearTint();
        }, 400);
      }
      if (this.mob.sprite?.anims.getName() === "goblin-takehit") {
        this.mob.stun = false;
      }
    });
    goblinEvents.on(goblinEventsTypes.TOOK_HIT, (index: number) => {
      if (this.index === index) {
        mob.sprite.setVelocityX(0);
        this.mob.sprite.anims.play("goblin-takehit", true);
        this.mob.sprite.anims.stopAfterRepeat(0);
        this.mob.stun = true;
      }
    });
  }
  OnStun() {
    return this.mob.stun;
  }
  canSeeMc() {
    return (
      Math.abs(this.scene.player.sprite.body.x - this.mob.sprite.x) <=
        (300 / 1440) * window.innerWidth && !this.OnStun()
    );
  }
  canHitMc() {
    const mcOntHeLeft =
      this.mob.sprite.body.x - this.scene.player.sprite.body.x > 0;

    if (
      mcOntHeLeft &&
      this.scene.player.sprite.body.center.x >=
        this.mob.attackrect.getLeftCenter().x!
    ) {
      return true;
    }
    if (
      !mcOntHeLeft &&
      this.scene.player.sprite.body.center.x <=
        this.mob.attackrect.getRightCenter().x!
    ) {
      return true;
    }
  }

  update(dt: number) {
    if (this.canHitMc()) {
      this.mob.SawMc = true;
      this.mob.Attacking = true;
      this.attackOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.ATTACKING, this.index);
    } else if (this.canSeeMc()) {
      this.mob.SawMc = true;
      this.mob.Attacking = false;
      this.runOnUpdate(dt);
      goblinEvents.emit(goblinEventsTypes.STARTED_RUNNING, this.index);
    } else if (!this.OnStun()) {
      this.mob.Attacking = false;
      this.mob.SawMc = false;
      this.ıdleOnUpdate(dt);
    }

    this.mob.attackrect.setPosition(
      this.mob.sprite.x +
        dirVelocity[this.mob.lastdirection] * (5 / 1440) * window.innerWidth,
      this.mob.sprite.y + (5 / 900) * window.innerHeight
    );
    goblinspbar(this);
    goblinHealtbar(this);
  }

  private createAnimations() {
    this.mob.healtbar = this.scene.add.graphics();
    this.mob.spbar = this.scene.add.graphics();
    this.mob.hptitle = this.scene.add
      .text(0, 0, `${this.mob.mob.state.HP}`)
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
    goblinMob(this.scene, this.mob.mob.state.ATKRATE);
    setInterval(() => {
      this.mob.mob.mob_regeneration();
    }, 1000);
    jackattack(this);
    this.scene.physics.add.collider(
      [this.mob.sprite],
      [this.scene.backroad, this.scene.frontroad]
    );
  }

  private ıdleOnUpdate(dt: number) {
    this.ıdletime += dt;
    this.mob.sprite.setVelocityX(0);
    this.mob.attackrect.setVisible(false);
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
    this.mob.sprite.anims.play("goblin-ıdle", true);
  }

  private runOnUpdate(dt: number) {
    this.mob.attackrect.setVisible(false);
    const mcOntHeLeft = this.mob.sprite.x - this.scene.player.sprite.body.x > 0;
    this.goblinmod += 1;
    if (this.mob.sprite.body.onWall() && this.mob.SawMc) {
      this.mob.sprite.setVelocityY(-300);
    }
    if (mcOntHeLeft && this.mob.SawMc) {
      this.mob.sprite.setVelocityX((-150 / 1440) * window.innerWidth);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play("goblin-run", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else if (this.mob.SawMc) {
      this.mob.sprite.setVelocityX((+150 / 1440) * window.innerWidth);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play("goblin-run", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    }
  }

  private attackOnUpdate(dt: number) {
    const mcOntHeLeft = this.mob.sprite.x - this.scene.player.sprite.body.x > 0;
    this.mob.attackrect.setVisible(true);
    if (mcOntHeLeft && this.mob.Attacking) {
      this.mob.sprite.setVelocityX(0);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play("goblin-attack", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else if (this.mob.Attacking) {
      this.mob.sprite.setVelocityX(0);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play("goblin-attack", true);
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
