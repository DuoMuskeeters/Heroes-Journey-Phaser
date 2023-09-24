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

export const mcAnimTypes = {
  DEATH: "death",
  ATTACK_1_COMBO1: "attack1",
  ATTACK_1_COMBO2: "attack2",
  ATTACK_1_COMBO3: "attack3",
  Q: "iroh-Q",
  IDLE: "idle",
  RUN: "run",
  TAKE_HIT: "take-hit",
  JUMP: "jump",
  FALL: "fall",
} as const;

export type McAnimTypes = (typeof mcAnimTypes)[keyof typeof mcAnimTypes];
export const goblinAnimTypes = {
  TAKE_HIT: "goblin-takehit",
  DEATH: "goblin-death",
  RUN: "goblin-run",
  ULTI: "goblin-ulti",
  ATTACK: "goblin-attack",
  IDLE: "goblin-idle",
  BOMB: "goblin-bomb",
} as const;
export type GoblinAnimTypes =
  (typeof goblinAnimTypes)[keyof typeof goblinAnimTypes];
