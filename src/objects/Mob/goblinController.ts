import PhaserGame from "../../PhaserGame";

import {
  GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { createGoblinBomb } from "../../scenes/main/Anims";
import { goblinHealtbar, goblinspbar } from "../../scenes/Ui/Components";
import {
  direction,
  GoblinAnimTypes,
  goblinAnimTypes,
  mcAnimTypes,
} from "../../game/types/types";
import { createCollider } from "../../scenes/main/TileGround";
import { Character, Giant } from "../../game/Karakter";
import { Mob } from ".";
import { PlayerManager } from "../player/manager";
import MainScene from "../../scenes/main/MainScene";

export default class goblinController {
  private ıdletime = 0;

  private bomb?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  /**
   * @returns Array of true if mob is hitting player and attack animation is at first frame
   */
  private isMobHitting = () => {
    const atFrame = Number(this.goblin.sprite.anims.getFrameName()) === 0;

    const isAttacking =
      this.goblin.sprite.anims.getName() === goblinAnimTypes.ATTACK;

    const isOverlapping = this.playerManager.map(({ player }) =>
      this.goblin.scene.physics.overlap(this.goblin.attackrect, player.sprite)
    );

    if (!atFrame || !isAttacking) return this.playerManager.map(() => false);

    return isOverlapping;
  };

  public arePlayersHitting = () => {
    return this.playerManager.map(({ player }) => {
      const atFrame = Number(player.sprite.anims.getFrameName()) >= 4;
      const animsName = player.sprite.anims.getName() as
        | typeof mcAnimTypes.ATTACK_1
        | typeof mcAnimTypes.ATTACK_2;
      const isAttacking = [mcAnimTypes.ATTACK_1, mcAnimTypes.ATTACK_2].includes(
        animsName
      );

      const isOverlapping = this.goblin.scene.physics.overlap(
        this.goblin.sprite,
        player.attackrect
      );

      return isOverlapping && isAttacking && atFrame;
    });
  };

  private playersTouchingBomb() {
    const atFrame = Number(this.bomb?.anims.getFrameName()) === 6;

    return this.playerManager.map(
      ({ player }) =>
        this.goblin.scene.physics.overlap(player.sprite, this.bomb) && atFrame
    );
  }
  private mobPlay = (animation: GoblinAnimTypes) => {
    if (animation !== goblinAnimTypes.DEATH && this.isDead()) return;
    this.goblin.sprite.anims.play(animation, true);
    this.goblin.sprite.anims.stopAfterRepeat(0);
  };

  public closestPlayer = () => {
    let index = 0;
    let dist = Infinity;

    this.playerManager.forEach(({ player }, idx) => {
      if (player.character.isDead()) return;
      const distance = Math.abs(this.goblin.sprite.x - player.sprite.x);
      if (distance < dist) {
        dist = distance;
        index = idx;
      }
    });

    return index;
  };

  private leftoRight = () => {
    const index = this.closestPlayer();
    const { player } = this.playerManager[index];

    return this.goblin.sprite.x - player.sprite.body.x > 0
      ? {
          velocity: {
            run: -150,
            ıdle: 0,
          },
          flip: false,
          Direction: direction.left,
        }
      : {
          velocity: {
            run: 150,
            ıdle: 0,
          },
          flip: true,
          Direction: direction.right,
        };
  };

  constructor(
    public goblin: Mob<Giant>,
    public playerManager: PlayerManager,
    public mobUI = {
      healtbar: {} as Phaser.GameObjects.Graphics,
      hptitle: {} as Phaser.GameObjects.Text,
      spbar: {} as Phaser.GameObjects.Graphics,
    }
  ) {
    this.goblin.sprite.on(
      Phaser.Animations.Events.ANIMATION_STOP,
      (animation: Phaser.Animations.Animation) => {
        const isMobHitting = this.isMobHitting();
        const closestPlayer = this.closestPlayer();

        if (isMobHitting[closestPlayer]) {
          this.hitPlayer(closestPlayer);
        }

        if (animation.key === goblinAnimTypes.TAKE_HIT) {
          goblin.sprite.anims.play(goblinAnimTypes.IDLE, true);
        }
        if (animation.key === goblinAnimTypes.ULTI) {
          const { player } = this.playerManager[this.closestPlayer()];
          goblin.mob.giant_skill().consumeSP();
          this.bomb = createGoblinBomb(goblin.scene, player);
          // TODO: remove this line
          const mainscene = PhaserGame.scene.keys.mainscene as MainScene;
          createCollider(mainscene, this.bomb);

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
    return this.playerManager.map(({ player }) => !player.character.isDead());
  }

  hitPlayer(i: number) {
    const { player } = this.playerManager[i];
    const goblin = this.goblin.mob;

    const { damage, hit } = goblin.basicAttack(player.character);
    hit();

    mcEvents.emit(mcEventTypes.TOOK_HIT, i, damage);
  }

  BombListener() {
    this.bomb?.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (this.bomb?.anims.getName() === goblinAnimTypes.BOMB) {
        this.bomb?.destroy();
      }
    });

    this.bomb?.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
      const areTouchingBomb = this.playersTouchingBomb();
      const characters: Character[] = [];

      areTouchingBomb.forEach((isTouching, i) => {
        if (!isTouching) return;
        const { player } = this.playerManager[i];
        player.sprite.setVelocityX(0);
        player.sprite.anims.play(mcAnimTypes.TAKE_HIT, true);
        player.sprite.anims.stopAfterRepeat(0);
        characters.push(player.character);
      });

      this.goblin.mob.giant_skill().hit(characters); // giant skill hit is now Array instead of single character
    });
  }
  hasUltimate = this.goblin.mob.hasUlti;
  isDead = () => this.goblin.mob.isDead;
  OnStun() {
    const animsKey = this.goblin.sprite?.anims.getName();
    return this.goblin.sprite.body && animsKey === goblinAnimTypes.TAKE_HIT;
  }

  canSeePlayer() {
    const playerAlive = this.playerAlive();

    return this.playerManager.map(
      ({ player }, i) =>
        Math.abs(player.sprite.body.x - this.goblin.sprite.x) <= 300 &&
        !this.isDead() &&
        playerAlive[i]
    );
  }

  canHitPlayer() {
    const canSeePlayer = this.canSeePlayer();
    return this.playerManager.map(({ player }, i) => {
      const waitForUlti = !this.hasUltimate();
      const mcOntHeLeft = this.goblin.sprite.body.x - player.sprite.body.x > 0;
      let canHit = false;

      if (
        mcOntHeLeft &&
        player.sprite.body.center.x >= this.goblin.attackrect.getLeftCenter().x!
      ) {
        canHit = true;
      }
      if (
        !mcOntHeLeft &&
        player.sprite.body.center.x <=
          this.goblin.attackrect.getRightCenter().x!
      ) {
        canHit = true;
      }

      return canHit && !this.OnStun() && waitForUlti && canSeePlayer[i];
    });
  }

  update(dt: number) {
    const canHitPlayer = this.canHitPlayer();
    const canSeePlayer = this.canSeePlayer();

    const canSeeAnyPlayer = canSeePlayer.some(Boolean);
    const canHitClosestPlayer = canHitPlayer[this.closestPlayer()];

    if (this.isDead()) {
      this.mobPlay(goblinAnimTypes.DEATH);
    } else if (this.hasUltimate() && canSeeAnyPlayer) {
      mobEvents.emit(mobEventsTypes.ULTI, this.goblin.id);
    } else if (canHitClosestPlayer) {
      this.attackOnUpdate(dt);
      mobEvents.emit(mobEventsTypes.ATTACKING, this.goblin.id);
    } else if (canSeeAnyPlayer && !this.OnStun()) {
      this.runOnUpdate(dt);
      mobEvents.emit(mobEventsTypes.STARTED_RUNNING, this.goblin.id);
    } else if (!this.OnStun() && !this.isDead()) {
      this.ıdleOnUpdate(dt);
    }
    if (!canSeeAnyPlayer) {
      // TODO: slowly decrease sp (x/2 where x is default sp regen)
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
      if (this.goblin.lastdirection === direction.left) {
        this.goblin.sprite.setFlipX(true);
        this.goblin.lastdirection = direction.right;
      } else {
        this.goblin.sprite.setFlipX(false);
        this.goblin.lastdirection = direction.left;
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
