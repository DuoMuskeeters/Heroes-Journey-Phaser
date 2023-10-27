import {
  type GoblinTookHit,
  mobEvents,
  mobEventsTypes,
  mcEventTypes,
  mcEvents,
} from "../../game/types/events";
import { createGoblinBomb } from "../../client/scenes/main/Anims";
import { goblinHealtbar, goblinspbar } from "../../client/scenes/Ui/Components";
import {
  direction,
  type GoblinAnimTypes,
  goblinAnimTypes,
  mcAnimTypes,
  playerVelocity,
  goblinVelocity,
} from "../../game/types/types";
import {
  CanlıIsDead,
  mobBasicAttack,
  type Character,
  type Goblin,
} from "../../game/Karakter";
import { type Mob } from ".";
import { type PlayerManager } from "../player/manager";

export default class goblinController {
  private ıdletime = 0;

  private bomb?: Phaser.Physics.Matter.Sprite;
  /**
   * @returns Array of true if mob is hitting player and attack animation is at first frame
   */
  private isMobHitting = () => {
    const atFrame = this.goblin.sprite.anims.currentFrame?.isLast;

    const isAttacking =
      this.goblin.sprite.anims.getName() === goblinAnimTypes.ATTACK;

    const isOverlapping = this.playerManager.map(({ player }) =>
      this.goblin.scene.matter.overlap(this.goblin.attackrect, [player.sprite])
    );

    if (!atFrame || !isAttacking) return this.playerManager.map(() => false);

    return isOverlapping;
  };

  public arePlayersHitting = (skipFrame = false) => {
    return this.playerManager.map(({ player }) => {
      const atFrame = player.sprite.anims.currentFrame?.isLast || skipFrame;
      const animsName = player.sprite.anims.getName();

      const isAttacking =
        animsName.includes(mcAnimTypes.ATTACK_1) || // includes all a1 combos
        animsName.includes(mcAnimTypes.ATTACK_2);

      const isOverlapping = this.goblin.scene.matter.overlap(
        this.goblin.sprite,
        [player.attackrect]
      );

      return isOverlapping && isAttacking && atFrame;
    });
  };

  private playersTouchingBomb() {
    if (!this.bomb) return this.playerManager.map(() => false);
    const atFrame = Number(this.bomb.anims.getFrameName()) === 6;
    return this.playerManager.map(
      ({ player }) =>
        this.goblin.scene.matter.overlap(player.sprite, [this.bomb!]) && atFrame
    );
  }
  private mobPlay = (animation: GoblinAnimTypes) => {
    if (animation !== goblinAnimTypes.DEATH && this.isDead()) return;
    this.goblin.sprite.anims.play(animation, true);
    this.goblin.sprite.anims.stopAfterRepeat(0);
  };

  public closestPlayer = () => {
    const sorted = this.playerManager.sort((a, b) => {
      const distanceA = Phaser.Math.Distance.BetweenPoints(
        this.goblin.sprite,
        a.player.sprite
      );
      const distanceB = Phaser.Math.Distance.BetweenPoints(
        this.goblin.sprite,
        b.player.sprite
      );
      return distanceA - distanceB;
    });

    return this.playerManager.findIndex(
      ({ player }) => player.sprite === sorted[0].player.sprite
    );
  };

  private leftoRight = () => {
    const index = this.closestPlayer();
    const { player } = this.playerManager[index];

    return this.goblin.sprite.x - player.sprite.x > 0
      ? {
          velocity: {
            run: -goblinVelocity.run,
            ıdle: 0,
          },
          flip: false,
          Direction: direction.left,
        }
      : {
          velocity: {
            run: goblinVelocity.run,
            ıdle: 0,
          },
          flip: true,
          Direction: direction.right,
        };
  };

