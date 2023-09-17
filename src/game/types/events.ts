export const eventTypes = {
  GAME_LOADED: "GAME_LOADED",
} as const;

export const mcEventTypes = {
  BASIC_ATTACK_USED: "BASIC_ATTACK_USED",
  HEAVY_ATTACK_USED: "HEAVY_ATTACK_USED",
  TOOK_HIT: "TOOK_HIT",
  DIED: "DIED",
} as const;

export type McEventTypes = (typeof mcEventTypes)[keyof typeof mcEventTypes];

export const goblinEventsTypes = {
  TOOK_HIT: "TOOK_HIT",
  DIED: "DIED",
  STARTED_RUNNING: "STARTED_RUNNING",
  ULTI: "ULTI",
  ATTACKING: "ATTACKING",
  IDLE: "IDLE",
  BOMB: "BOMB",
} as const;
export type GoblinEventsTypes =
  (typeof goblinEventsTypes)[keyof typeof goblinEventsTypes];
// Details
export type GoblinTookHit = {
  damage: number;
  stun: boolean;
  fromJack: true;
};

export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const goblinEvents = new Phaser.Events.EventEmitter();
