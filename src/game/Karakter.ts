export class State {
  name: string;
  Level: number;
  stat_point: number;
  HP: number;
  max_hp: number;
  max_sp: number;
  SP: number;
  ATK: number;
  ATKRATE: number;
  HP_reg: number;
  Armor: number;
  SP_reg: number;
  m_resist: number;
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;

  constructor({
    name,
    Level,
    stat_point,
    HP,
    max_hp,
    max_sp,
    SP,
    ATK,
    ATKRATE,
    HP_reg,
    Armor,
    SP_reg,
    m_resist,
    Strength,
    Agility,
    Intelligence,
    Constitution,
  }: {
    name: string;
    Level: number;
    stat_point: number;
    HP: number;
    max_hp: number;
    max_sp: number;
    SP: number;
    ATK: number;
    ATKRATE: number;
    HP_reg: number;
    Armor: number;
    SP_reg: number;
    m_resist: number;
    Strength: number;
    Agility: number;
    Intelligence: number;
    Constitution: number;
  }) {
    this.name = name;
    this.Level = Level;
    this.stat_point = stat_point;
    this.HP = HP;
    this.max_hp = max_hp;
    this.max_sp = max_sp;
    this.SP = SP;
    this.ATK = ATK;
    this.ATKRATE = ATKRATE;
    this.HP_reg = HP_reg;
    this.Armor = Armor;
    this.SP_reg = SP_reg;
    this.m_resist = m_resist;
    this.Strength = Strength;
    this.Agility = Agility;
    this.Intelligence = Intelligence;
    this.Constitution = Constitution;
  }
}

export class Canlı {
  state: State;

  constructor(state: State) {
    this.state = state;
  }
}

export class Character extends Canlı {
  exp: number;

  constructor(state: State, exp: number = 0) {
    super(state);
    this.exp = exp;
  }
  calculate_power() {
    this.state.HP = 100 + this.state.Constitution * 10;
    this.state.max_hp = this.state.HP;
    this.state.HP_reg = 5 + this.state.Constitution * 0.1;
    this.state.Armor =
      this.state.Constitution / (this.state.Constitution + 100);
    this.state.SP = 50 + this.state.Intelligence * 5;
    this.state.max_sp = this.state.SP;
    this.state.SP_reg = 2.5 + this.state.Intelligence;
    this.state.m_resist =
      this.state.Constitution / (this.state.Constitution + 100);
    this.state.ATK = 20 + this.state.Strength * 2;
    this.state.ATKRATE = 1 + this.state.Agility * 0.05;
  }

  level_up() {
    const requirement_exp: number = level(this.state.Level);
    while (this.exp < requirement_exp) {
      this.state.Level += 1;
      this.exp = this.exp - requirement_exp;
      this.state.stat_point += 5;
    }
    this.calculate_power();
  }
  // update stats icin arayuz gerekli
}

export function create_character(
  username: string,
  Level: number = 1
): Character {
  const Strength = 10;
  const Agility = 10;
  const Intelligence = 10;
  const Constitution = 10;
  const HP = 100 + Constitution * 10;
  const max_hp = HP;
  const HP_reg = 5 + Constitution * 0.1;
  const Armor = Constitution / (Constitution + 100);
  const SP = 50 + Intelligence * 5;
  const max_sp = SP;
  const SP_reg = 2.5 + Intelligence * 0.05;
  const m_resist = Constitution / (Constitution + 100);
  const ATK = 20 + Strength * 2;
  const ATKRATE = 1 + Agility * 0.05;

  const character_state: State = new State({
    name: username,
    Level,
    stat_point: 5 * Level,
    HP,
    max_hp,
    max_sp,
    SP,
    ATK,
    ATKRATE,
    HP_reg,
    Armor,
    SP_reg,
    m_resist,
    Strength,
    Agility,
    Intelligence,
    Constitution,
  });

  const character = new Character(character_state);
  character.calculate_power();

  return character;
}

export class Warrior extends Character {
  constructor(state: State, exp: number = 0) {
    super(state, exp);
  }
  heavy_strike(): number {
    if (this.state.SP >= 150) {
      const strike_damage = this.state.ATK * 2;
      this.state.SP -= 150;
      return strike_damage;
    } else {
      return this.state.ATK;
    }
  }
  vitality_boost() {
    this.state.HP = this.state.max_hp * 0.35 + this.state.HP;
    this.state.SP = this.state.max_sp * 0.35 + this.state.SP;
    this.state.HP = Math.min(this.state.HP, this.state.max_hp);
    this.state.SP = Math.min(this.state.SP, this.state.max_sp);
  }
}

