export const getOrThrow = <T>(item: T | undefined, itemName: string) => {
  if (item === undefined)
    throw new Error(itemName + " is not defined, call create first");
  return item;
};
