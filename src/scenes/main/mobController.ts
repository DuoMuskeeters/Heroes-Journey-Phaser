import { goblinEvents, goblinEventsTypes } from "../../game/events";
import { goblinMob } from "./Anims";
import { goblinHealtbar, goblinspbar } from "./Components";
import MainScene from "./MainScene";
import { jackattack } from "./Playerattack";
import { Direction, dirVelocity } from "./types";

export default class MobController {
  // 1 tane moba bakıyoz (index)
  scene: MainScene;
  mob: MainScene["goblin"];
  mobrect!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private mobattackrect!: Phaser.GameObjects.Rectangle;

  private goblinmod = 0;

  constructor(
    public index: number,
    public name: string,
    scene: MainScene,
    mob: MainScene["goblin"],
    mobrect: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    mobattackrect: Phaser.GameObjects.Rectangle
  ) {
    this.scene = scene;
    this.mob = mob;
    this.mobrect = mobrect;
    this.mobattackrect = mobattackrect;

    this.createAnimations();

    this.mob.sprite.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      const attackActive_Y_line =
        //@ts-ignore
        this.scene.rect.getBottomCenter().y >
        //@ts-ignore
        this.mobattackrect.getTopCenter().y;

      if (
        this.mob.sprite?.anims.getName() === "goblin-attack" &&
        scene.player.user.state.HP >= 0 &&
        attackActive_Y_line &&
        this.mob.Attacking &&
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
    });
  }

  canSeeMc() {
    return (
      Math.abs(this.scene.rect.x - this.mobrect.x) <=
      (300 / 1440) * window.innerWidth
    );
  }
  canHitMc() {
    return (
      Math.abs(this.scene.rect.x - this.mobrect.x) <
      (120 / 1440) * window.innerWidth
    );
  }

  update(dt: number) {
    this.mob.sprite.x = this.mobrect.x;
    this.mob.sprite.y = this.mobrect.y - (8 / 680) * window.innerHeight;

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
    } else {
      this.mob.Attacking = false;
      this.mob.SawMc = false;
      this.reset();
    }

    this.mobattackrect.x =
      this.mobrect.x +
      dirVelocity[this.mob.lastdirection] * (48 / 899) * window.innerWidth;
    this.mobattackrect.y = this.mobrect.y;
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
  }

  public reset() {
    this.mobrect.setVelocityX(0);
    if (this.mob.lastdirection === Direction.left) {
      this.mob.sprite.setFlipX(true);
    } else this.mob.sprite.setFlipX(false);

    this.mob.sprite.anims.play("goblin-ıdle", true);
    return this;
  }

  private runOnEnter() {
    if (this.mob.lastdirection === Direction.right) {
      this.mob.sprite.setFlipX(true);
    } else this.mob.sprite.setFlipX(false);
  }

  private runOnUpdate(dt: number) {
    const distanceofgoblin = this.mobrect.x - this.scene.rect.x > 0;
    this.goblinmod += 1;
    if (this.mobrect.body.onWall() && this.mob.SawMc) {
      this.mobrect.setVelocityY(-300);
    }
    if (distanceofgoblin && this.mob.SawMc) {
      this.mobrect.setVelocityX(-150);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play("goblin-run", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else if (this.mob.SawMc) {
      this.mobrect.setVelocityX(+150);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play("goblin-run", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    }
  }

  private attackOnEnter() {
    if (this.mob.lastdirection === Direction.right) {
      this.mob.sprite.setFlipX(true);
    } else this.mob.sprite.setFlipX(false);
  }

  private attackOnUpdate(dt: number) {
    const mobOnTheLeft = this.mobrect.x - this.scene.rect.x > 0;
    if (mobOnTheLeft && this.mob.Attacking) {
      this.mobrect.setVelocityX(0);
      this.mob.sprite.setFlipX(false);
      this.mob.lastdirection = Direction.left;
      this.mob.sprite.anims.play("goblin-attack", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    } else if (this.mob.Attacking) {
      this.mobrect.setVelocityX(0);
      this.mob.sprite.setFlipX(true);
      this.mob.lastdirection = Direction.right;
      this.mob.sprite.anims.play("goblin-attack", true);
      this.mob.sprite.anims.stopAfterRepeat(0);
    }
  }

  private handleStomped(
    goblinmob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    if (this.mobrect !== goblinmob) {
      return;
    }

    goblinEvents.off(goblinEventsTypes.DIED, this.handleStomped, this);

    this.scene.tweens.add({
      targets: this.mobrect,
      displayHeight: 0,
      y: this.mobrect.y + this.mobrect.displayHeight * 0.5,
      duration: 200,
      onComplete: () => {
        this.mobrect.destroy();
      },
    });

    // this.stateMachine.setState("goblin-death");
  }
}
