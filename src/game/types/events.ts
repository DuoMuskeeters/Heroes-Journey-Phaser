export const eventTypes = {
  GAME_LOADED: "GAME_LOADED",
} as const;

export const mcEventTypes = {
  HEAVY_ATTACK_USED: "HEAVY_ATTACK_USED",
  DIED: "death",
  REGULAR_ATTACK: "attack1",
  ULTI: "attack2",
  IDLE: "ıdle",
  RUN: "run",
  TOOK_HIT: "take-hit",
  JUMP: "jump",
  FALL: "fall",
};

export type McEventTypes = (typeof mcEventTypes)[keyof typeof mcEventTypes];

export const goblinEventsTypes = {
  TOOK_HIT: "goblin-takehit",
  DIED: "goblin-death",
  STARTED_RUNNING: "goblin-run",
  ULTI: "goblin-bomb",
  ATTACKING: "goblin-attack",
  IDLE: "goblin-ıdle",
  BOMB: "goblin-attack-bomb",
} as const;

// Details
export type GoblinTookHit = {
  damage: number;
  stun: boolean;
  fromJack: true;
};

export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const goblinEvents = new Phaser.Events.EventEmitter();
