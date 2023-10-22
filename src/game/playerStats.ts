import { type CharacterType, State } from "./Karakter";

export type BaseTypes = {
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;
};

export const playerBaseStates = {
  jack: new State({
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  }),
  iroh: new State({
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  }),
} satisfies Record<CharacterType, State>;
