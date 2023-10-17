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

/**
 * @internal use only
 * take damage until 0 HP
 */
export function CanlıTakeDamage(c: Canlı | undefined, damage: number) {
  if (!c) return 0;
  return (c.state.HP = Math.max(0, c.state.HP - damage));
}

export function CanlıHeal(c: Canlı, { hp = 0, sp = 0 }) {
  c.state.HP = Math.min(c.state.max_hp, c.state.HP + hp);
  c.state.SP = Math.min(c.state.max_sp, c.state.SP + sp);
}

export function CanlıIsDead(c: Canlı) {
  return Math.floor(c.state.HP) === 0;
}

export class Canlı extends Schema {
  @type("string") name: string;
  @type(State) state: State;

  constructor(name: string, state: State) {
    super();
    this.name = name;
    this.state = state;
  }
}

export function CharacterLevelUp(c: Character) {
  const requirement_exp: XP = level_exp(c.level);
  while (c.exp > requirement_exp) {
    c.level += 1;
    c.exp = c.exp - requirement_exp;
    c.stat_point += 5;
  }
}

export function CharacterIncrease(c: Character, stat: keyof BaseTypes) {
  if (c.stat_point > 0) {
    c.state[stat] += 1;
    c.stat_point -= 1;
    c.state.calculate_power();
  }
}

export function CharacterSpellQ(c: Character) {
  if (c instanceof Iroh) return IrohSpeelQ(c);
  else if (c instanceof Jack) return JackSpeelQ(c);
}

export function CharacterSpellBasicAttack(c: Character) {
  if (c instanceof Iroh) return IrohBasicAttack(c);
  else if (c instanceof Jack) return JackBasicAttack(c);
}

export class Character extends Canlı {
  @type("string") type: CharacterType | "unknown" = "unknown";
  @type("number") exp: XP;
  @type("number") level: Level;
  @type("number") stat_point: number;
  @type("string") prefix = "";
  @type("number") reg = 0.025;

  constructor(name: string, state: State, exp: XP = 0, level: Level = 1) {
    super(name, state);
    this.exp = exp;
    this.level = level;
    this.stat_point = level * 5;
  }

  static [Symbol.hasInstance](instance: unknown) {
    return instanceCharacter(instance, "any");
  }
}

export function CharacterRegeneration(c: Character) {
  return new Passive({
    has: () => !CanlıIsDead(c),
    view: () => {
      const HP = c.state.max_hp * c.reg;
      const SP = c.state.max_sp * c.reg;
      return { HP, SP };
    },
    do: ({ HP, SP }) => CanlıHeal(c, { hp: HP, sp: SP }),
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
export function IrohBasicAttack(c: Iroh) {
  return new Spell("basic", SpellRange.SingleORNone, {
    damage: () => {
      const damage = c.state.ATK;
      return IrohInComboTime(c) && c.lastCombo === 2
        ? damage * 0.4
        : damage * 0.3;
    },
    hit: (rakip, damage) => {
      if (c.lastCombo === 2) c.lastCombo = 0;
      else if (IrohInComboTime(c)) c.lastCombo += 1;
      else c.lastCombo = 1;

      c.lastBasicAttack = Date.now();
      return CanlıTakeDamage(rakip, damage);
    },
  });
}

export function IrohSpeelQ(c: Iroh) {
  return new Spell("heavy", SpellRange.Multiple, {
    cancelable: true,
    has: () => c.state.SP >= c.QcostSP,
    damage: (rakipler) => rakipler.map(() => c.state.ATK / 6),
    hit: (rakipler, damages) => {
      c.state.SP = Math.max(c.state.SP - c.QcostSP, 0);
      return rakipler.map((rakip, i) => CanlıTakeDamage(rakip, damages[i]));
    },
  });
}

export class Iroh extends Character {
  type: "iroh" = "iroh";
  @type("number") ATK1_MS = 1000;
  @type("uint8") lastCombo: 0 | 1 | 2 = 0;
  @type("number") lastBasicAttack: number = 0;
  prefix: "" | "fire" = "";

  @type("number") QcostSP = 4.16;

  static [Symbol.hasInstance](instance: unknown) {
    return instanceCharacter(instance, "iroh");
  }
}

export function JackBasicAttack(c: Jack) {
  return new Spell("basic", SpellRange.Multiple, {
    damage: (rakipler) => rakipler.map(() => c.state.ATK),
    hit: (rakipler, damages) =>
      rakipler.map((r, i) => CanlıTakeDamage(r, damages[i])),
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
  type: "jack" = "jack";
  @type("number") lastQ: number = 0;
  @type("number") standByTime = 5 * 1000;
  @type("number") spCost = 50;

  static [Symbol.hasInstance](instance: unknown) {
    return instanceCharacter(instance, "jack");
  }
}

export class Archer extends Character {
  arrowCount = 0;
}

export const CHARACTERS = {
  iroh: Iroh,
  jack: Jack,
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

  HP_Reg = 0.001;
  SP_Reg = 0.002;
}

export function mobBasicAttack(c: MobCanlı) {
  return new Spell("basic", SpellRange.SingleORNone, {
    damage: () => c.state.ATK,
    hit: (rakip, damage) => {
      if (!(rakip instanceof Character))
        throw new Error("NOTE: şu anda mob sadece karaktere vurabilir.");

      return CanlıTakeDamage(rakip, damage);
    },
  });
}

export function mobRegeneration(c: MobCanlı) {
  return new Passive({
    has: () => !CanlıIsDead(c),
    view: () => {
      const hp_reg = c.state.Intelligence * c.HP_Reg;
      const sp_reg = c.state.Intelligence * c.SP_Reg;
      const HP = c.state.max_hp * hp_reg;
      const SP = c.state.max_sp * sp_reg;
      return { HP, SP };
    },
    do: ({ HP, SP }) => CanlıHeal(c, { hp: HP, sp: SP }),
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
      rakipler.map((rakip, i) => CanlıTakeDamage(rakip, damages[i])),
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
