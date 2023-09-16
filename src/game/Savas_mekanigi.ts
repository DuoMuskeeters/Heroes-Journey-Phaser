import { Canlı, Mob, Warrior, Bird, Giant } from "./Karakter";

export function dodge(rate1: number, rate2: number): number {
  if (rate1 >= rate2) {
    let dodge_rate: number = (rate1 - rate2) / rate1;
    return dodge_rate;
  } else {
    return 0;
  }
}

export function fight(attacker: Canlı) {
  if (attacker instanceof Warrior) {
    let input: string = "q";
    if (input.toLowerCase() === "q") {
      let { damage, hit } = attacker.heavy_strike();
      if (!hit) {
        console.log("Yetersiz SP");
      } else {
        hit([]);
      }
      return damage;
    }
    if (input.toLowerCase() === "w") {
      console.log("Vitality Boost becerisi kullanıldı.");
      attacker.vitality_boost();
      console.log(
        `${attacker.state.name} karakterinin güncellenmiş HP değeri: ${attacker.state.HP}`
      );
      console.log(
        `${attacker.state.name} karakterinin güncellenmiş SP değeri: ${attacker.state.SP}`
      );
      return 0;
    }
  }

  // const reg = attacker.regenerationNew();
  // if (reg) {
  //   console.log(`karakter canı: ${attacker.state.HP}
  //   karakter spsi: ${attacker.state.SP}
  //   yenileme: hp: ${reg?.HP_reg} sp: ${reg?.SP_reg}`);
  //   reg.regenerate();
  // }
  return attacker.state.ATK;
}

export function fight_mechanics_with_turn(fighter: Warrior, mob: Mob) {
  const players: Canlı[] = [fighter, mob];
  let turn = 0;

  while (!fighter.isDead() || !mob.isDead()) {
    let attacker = players[turn];
    let defender = players[1 - turn];
    let dodge_rate = dodge(defender.state.ATKRATE, attacker.state.ATKRATE);
    let HP_reg = (attacker.state.HP_reg * attacker.state.max_hp) / 100;
    let SP_reg = (attacker.state.SP_reg * attacker.state.max_sp) / 100;
    if (attacker instanceof Mob) {
      let sonuc = mob.OnUltimate();
      if (sonuc === true) {
        if (attacker instanceof Giant) {
          attacker.giant_skill();
        }
        if (attacker instanceof Bird) {
          attacker.bird_skill();
        }
      }
    }
    if (dodge_rate >= Math.random()) {
      console.log(
        `${attacker.state.name} saldırısı ${defender.state.name} tarafından dodgelandı. `
      );
    } else {
      let damage: number = fight(attacker);
      damage = damage * (1 - defender.state.Armor);
      let Block = damage * defender.state.Armor;
      if (damage !== 0) {
        defender.state.HP = Math.max(0, defender.state.HP - damage);
        console.log(
          `${attacker.state.name} ${defender.state.name}a ${damage}(Blok (${Block})) hasar verdi`
        );
      }
      console.log(`${defender.state.name} canı ${defender.state.HP}`);
      attacker.state.HP = Math.min(
        attacker.state.max_hp,
        attacker.state.HP + HP_reg
      );
      attacker.state.SP = Math.min(
        attacker.state.max_sp,
        attacker.state.SP + SP_reg
      );
    }
    if (defender.isDead()) {
      if (defender === attacker) {
        console.log(`Öldün.`);
        return false;
      } else {
        console.log(
          `${defender.state.name} ${attacker.state.name} tarafından katledildi\n`
        );
        return true;
      }
    }
  }
  turn = 1 - turn;
}
function mob_fight(mob: Mob) {
  //ulti
  let sonuc = mob.OnUltimate();
  if (sonuc) {
    if (mob instanceof Giant) {
      mob.giant_skill();
    }
    if (mob instanceof Bird) {
      mob.bird_skill();
    }
  }
}

// export function Regeneration(fighter: Warrior) {
//   let HP_reg = (fighter.state.HP_reg * fighter.state.max_hp) / 100;
//   let SP_reg = (fighter.state.SP_reg * fighter.state.max_sp) / 100;
//   fighter.state.HP = Math.min(fighter.state.max_hp, fighter.state.HP + HP_reg);
//   fighter.state.SP = Math.min(fighter.state.max_sp, fighter.state.SP + SP_reg);
// }