export class Mob extends Canlı {
  constructor(state: State) {
    super(state);
  }
  calculate_mob_power() {
    this.state.HP = 100 + this.state.Constitution * 10;
    this.state.max_hp = this.state.HP;
    this.state.HP_reg = 5 + this.state.Constitution * 0.1;
    this.state.Armor =
      this.state.Constitution / (this.state.Constitution + 100);
    this.state.max_sp = 150 - this.state.Intelligence * 0.5;
    this.state.SP = 0;
    this.state.SP_reg = 10 + this.state.Intelligence * 0.5;
    this.state.m_resist =
      this.state.Constitution / (this.state.Constitution + 100);
    this.state.ATK = 20 + this.state.Strength * 2;
    this.state.ATKRATE = 1 + this.state.Agility * 0.05;
  }
  skill_barı() {
    this.state.SP_reg = (this.state.max_sp * this.state.SP_reg) / 100;
    this.state.SP += this.state.SP_reg;
    if (this.state.SP >= this.state.max_sp) {
      this.state.SP -= this.state.max_sp;
      return true;
    } else {
      return false;
    }
  }
}

export class Giant extends Mob {
  constructor(state: State) {
    super(state);
  }

  giant_skill() {
    this.state.HP = Math.min(this.state.max_hp, this.state.HP * 1.55);
    this.state.HP_reg = this.state.HP_reg * 2;
    console.log(
      `${this.state.name} ın öfkesini hissediyorum.\n${this.state.name}ın can ve can yenılenmesı arttı.`
    );
  }
}
export function create_giant(Level: number): Giant {
  const name = `${Level} Level Giant`;
  let stat_point = Level * 5;
  let stat_turn: number = 2;
  let Strength = 10;
  let Agility = 2;
  let Intelligence = 10;
  let Constitution = 20;

  const HP = 100 + Constitution * 10;
  const max_hp = HP;
  const HP_reg = 5 + Constitution * 0.1;
  const Armor = Constitution / (Constitution + 100);
  const max_sp = 150 - Intelligence * 0.5;
  const SP = 0;
  const SP_reg = 10 + Intelligence * 0.5;
  const m_resist = Constitution / (Constitution + 100);
  const ATK = 20 + Strength * 2;
  const ATKRATE = 1 + Agility * 0.05;

  while (stat_point > 0) {
    if (stat_turn == 0) {
      Strength += 1;
      stat_turn += 2;
    } else {
      Constitution += 1;
      stat_turn -= 1;
    }
    stat_point -= 1;
  }

  let giant_state: State = new State({
    name,
    Level,
    stat_point,
    HP,
    max_hp,
    max_sp,
    SP,
    ATK,
    ATKRATE,
    HP_reg,
    Armor,
    SP_reg,
    m_resist,
    Strength,
    Agility,
    Intelligence,
    Constitution,
  });

  const giant = new Giant(giant_state);
  giant.calculate_mob_power();

  return giant;
}

export class Bird extends Mob {
  constructor(state: State) {
    super(state);
  }
  bird_skill() {
    this.state.Agility = this.state.Agility * 1.5;
    this.state.ATK = this.state.ATK * 1.5;
    console.log(
      `${this.state.name} ın gıderek agresıfleşiyor.\n${this.state.name})ın saldırı hızı ve gucu arttı.`
    );
  }
}
export function create_bird(Level: number): Bird {
  const name = `${Level} Level Bird`;
  let stat_point = Level * 5;
  let stat_turn: number = 3;
  let Strength = 5;
  let Agility = 20;
  let Intelligence = 10;
  let Constitution = 5;

  const HP = 100 + Constitution * 10;
  const max_hp = HP;
  const HP_reg = 5 + Constitution * 0.1;
  const Armor = Constitution / (Constitution + 100);
  const max_sp = 150 - Intelligence * 0.5;
  const SP = 0;
  const SP_reg = 10 + Intelligence * 0.5;
  const m_resist = Constitution / (Constitution + 100);
  const ATK = 20 + Strength * 2;
  const ATKRATE = 1 + Agility * 0.05;

  while (stat_point > 0) {
    if (stat_turn == 0) {
      Constitution += 1;
      stat_turn += 3;
    }
    if (stat_turn == 1) {
      Strength += 1;
      stat_turn -= 1;
    } else {
      Agility += 1;
      stat_turn -= 1;
    }
    stat_point -= 1;
  }
  let bird_state: State = new State({
    name,
    Level,
    stat_point,
    HP,
    max_hp,
    max_sp,
    SP,
    ATK,
    ATKRATE,
    HP_reg,
    Armor,
    SP_reg,
    m_resist,
    Strength,
    Agility,
    Intelligence,
    Constitution,
  });

  const bird = new Bird(bird_state);
  bird.calculate_mob_power();

  return bird;
}
// random mob eksik
export function level(
  level: number,
  n1: number = 1.2,
  base_exp: number = 100
): number {
  n1 = n1 + 0.002 * level;
  let requirement_exp = base_exp * n1 ** level;
  requirement_exp = Math.round(requirement_exp / 5) * 5;
  return requirement_exp;
}
