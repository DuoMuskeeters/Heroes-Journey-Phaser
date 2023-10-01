import { State } from "./Karakter";

export type MobType = "goblin";
export type MobTier = 1 | 2 | 3 | 4;

export const mobStates = {
  goblin: {
    1: new State({
      Strength: 15,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
    }),
    2: new State({
      Strength: 25,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
    }),
    3: new State({
      Strength: 35,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
    }),
    4: new State({
      Strength: 45,
      Agility: 25,
      Intelligence: 25,
      Constitution: 60,
    }),
  },
} satisfies Record<MobType, Record<MobTier, State>>;