  constructor(
    public goblin: Mob<Goblin>,
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
          goblin.mob.spellQ.onUse();
          this.bomb = createGoblinBomb(goblin.scene, player);
          this.bomb.anims.play(goblinAnimTypes.BOMB, true);
          this.bomb.anims.stopAfterRepeat(0);
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
          goblin.sprite.setVelocityX(goblinVelocity.takeHit);
          this.mobPlay(goblinAnimTypes.TAKE_HIT);
        }
      }
    );
    mobEvents.on(mobEventsTypes.ULTI, (index: number) => {
      if (this.goblin.id === index) {
        goblin.sprite.setVelocityX(goblinVelocity.hitting);
        this.mobPlay(goblinAnimTypes.ULTI);
      }
    });
  }

  playerAlive() {
    return this.playerManager.map(
      ({ player }) => !CanlıIsDead(player.character)
    );
  }

  hitPlayer(i: number) {
    const { player } = this.playerManager[i];
    const goblin = this.goblin.mob;

    const basicAttack = mobBasicAttack(goblin);

    const damage = basicAttack.damage(player.character);
    basicAttack.hit(player.character);

    mcEvents.emit(mcEventTypes.TOOK_HIT, i, damage);
  }

  BombListener() {
    this.bomb?.on(Phaser.Animations.Events.ANIMATION_STOP, () => {
      if (this.bomb?.anims.getName() === goblinAnimTypes.BOMB) {
        this.bomb?.destroy();
      }
    });

    this.bomb?.on(
      Phaser.Animations.Events.ANIMATION_UPDATE,
      (
        _anim: Phaser.Animations.Animation,
        _frame: Phaser.Animations.AnimationFrame
      ) => {
        const areTouchingBomb = this.playersTouchingBomb();
        const characters: Character[] = [];

        areTouchingBomb.forEach((isTouching, i) => {
          if (!isTouching) return;
          const { player } = this.playerManager[i];
          player.sprite.setVelocityX(playerVelocity.takeHit);
          player.play(mcAnimTypes.TAKE_HIT, true);
          player.sprite.anims.stopAfterRepeat(0);
          characters.push(player.character);
        });

        if (!characters.length) return;

        this.goblin.mob.spellQ.hit(characters); // giant skill hit is now Array instead of single character
      }
    );
  }
  hasUltimate = this.goblin.mob.spellQ.has;
  isDead = () => CanlıIsDead(this.goblin.mob);
  OnStun() {
    const animsKey = this.goblin.sprite?.anims.getName();
    return this.goblin.sprite.body && animsKey === goblinAnimTypes.TAKE_HIT;
  }

  canSeePlayer() {
    const playerAlive = this.playerAlive();

    return this.playerManager.map(
      ({ player }, i) =>
        Math.abs(player.sprite.x - this.goblin.sprite.x) <=
          this.goblin.attackrect.width * 6 &&
        Math.abs(player.sprite.y - this.goblin.sprite.y) <=
          this.goblin.attackrect.height * 2 &&
        !this.isDead() &&
        playerAlive[i]
    );
  }

  canHitPlayer() {
    const canSeePlayer = this.canSeePlayer();
    return this.playerManager.map(({ player }, i) => {
      const waitForUlti = !this.hasUltimate();
      const isOverlapping = this.goblin.scene.matter.overlap(
        this.goblin.attackrect,
        [player.sprite]
      );

      return isOverlapping && !this.OnStun() && waitForUlti && canSeePlayer[i];
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
    this.goblin.sprite.setVelocityX(goblinVelocity.idle);

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

  private runOnUpdate(_dt: number) {
    // TODO: port to matter physics
    // if (this.goblin.sprite.onWall()) {
    //   this.goblin.sprite.setVelocityY(goblinVelocity.climb);
    // }
    const leftorRight = this.leftoRight();

    this.goblin.sprite.setVelocityX(leftorRight.velocity.run);
    this.goblin.sprite.setFlipX(leftorRight.flip);
    this.goblin.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.RUN);
  }

  private attackOnUpdate(_dt: number) {
    if (this.isDead()) return;
    const leftorRight = this.leftoRight();
    this.goblin.sprite.setVelocityX(leftorRight.velocity.ıdle);
    this.goblin.sprite.setFlipX(leftorRight.flip);
    this.goblin.lastdirection = leftorRight.Direction;
    this.mobPlay(goblinAnimTypes.ATTACK);
  }
}
