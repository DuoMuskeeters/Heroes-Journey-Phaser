import {
  Canlı,
  CanlıTakeDamage,
  Character,
  Iroh,
  IrohInComboTime,
  Jack,
  MobCanlı,
} from "./Karakter";
import { Spell, SpellRange } from "./spell";

type Attacker = Character | MobCanlı;

export function canlıHas(c: Attacker, spell: Spell<SpellRange>): boolean {
  if (spell.type === "basic") return true;

  if (c instanceof Character) {
    if (c instanceof Iroh) return c.state.SP >= c.QcostSP;
    if (c instanceof Jack) return c.lastQ + c.standByTime < Date.now();
    throw new Error(`unknown spell on has: ${spell.type}, ${spell.rangeType}`);
  }

  // mob
  return c.state.SP === c.state.max_sp;
}

export function canlıOnUse(c: Attacker, spell: Spell<SpellRange>) {
  // TODO: instanceof Goblin
  if (!canlıHas(c, spell))
    throw new Error(`${spell.type} attack için gerekli koşullar sağlanmadı.`);

  if (c instanceof Character) {
    if (c instanceof Iroh) {
      if (spell.type === "basic") {
        if (c.lastCombo === 2) c.lastCombo = 0;
        else if (IrohInComboTime(c)) c.lastCombo += 1;
        else c.lastCombo = 1;
        c.lastBasicAttack = Date.now();
      } else if (spell.type === "heavy") {
        c.state.SP = Math.max(c.state.SP - c.QcostSP, 0);
      }
    } else if (c instanceof Jack) {
      if (spell.type === "heavy") {
        c.lastQ = Date.now();
        c.state.SP = Math.max(c.state.SP - c.spCost, 0);
      }
    }
  } else c.state.SP = 0;
}

export function canlıDamage(c: Attacker, spell: Spell<SpellRange>): number {
  const damage = c.state.ATK;

  switch (spell.type) {
    case "basic":
      if (c instanceof Character) {
        if (c instanceof Iroh) {
          return IrohInComboTime(c) && c.lastCombo === 2
            ? damage * 0.4
            : damage * 0.3;
        } else if (c instanceof Jack) {
          return damage;
        }
        throw new Error(
          `unknown spell on damage: ${spell.type}, ${spell.rangeType}`
        );
      }

      // mob
      // TODO: instanceof for Goblin after [Symbol.hasInstance] is implemented
      return damage;
    case "heavy":
      if (c instanceof Character) {
        if (c instanceof Iroh) {
          return damage / 6;
        } else if (c instanceof Jack) {
          return damage * 2;
        }
        throw new Error(
          `unknown spell on damage: ${spell.type}, ${spell.rangeType}`
        );
      }

      // mob (goblin)
      return damage * 3;
  }
}

export function canlıHit(
  c: Attacker,
  spell: Spell<SpellRange>,
  enemy: Canlı | Canlı[] | undefined
) {
  const damage = canlıDamage(c, spell); // TODO: require enemy
  canlıOnUse(c, spell);

  if (!enemy) return;
  if (enemy instanceof Array) {
    return enemy.map((e) => CanlıTakeDamage(e, damage));
  }
  return CanlıTakeDamage(enemy, damage);
}
