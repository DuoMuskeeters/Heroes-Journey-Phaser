export const eventTypes = {
  GAME_LOADED: "GAME_LOADED",
  PAUSE_TOGGLE_REQUESTED: "PAUSE_TOGGLE_REQUESTED",
} as const;

export const mcEventTypes = {
  DIED: "DIED",
  HEAVY_ATTACK_USED: "HEAVY_ATTACK_USED",
};
export const goblinEventsTypes = {
  TOOK_HIT: "TOOK_HIT",
  DIED: "DIED",
  STARTED_RUNNING: "STARTED_RUNNING",
  ULTI: "ULTI",
  ATTACKING: "ATTACKING",
};
export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const goblinEvents = new Phaser.Events.EventEmitter();
