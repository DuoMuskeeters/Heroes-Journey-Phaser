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

export const mobEventsTypes = {
  TOOK_HIT: "TOOK_HIT",
  DIED: "DIED",
  STARTED_RUNNING: "STARTED_RUNNING",
  ULTI: "ULTI",
  ATTACKING: "ATTACKING",
  IDLE: "IDLE",
} as const;
export type MobEventsTypes =
  (typeof mobEventsTypes)[keyof typeof mobEventsTypes];
// Details
export type GoblinTookHit = {
  damage: number;
  stun: boolean;
  from: "jack" | "iroh" | "unknown";
};

export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const mobEvents = new Phaser.Events.EventEmitter();
