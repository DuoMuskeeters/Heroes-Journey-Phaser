export const mobStats = {
  goblin: {
    TIER_1: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 0.025,
    },
  },
} as const;

type MobType = keyof typeof mobStats;

export class MobNew {
  constructor(public type: MobType, public tier: 1 | 2 | 3 | 4) {}
}
