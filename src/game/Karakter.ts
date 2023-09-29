import { CONFIG } from "../PhaserGame";
import { baseTypes } from "./playerStats";

export class State {
  HP: number;
  max_hp: number;
  max_sp: number;
  SP: number;
  ATK: number;
  ATKRATE: number;
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;

  constructor({
    HP,
    max_hp,
    max_sp,
    SP,
    ATK,
    ATKRATE,
    Strength,
    Agility,
    Intelligence,
    Constitution,
  }: {
    HP: number;
    max_hp: number;
    max_sp: number;
    SP: number;
    ATK: number;
    ATKRATE: number;
    Strength: number;
    Agility: number;
    Intelligence: number;
    Constitution: number;
  }) {
    this.HP = HP;
    this.max_hp = max_hp;
    this.max_sp = max_sp;
    this.SP = SP;
    this.ATK = ATK;
    this.ATKRATE = ATKRATE;
    this.Strength = Strength;
    this.Agility = Agility;
    this.Intelligence = Intelligence;
    this.Constitution = Constitution;
  }
  calculate_power() {
    this.max_hp = this.Constitution * 8;
    this.max_sp = this.Intelligence * 4;
    this.ATK = this.Strength * 0.8;
    this.ATKRATE = this.Agility * 0.004;
    this.HP = this.max_hp;
    this.SP = this.max_sp;
  }
}

export class Canlı {
  name: string;
  state: State;
  /**
   * @internal use only
   * take damage until 0 HP
   */
  _takeDamage(damage: number) {
    return (this.state.HP = Math.max(0, this.state.HP - damage));
  }

  constructor(name: string, state: State) {
    this.name = name;
    this.state = state;
    this.calculate_power();
  }
  isDead = () => Math.floor(this.state.HP) === 0;

  /**
   * known as ATTACK_1 for all Canlı
   * @note should be overwritten for each exotic Canlı if needed
   *
   * @example const { damage, hit } = this.basicAttak(rakip);
   * console.log(damage);
   * const lastHp = hit(rakip);
   *
   */

  basicAttack(rakip?: Canlı) {
    const damage = this.state.ATK;
    return {
      damage,
      hit: () => rakip?._takeDamage(damage) ?? 0,
    };
  }

  calculate_power() {
    this.state.calculate_power();
  }
}

export class Character extends Canlı {
  exp: number;
  level: number;
  stat_point: number;

  constructor(name: string, state: State, exp: number = 0, level: number = 1) {
    super(name, state);
    this.exp = exp;
    this.level = level;
    this.stat_point = level * 5;
  }

  level_up() {
    const requirement_exp: number = level_exp(this.level);
    while (this.exp > requirement_exp) {
      this.level += 1;
      this.exp = this.exp - requirement_exp;
      this.stat_point += 5;
    }
  }
  increase(stat: "Strength" | "Agility" | "Intelligence" | "Constitution") {
    if (this.stat_point > 0) {
      this.state[stat] += 1;
      this.stat_point -= 1;
      this.calculate_power();
    }
  }
  regenerationCharacter() {
    const reg = 0.025;
    const HP_reg: number = this.state.HP * reg;
    const SP_reg: number = this.state.SP * reg;
    if (!this.isDead()) {
      return {
        HP_reg,
        SP_reg,
        regenerate: () => {
          this.state.HP = Math.min(this.state.max_hp, this.state.HP + HP_reg);
          this.state.SP = Math.min(this.state.max_sp, this.state.SP + SP_reg);
        },
      };
    }
    return {
      HP_reg,
      SP_reg,
    };
  }
}

export function createState(baseStats: baseTypes): State {
  const _ = baseStats;
  const canlıState: State = new State({
    HP: 200,
    max_hp: 200,
    max_sp: 100,
    SP: 100,
    ATK: 20,
    ATKRATE: 1,
    Strength: _.Strength,
    Agility: _.Agility,
    Constitution: _.Constitution,
    Intelligence: _.Intelligence,
  });

  return new State(canlıState);
}

export class Iroh extends Character {
  ATK1_MS = CONFIG.physics.arcade.debug ? 2 * 1000 : 1000;
  lastCombo: 0 | 1 | 2 = 0;
  lastBasicAttack: Date | null = null;

  inComboTime() {
    return Date.now() - (this.lastBasicAttack?.getTime() ?? 0) < this.ATK1_MS;
  }

  // Bu nedir hocam
  // öylesine yazmış -ali
  basicAttack_ = {
    damage: this.basicAttackDamage,
    hit: this.basicAttackHit,
  };

  basicAttackDamage(rakip?: Canlı) {
    const basic = super.basicAttack(rakip);

    return this.inComboTime() && this.lastCombo === 2
      ? basic.damage * 0.4
      : basic.damage * 0.3;
  }

