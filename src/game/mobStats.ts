export const mobStats = {
  goblin: {
    TIER_1: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 0.025,
    },
    //example  (not ready yet)
    TIER_2: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 0.025,
    },
    //example  (not ready yet)
    TIER_3: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 0.025,
    },
    //example  (not ready yet)
    TIER_4: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 0.025,
    },
  },
};
export type MobType = (typeof mobStats)[keyof typeof mobStats];

export class MobNew {
  constructor(public type: MobType, public tier: 1 | 2 | 3 | 4) {}
}
