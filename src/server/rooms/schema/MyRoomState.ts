import { Schema, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";

type BaseTypes = {
  Strength: number;
  Agility: number;
  Intelligence: number;
  Constitution: number;
};

export class CanlıState extends Schema {
  @type("number") HP: number;
  @type("number") SP: number;
  @type("number") max_hp: number;
  @type("number") max_sp: number;
  @type("number") ATK: number;
  @type("number") ATKRATE: number;

  @type("number") Strength: number;
  @type("number") Agility: number;
  @type("number") Intelligence: number;
  @type("number") Constitution: number;

  constructor({ Strength, Agility, Intelligence, Constitution }: BaseTypes) {
    super();
    this.Strength = Strength;
    this.Agility = Agility;
    this.Intelligence = Intelligence;
    this.Constitution = Constitution;

    // dummy initialize
    this.max_hp = 0;
    this.max_sp = 0;
    this.ATK = 0;
    this.ATKRATE = 0;
    // end dummy initialize
    this.calculate_power();

    this.HP = this.max_hp;
    this.SP = this.max_sp;
  }

  calculate_power() {
    this.max_hp = this.Constitution * 8;
    this.max_sp = this.Intelligence * 4;
    this.ATK = this.Strength * 0.8;
    this.ATKRATE = this.Agility * 0.004;
  }
}

export class Canlı extends Schema {
  @type("string") name: string;
  @type(CanlıState) state: CanlıState;
  @type("boolean") connected = true;

  constructor(name: string, state: CanlıState) {
    super();
    this.name = name;
    this.state = state;
  }

  /**
   * @internal use only
   * take damage until 0 HP
   */
  _takeDamage(damage: number) {
    return (this.state.HP = Math.max(0, this.state.HP - damage));
  }

  /**
   * @internal use only
   * heal until max HP
   */

  _heal({ hp = 0, sp = 0 }) {
    this.state.HP = Math.min(this.state.max_hp, this.state.HP + hp);
    this.state.SP = Math.min(this.state.max_sp, this.state.SP + sp);
  }

  isDead = () => Math.floor(this.state.HP) === 0;
}

export class MyRoomState extends Schema {
  @type("string") message: string = "Hello world";
  @type("string") message2: string = "Hello world";
  @type({ map: Canlı }) players = new MapSchema<Canlı>();

  getPlayer(client: Client): Canlı;
  getPlayer(sessionId: string, broadcast?: Client): Canlı;
  getPlayer(c: string | Client, broadcast?: Client) {
    const sessionId = typeof c === "string" ? c : c.sessionId;
    const player = this.players.get(sessionId);

    if (!player) {
      if (broadcast) broadcast.error(1, `player ${sessionId} not found`);
      throw new Error("player not found");
    }

    return player;
  }
}
