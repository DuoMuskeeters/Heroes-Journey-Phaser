import { Schema, type } from "@colyseus/schema";
import { type MobTier, mobStates } from "./mobStats";
import { type BaseTypes } from "./playerStats";
import { ExtractSpell, Passive, Spell, SpellDamage, SpellRange } from "./spell";

type Level = number;
type XP = number;

export function instanceCharacter(
  character: unknown,
  type: "any"
): character is Character;

export function instanceCharacter<T extends CharacterType>(
  character: unknown,
  type: T
): character is ExtractCharacter<T>;

export function instanceCharacter<T extends CharacterType>(
  character: unknown,
  type: T | "any"
): character is ExtractCharacter<T> {
  return (
    character instanceof Object &&
    "type" in character &&
    typeof character.type === "string" &&
    (character.type === type || type === "any")
  );
}

export class State extends Schema {
  // AUTO GENERATED
  @type("number") HP: number;
  @type("number") SP: number;
  @type("number") max_hp: number;
  @type("number") max_sp: number;
  @type("number") ATK: number;
  @type("number") ATKRATE: number;
  // END AUTO GENERATED

  @type("number") Strength: number;
  @type("number") Agility: number;
  @type("number") Intelligence: number;
  @type("number") Constitution: number;

  constructor({ Strength, Agility, Intelligence, Constitution }: BaseTypes) {
    super();
    this.Strength = Strength;
    this.Agility = Agility;
    this.Intelligence = Intelligence;
    this.Constitution = Constitution;

    // dummy initialize
    this.max_hp = 0;
    this.max_sp = 0;
    this.ATK = 0;
    this.ATKRATE = 0;
    // end dummy initialize
    this.calculate_power();

    this.HP = this.max_hp;
    this.SP = this.max_sp;
  }

  calculate_power() {
    this.max_hp = this.Constitution * 8;
    this.max_sp = this.Intelligence * 4;
    this.ATK = this.Strength * 0.8;
    this.ATKRATE = this.Agility * 0.08;
  }
}

export class Canlı extends Schema {
  @type("string") name: string;
  @type(State) state: State;
  /**
   * @internal use only
   * take damage until 0 HP
   */
  _takeDamage(damage: number) {
    return (this.state.HP = Math.max(0, this.state.HP - damage));
  }
  _heal({ hp = 0, sp = 0 }) {
    this.state.HP = Math.min(this.state.max_hp, this.state.HP + hp);
    this.state.SP = Math.min(this.state.max_sp, this.state.SP + sp);
  }

  constructor(name: string, state: State) {
    super();
    this.name = name;
    this.state = state;
  }
  isDead = () => Math.floor(this.state.HP) === 0;
}

export class Character extends Canlı {
  @type("string") type: CharacterType | "unknown" = "unknown";
  @type("number") exp: XP;
  @type("number") level: Level;
  @type("number") stat_point: number;
  @type("string") prefix = "";

  spellQ: Spell<SpellRange> = new Spell("heavy", SpellRange.SingleORNone, {
    has: () => false,
    damage: () => 0,
    hit: () => undefined,
  });

  basicAttack: Spell<SpellRange> = new Spell("basic", SpellRange.SingleORNone, {
    damage: () => this.state.ATK,
    hit: (rakip, damage) => rakip?._takeDamage(damage),
  });

  constructor(name: string, state: State, exp: XP = 0, level: Level = 1) {
    super(name, state);
    this.exp = exp;
    this.level = level;
    this.stat_point = level * 5;
  }

  static [Symbol.hasInstance](instance: unknown) {
    return instanceCharacter(instance, "any");
  }

  level_up() {
    const requirement_exp: XP = level_exp(this.level);
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
      this.state.calculate_power();
    }
  }

  private reg = 0.025;
  regeneration = new Passive({
    has: () => !this.isDead(),
    view: () => {
      const HP = this.state.max_hp * this.reg;
      const SP = this.state.max_sp * this.reg;
      return { HP, SP };
    },
    do: ({ HP, SP }) => this._heal({ hp: HP, sp: SP }),
  });
}

export function getCharacterClass(type: CharacterType | "unknown") {
  if (type === "unknown") throw new Error(`Unknown character type ${type}`);
  return CHARACTERS[type];
}

export function IrohInComboTime(iroh: Iroh) {
  return Date.now() - iroh.lastBasicAttack < iroh.ATK1_MS;
}

export function IrohTransform(iroh: Iroh) {
  const mode = iroh.prefix === "fire" ? "" : "fire";
  iroh.prefix = mode;
  iroh.state.calculate_power(); // always get the recent stats (fire iroh may have got increased stats recently)
  if (mode === "fire") {
    iroh.state.ATK *= 2;
  }
}

export class Iroh extends Character {
  type: "iroh" = "iroh";
  ATK1_MS = 1000;
  @type("uint8") lastCombo: 0 | 1 | 2 = 0;
  @type("number") lastBasicAttack: number = 0;
  prefix: "" | "fire" = "";

