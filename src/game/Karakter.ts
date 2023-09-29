import { CONFIG } from "../PhaserGame";
import { baseTypes } from "./playerStats";
import { Spell, SpellRange } from "./spell";

export const defaultState = {
  HP: 200,
  max_hp: 200,
  max_sp: 100,
  SP: 100,
  ATK: 20,
  ATKRATE: 1,
} satisfies Partial<State>;

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

  static fromBaseTypes(baseTypes: baseTypes) {
    return new this({
      ...defaultState,
      ...baseTypes,
    });
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
  calculate_power() {
    this.state.calculate_power();
  }
}

export class Character extends Canlı {
  exp: number;
  level: number;
  stat_point: number;

  spellQ: Spell<any> = new Spell("heavy", SpellRange.SingleORNone, {
    has: () => false,
    damage: () => 0,
    hit: () => undefined,
  });

  basicAttack: Spell<any> = new Spell("basic", SpellRange.SingleORNone, {
    damage: () => this.state.ATK,
    hit: (rakip, damage) => rakip?._takeDamage(damage),
  });

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
  regeneration() {
    const reg = 0.025;
    const HP_reg: number = this.state.max_hp * reg;
    const SP_reg: number = this.state.max_sp * reg;
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

export class Iroh extends Character {
  ATK1_MS = CONFIG.physics.arcade.debug ? 2 * 1000 : 1000;
  lastCombo: 0 | 1 | 2 = 0;
  lastBasicAttack: Date | null = null;

  inComboTime() {
    return Date.now() - (this.lastBasicAttack?.getTime() ?? 0) < this.ATK1_MS;
  }

  basicAttack = new Spell("basic", SpellRange.SingleORNone, {
    damage: () => {
      const damage = this.state.ATK;
      return this.inComboTime() && this.lastCombo === 2
        ? damage * 0.4
        : damage * 0.3;
    },
    hit: (rakip, damage) => {
      if (this.lastCombo === 2) this.lastCombo = 0;
      else if (this.inComboTime()) this.lastCombo += 1;
      else this.lastCombo = 1;

      this.lastBasicAttack = new Date();
      return rakip?._takeDamage(damage);
    },
  });

  private QcostSP = 4.16;

  spellQ = new Spell("heavy", SpellRange.Multiple, {
    cancelable: true,
    has: () => this.state.SP >= this.QcostSP,
    damage: (rakipler) => rakipler.map((r) => this.state.ATK / 6),
    hit: (rakipler, damages) => {
      this.state.SP = Math.max(this.state.SP - this.QcostSP, 0);
      return rakipler.map((rakip, i) => rakip._takeDamage(damages[i]));
    },
  });
}

export class Jack extends Character {
  private lastQ: Date | null = null;
  private standByTime = CONFIG.physics.arcade.debug ? 100 : 5 * 1000;
  private spCost = CONFIG.physics.arcade.debug ? 5 : 50;

  basicAttack = new Spell("basic", SpellRange.Multiple, {
    damage: (rakipler) => rakipler.map((r) => this.state.ATK),
    hit: (rakipler, damages) => rakipler.map((r, i) => r._takeDamage(damages[i])),
  });
  // basicAttack = new Spell("basic", SpellRange.SingleORNone, {
  //   damage: () => this.state.ATK,
  //   hit: (rakip, damage) => rakip?._takeDamage(damage),
  // });

  spellQ = new Spell("heavy", SpellRange.Multiple, {
    has: () => (this.lastQ?.getTime() ?? 0) + this.standByTime < Date.now(),
    damage: (rakipler) => rakipler.map((r) => this.state.ATK * 3),
    hit: (rakipler, damages) => {
      this.lastQ = new Date();
      this.state.SP = Math.max(this.state.SP - this.spCost, 0);
      return rakipler.map(
        (rakip, i) =>
          (rakip.state.HP = Math.max(rakip.state.HP - damages[i], 0))
      );
    },
  });
}

export class Archer extends Character {
  arrowCount = 0;
}

export class MobCanlı extends Canlı {
  constructor(name: string, state: State, public tier: 1 | 2 | 3 | 4 = 1) {
    super(name, state);
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

  regeneration(hp_reg: number) {
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
    };
  }

  basicAttack = new Spell("basic", SpellRange.SingleORNone, {
    damage: () => this.state.ATK,
    hit: (rakip, damage) => {
      if (!(rakip instanceof Character))
        throw new Error("NOTE: şu anda mob sadece karaktere vurabilir.");

      return rakip?._takeDamage(damage);
    },
  });
}

export class Goblin extends MobCanlı {
  spellQ = new Spell("heavy", SpellRange.Multiple, {
    damage: (rakipler) => rakipler.map((r) => this.state.ATK * 3),
    has: () => this.state.SP === this.state.max_sp,
    onUse: () => (this.state.SP = 0),
    hit: (rakipler, damages) =>
      rakipler.map((rakip, i) => rakip._takeDamage(damages[i])),
  });
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
