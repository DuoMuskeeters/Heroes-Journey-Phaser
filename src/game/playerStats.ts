export type baseTypes = {
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;
};

export const playerStats = {
  //example  (not ready yet)
  jack: {
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  } satisfies baseTypes,
  //example  (not ready yet)
  iroh: {
    Strength: 25,
    Agility: 25,
    Intelligence: 25,
    Constitution: 25,
  } satisfies baseTypes,
};
