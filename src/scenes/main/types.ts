export const Direction = {
  left: "left",
  right: "right",
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

// export function getDirVelocity(direction: Direction) {
//   return direction === "left" ? -1 : 1;
// }
export const dirVelocity: Record<Direction, number> = {
  left: -1,
  right: 1,
} as const;
