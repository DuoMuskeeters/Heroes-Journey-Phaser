export const direction = {
  left: "left",
  right: "right",
} as const;

export type Direction = (typeof direction)[keyof typeof direction];

// export function getDirVelocity(direction: Direction) {
//   return direction === "left" ? -1 : 1;
// }
export const playersAttackrect = {
  iroh: {
    attack1: {
      width: 15,
      height: 30,
      movemntOnXaxis: 13,
      movemntOnYaxis: 0,
    },
    attack1_Combo2: {
      width: 17.5,
      height: 40,
      movemntOnXaxis: 16,
      movemntOnYaxis: 5,
    },
    attack1_Combo3: {
      width: 15,
      height: 10,
      movemntOnXaxis: 30,
      movemntOnYaxis: -5,
    },
    attack2: {
      width: 17,
      height: 35,
      movemntOnXaxis: 43,
      movemntOnYaxis: 0,
    },
  },
  jack: {
    attack1: {
      width: 30,
      height: 45,
      movemntOnXaxis: 40,
      movemntOnYaxis: 10,
    },
    attack2: {
      width: 33,
      height: 33,
      movemntOnXaxis: 40,
      movemntOnYaxis: 5,
    },
  },
};
export const playerVelocity = {
  run: 2,
  jump: -4,
  fly: 2,
  hitting: 0,
  idle: 0,
  dead: 0,
  takeHit: 0,
} as const;

export const goblinVelocity = {
  run: 1.7,
  climb: -2,
  hitting: 0,
  idle: 0,
  dead: 0,
  takeHit: 0,
} as const;

export const dirVelocity: Record<Direction, number> = {
  left: -1,
  right: 1,
} as const;

export const mcAnimTypes = {
  DEATH: "death",
  ATTACK_1: "attack1",
  ATTACK_1_COMBO2: "attack1-combo2",
  ATTACK_1_COMBO3: "attack1-combo3",
  ATTACK_2: "attack2",
  IDLE: "idle",
  RUN: "run",
  TAKE_HIT: "take-hit",
  JUMP: "jump",
  FALL: "fall",
  TRANSFORM: "transform",
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
