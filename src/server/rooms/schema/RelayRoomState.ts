import { MapSchema, Schema, filter, type } from "@colyseus/schema";
import { Client, Delayed } from "colyseus";
import { Character } from "../../../game/Karakter";
import { type PlayerType } from "../../../game/playerStats";

function inSameGuild(client: Client, value: boolean, root: RelayState) {
  return true;
}

function hiddenInventoryQuantity(
  this: Inventory,
  client: Client,
  value: number,
  root: RelayState
) {
  return client.sessionId === this.sessionId;
}

export class Inventory extends Schema {
  constructor(sessionId: string, name: "gold" | "silver", quantity: number) {
    super();
    this.sessionId = sessionId;
    this.name = name;
    this.quantity = quantity;
  }

  @type("string") sessionId: string;
  @type("string") name: "gold" | "silver";
  @filter(hiddenInventoryQuantity) @type("number") quantity: number;
}

export class ServerPlayer extends Schema {
  @type("string") type: PlayerType;
  @type("boolean") connected: boolean = true;
  @type("string") sessionId: string;
  @type(Character) character: Character;
  @type(Inventory) inventory: Inventory;
  @filter(inSameGuild) @type("number") x: number;
  @filter(inSameGuild) @type("number") y: number;

  transformation?: Delayed;

  constructor(
    sessionId: string,
    character: Character,
    x: number,
    y: number,
    inventory: Inventory,
    type: PlayerType
  ) {
    super();
    this.sessionId = sessionId;
    this.inventory = inventory;
    this.character = character;
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export class RelayState extends Schema {
  @type({ map: ServerPlayer }) public players = new MapSchema<ServerPlayer>();

  getPlayer(client: Client): ServerPlayer;
  getPlayer(sessionId: string, broadcast?: Client): ServerPlayer;
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
