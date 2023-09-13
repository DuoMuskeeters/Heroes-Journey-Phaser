const STATS = {
  goblin: {
    TIER_1: {
      HP: 100,
      ATK: 2,
      REG: 0.25,
    },
    TIER_2: {
      HP: 200,
      ATK: 2.5,
      REG: 0.25,
    },
  },
  skeleton: {
    TIER_1: {
      HP: 100,
      ATK: 2,
      REG: 0.25,
    },
    TIER_2: {
      HP: 200,
      ATK: 2.5,
      REG: 0.25,
    },
  },
};

type MobType = keyof typeof STATS;

export class MobNew {
  constructor(public type: MobType, public tier: 1 | 2 | 3 | 4) {}
}
