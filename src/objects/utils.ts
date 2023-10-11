export const getOrThrow = <T>(item: T | undefined, itemName: string) => {
  if (item === undefined)
    throw new Error(itemName + " is not defined, call create first");
  return item;
};

// https://stackoverflow.com/questions/72300909/how-to-restrict-an-array-to-have-every-member-of-an-enum-in-typescript
export type AllPermutations<T extends string | number> = [T] extends [never]
  ? []
  : {
      [K in T]: [K, ...AllPermutations<Exclude<T, K>>];
    }[T];