  basicAttack = new Spell("basic", SpellRange.SingleORNone, {
    damage: () => {
      const damage = this.state.ATK;
      return IrohInComboTime(this) && this.lastCombo === 2
        ? damage * 0.4
        : damage * 0.3;
    },
    hit: (rakip, damage) => {
      if (this.lastCombo === 2) this.lastCombo = 0;
      else if (IrohInComboTime(this)) this.lastCombo += 1;
      else this.lastCombo = 1;

      this.lastBasicAttack = Date.now();
      return rakip?._takeDamage(damage);
    },
  });

  @type("number") QcostSP = 4.16;

  spellQ = new Spell("heavy", SpellRange.Multiple, {
    cancelable: true,
    has: () => this.state.SP >= this.QcostSP,
    damage: (rakipler) => rakipler.map(() => this.state.ATK / 6),
    hit: (rakipler, damages) => {
      this.state.SP = Math.max(this.state.SP - this.QcostSP, 0);
      return rakipler.map((rakip, i) => rakip._takeDamage(damages[i]));
    },
  });

  static [Symbol.hasInstance](instance: unknown) {
    return instanceCharacter(instance, "iroh");
  }
}

export function JackBasicAttack(c: Jack) {
  return new Spell("basic", SpellRange.Multiple, {
    damage: (rakipler) => rakipler.map(() => c.state.ATK),
    hit: (rakipler, damages) =>
      rakipler.map((r, i) => r._takeDamage(damages[i])),
  });
}

export function JackSpeelQ(c: Jack) {
  return new Spell("heavy", SpellRange.Multiple, {
    has: () => c.lastQ + c.standByTime < Date.now(),
    damage: (rakipler) => rakipler.map(() => c.state.ATK * 3),
    hit: (rakipler, damages) => {
      c.lastQ = Date.now();
      c.state.SP = Math.max(c.state.SP - c.spCost, 0);
      return rakipler.map(
        (rakip, i) =>
          (rakip.state.HP = Math.max(rakip.state.HP - damages[i], 0))
      );
    },
  });
}

export class Jack extends Character {
  @type("number") lastQ: number = 0;
  @type("number") standByTime = 5 * 1000;
  @type("number") spCost = 50;

  basicAttack = new Spell("basic", SpellRange.Multiple, {
    damage: (rakipler) => rakipler.map(() => this.state.ATK),
    hit: (rakipler, damages) =>
      rakipler.map((r, i) => r._takeDamage(damages[i])),
  });
  // basicAttack = new Spell("basic", SpellRange.SingleORNone, {
  //   damage: () => this.state.ATK,
  //   hit: (rakip, damage) => rakip?._takeDamage(damage),
  // });

  spellQ = new Spell("heavy", SpellRange.Multiple, {
    has: () => this.lastQ + this.standByTime < Date.now(),
    damage: (rakipler) => rakipler.map(() => this.state.ATK * 3),
    hit: (rakipler, damages) => {
      this.lastQ = Date.now();
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

export const CHARACTERS = {
  jack: Jack,
  iroh: Iroh,
} as const;

export type CharacterType = keyof typeof CHARACTERS;
export type ExtractCharacter<T extends CharacterType> = InstanceType<
  (typeof CHARACTERS)[T]
>;

export class MobCanlı extends Canlı {
  constructor(public tier: MobTier = 1, name: string, state?: State) {
    super(name, state ?? new State(mobStates.goblin[tier]));
  }

  OnUltimate() {
    if (this.state.SP === this.state.max_sp) {
      this.state.SP -= this.state.max_sp;
      return true;
    }
    return false;
  }

  private HP_Reg = 0.001;
  private SP_Reg = 0.002;

  regeneration = new Passive({
    has: () => !this.isDead(),
    view: () => {
      const hp_reg = this.state.Intelligence * this.HP_Reg;
      const sp_reg = this.state.Intelligence * this.SP_Reg;
      const HP = this.state.max_hp * hp_reg;
      const SP = this.state.max_sp * sp_reg;
      return { HP, SP };
    },
    do: ({ HP, SP }) => this._heal({ hp: HP, sp: SP }),
  });

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
    damage: (rakipler) => rakipler.map(() => this.state.ATK * 3),
    has: () => this.state.SP === this.state.max_sp,
    onUse: () => {
      if (!(this.state.SP === this.state.max_sp)) throw new Error("SP yok");
      this.state.SP = 0;
    },
    hit: (rakipler, damages) =>
      rakipler.map((rakip, i) => rakip._takeDamage(damages[i])),
  });
}

// random mob eksik
export function level_exp(level: Level, n1 = 1.2, base_exp: XP = 100): XP {
  n1 = n1 + 0.002 * level;
  let requirement_exp = base_exp * n1 ** level;
  requirement_exp = Math.round(requirement_exp / 5) * 5;
  return requirement_exp;
}

export function mob_exp_kazancı(
  mob_level: Level,
  n1 = 1.2,
  base_exp: XP = 50
): XP {
  let mob_exp = base_exp * n1 ** mob_level;
  mob_exp = Math.round(mob_exp / 5) * 5;
  return mob_exp;
}
