export const eventTypes = {
  GAME_LOADED: "GAME_LOADED",
} as const;

export const mcEventTypes = {
  BASIC_ATTACK_USED: "BASIC_ATTACK_USED",
  HEAVY_ATTACK_USED: "HEAVY_ATTACK_USED",
  REGENERATED: "REGENERATED",
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
  REGENERATED: "REGENERATED",
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

export type Regenerated = {
  HP: number;
  SP: number;
};

export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const mobEvents = new Phaser.Events.EventEmitter();
