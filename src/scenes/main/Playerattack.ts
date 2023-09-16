import {
  GoblinTookHit,
  goblinEvents,
  goblinEventsTypes,
} from "../../game/types/events";
import { mcAnimTypes } from "../../game/types/types";
import MobController from "./mobController";

export function playerAttackListener(mobController: MobController) {
  mobController.scene.player.sprite.on(
    Phaser.Animations.Events.ANIMATION_STOP,
    (animation: Phaser.Animations.Animation) => {
      const goblin = mobController.mob.goblin;
      const player = mobController.scene.player;

      if (!mobController.isMcHitting()) return;
      // mob yakında değilse direkt görmezden geliyoruz
      // BUG: mob yakında değilse attack 2 kullansak bile mana harcamıyor
      // çünkü mana harcama aşşağıda yapılıyor (scene.player.ultiDamage bu yaramıza bandajdı fakat kaldırdım.)
      // özetle: player attack1 ve attack2 mobController ile kontrol edilmemesi gerek
      // PlayerController üzerinden mobController.forEach(mob => mob.isMcHitting())
      // şeklinde kontrol edilmeli...
      // bu sayede 1- bir sürü moba aynı anda hasar verme veya 2- heavy strike mana harcama gibi sorunlar çözülebilir.
      // (1 aslında sorun değil çünkü şu anda her mobContoller kendi başına listener açıyo (bu çözümle 1000000 mob olsa sıçtık.))

      if (animation.key === mcAnimTypes.ATTACK_1) {
        const { damage, hit } = player.user.basicAttack(goblin);
        hit();

        goblinEvents.emit(goblinEventsTypes.TOOK_HIT, mobController.id, {
          damage,
          stun: false,
          fromJack: true,
        } satisfies GoblinTookHit);
      } else if (animation.key === mcAnimTypes.ATTACK_2) {
        const { damage, hit } = player.user.heavy_strike();
        if (!hit) throw new Error("player heavy strike not ready but used");
        hit(goblin);

        goblinEvents.emit(goblinEventsTypes.TOOK_HIT, mobController.id, {
          damage,
          stun: true,
          fromJack: true,
        } satisfies GoblinTookHit);
      }
    }
  );
}