  basicAttackHit(rakip?: Canlı) {
    const basic = super.basicAttack(rakip);
    switch (this.lastCombo) {
      case 0:
      case 1: {
        if (this.inComboTime()) {
          this.lastCombo += 1;
        } else {
          this.lastCombo = 1;
        }
        this.lastBasicAttack = new Date();
        return rakip?._takeDamage(basic.damage * 0.3) ?? 0;
      }

      case 2: {
        this.lastCombo = 0;
        if (this.inComboTime()) {
          this.lastBasicAttack = new Date();
          return rakip?._takeDamage(basic.damage * 0.4) ?? 0;
        }

        this.lastBasicAttack = new Date();
        return rakip?._takeDamage(basic.damage) ?? 0;
      }

      default:
        throw new Error("Combo sayısı 0, 1 veya 2 olmalıdır.");
    }
  }
  // heavy atackin sp dengesi henuz hazir degil
  spell_Q(chunk: number = 12) {
    const damage = (this.state.ATK * 2) / chunk;
    const spCost = 50 / chunk;

    if (this.state.SP >= spCost)
      return {
        damage,
        hit: (rakipler: Canlı[]) => {
          if (this.state.SP < spCost)
            throw new Error("Ulti için gerekli koşullar sağlanmadı.");
          this.state.SP = Math.max(this.state.SP - spCost, 0);
          return rakipler.map(
            (rakip) => (rakip.state.HP = Math.max(rakip.state.HP - damage, 0))
          );
        },
      };

    return {
      damage,
    };
  }
  spell_E() {
    const damage = this.state.ATK * 3;
    const spCost = 40;

    if (this.state.SP >= spCost)
      return {
        damage,
        hit: (rakipler: Canlı[]) => {
          if (this.state.SP < spCost)
            throw new Error("Ulti için gerekli koşullar sağlanmadı.");
          this.state.SP = Math.max(this.state.SP - spCost, 0);
          return rakipler.map(
            (rakip) => (rakip.state.HP = Math.max(rakip.state.HP - damage, 0))
          );
        },
      };

    return {
      damage,
    };
  }
}

export class Jack extends Character {
  private lastHeavyStrike: Date | null = null;
  spell_Q() {
    const spCost = CONFIG.physics.arcade.debug ? 5 : 50;
    const damage = this.state.ATK * 3;
    const standByTime = CONFIG.physics.arcade.debug ? 100 : 5 * 1000;

    const hasUlti = () =>
      (this.lastHeavyStrike?.getTime() ?? 0) + standByTime < Date.now();

    if (this.state.SP >= spCost && hasUlti())
      return {
        damage,
        standByTime,
        lastHeavyStrike: this.lastHeavyStrike,
        hit: (rakipler: Canlı[]) => {
          if (this.state.SP < spCost || !hasUlti())
            throw new Error("Ulti için gerekli koşullar sağlanmadı.");
          this.lastHeavyStrike = new Date();
          this.state.SP = Math.max(this.state.SP - spCost, 0);
          return rakipler.map(
            (rakip) => (rakip.state.HP = Math.max(rakip.state.HP - damage, 0))
          );
        },
      };

    return {
      damage,
      standByTime,
      lastHeavyStrike: this.lastHeavyStrike,
    };
  }
}

export class Archer extends Character {
  arrowCount = 0;
}

export class MobCanlı extends Canlı {
  tier: 1 | 2 | 3 | 4;
  constructor(name: string, state: State, tier: 1 | 2 | 3 | 4) {
    super(name, state);
    this.tier = tier ?? 1;
  }

  calculate_power() {
    super.calculate_power();
    this.state.max_sp = 100;
    this.state.SP = 0;
  }

  OnUltimate() {
    if (this.state.SP === this.state.max_sp) {
      this.state.SP -= this.state.max_sp;
      return true;
    }
    return false;
  }

  regenerationMob(hp_reg: number) {
    const sp_reg = this.state.Intelligence * 0.002;
    const SP_reg_value = sp_reg * 100;
    const HP_reg: number = this.state.HP * hp_reg;
    const SP_reg: number = this.state.SP * sp_reg;
    if (!this.isDead()) {
      return {
        HP_reg,
        SP_reg,
        regenerate: () => {
          this.state.HP = Math.min(this.state.max_hp, this.state.HP + HP_reg);
          this.state.SP = Math.min(
            this.state.max_sp,
            this.state.SP + SP_reg_value
          );
        },
      };
    }
    return {
      HP_reg,
      SP_reg,
      regenerate: () => console.log("🤷‍♂️"),
    };
  }

  basicAttack(rakip: Canlı) {
    if (!(rakip instanceof Character)) {
      throw new Error("NOTE: şu anda mob sadece karaktere vurabilir.");
    }

    return super.basicAttack(rakip);
  }
}

export class Goblin extends MobCanlı {
  hasUlti = () => this.state.SP === this.state.max_sp;
  goblin_skill() {
    const damage = this.state.ATK * 3;
    return {
      damage,
      consumeSP: () => (this.state.SP = 0),
      hit: (rakipler: Canlı[]) =>
        rakipler.map(
          (rakip) => (rakip.state.HP = Math.max(rakip.state.HP - damage, 0))
        ),
    };
  }
}

// random mob eksik
export function level_exp(
  level: number,
  n1: number = 1.2,
  base_exp: number = 100
): number {
  n1 = n1 + 0.002 * level;
  let requirement_exp = base_exp * n1 ** level;
  requirement_exp = Math.round(requirement_exp / 5) * 5;
  return requirement_exp;
}

export function mob_exp_kazancı(
  mob_level: number,
  n1 = 1.2,
  base_exp = 50
): number {
  let mob_exp = base_exp * n1 ** mob_level;
  mob_exp = Math.round(mob_exp / 5) * 5;
  return mob_exp;
}
