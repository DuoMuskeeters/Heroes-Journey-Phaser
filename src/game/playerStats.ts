import { getCharacterType } from "../objects/player";
import { State } from "./Karakter";

export type baseTypes = {
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;
};

type PlayerTypes = Exclude<ReturnType<typeof getCharacterType>, "unknown">;

export const playerStats = {
  //example  (not ready yet)
  jack: {
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  },
  //example  (not ready yet)
  iroh: {
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  },
} satisfies Record<PlayerTypes, baseTypes>;

export const playerBaseStates = {
  jack: State.fromBaseTypes(playerStats.jack),
  iroh: State.fromBaseTypes(playerStats.iroh),
} satisfies Record<PlayerTypes, State>;
