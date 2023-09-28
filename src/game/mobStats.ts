import { Stats } from "fs";

export const STATS = {
  goblin: {
    TIER_1: {
      Strength: 40,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
      hp_reg: 1.025,
    },
    
  },
};

type MobType = keyof typeof STATS;

export class MobNew {
  constructor(public type: MobType, public tier: 1 | 2 | 3 | 4) {}
}
