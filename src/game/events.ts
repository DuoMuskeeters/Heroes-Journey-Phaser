export const eventTypes = {
  GAME_LOADED: "GAME_LOADED",
  PAUSE_TOGGLE_REQUESTED: "PAUSE_TOGGLE_REQUESTED",
} as const;

export const mcEventTypes = {
  DIED: "DIED",
  HEAVY_ATTACK_USED: "HEAVY_ATTACK_USED",
};
export const goblinEventsTypes = {
  TAKE_HİT: "TAKE_HİT",
  DIED: "DIED",
  SAW_MC: "SAW_MC",
  ULTI: "ULTI",
  ATTACKİNG: "ATTACKİNG",
};
export const gameEvents = new Phaser.Events.EventEmitter();
export const mcEvents = new Phaser.Events.EventEmitter();
export const goblinEvents = new Phaser.Events.EventEmitter();
