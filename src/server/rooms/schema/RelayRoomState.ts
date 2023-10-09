import { MapSchema, Schema, filter, type } from "@colyseus/schema";
import { Client } from "colyseus";
import { Canlı } from "./MyRoomState";
import { Direction, direction } from "../../../game/types/types";

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

export class Player extends Schema {
  constructor(
    sessionId: string,
    name: string,
    inventory: Inventory,
    character: Canlı,
    x: number,
    y: number,
    dir: Direction = direction.right
  ) {
    super();
    this.sessionId = sessionId;
    this.name = name;
    this.inventory = inventory;
    this.character = character;
    this.connected = true;
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  @filter(inSameGuild) @type("boolean") connected: boolean;
  @type("string") name: string;
  @type("string") sessionId: string;
  @type(Canlı) character: Canlı;
  @type(Inventory) inventory: Inventory;
  @type("number") x: number;
  @type("number") y: number;
  @type("string") dir: Direction;
}

export class RelayState extends Schema {
  @type({ map: Player }) public players = new MapSchema<Player>();

  getPlayer(client: Client): Player;
  getPlayer(sessionId: string, broadcast?: Client): Player;
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
