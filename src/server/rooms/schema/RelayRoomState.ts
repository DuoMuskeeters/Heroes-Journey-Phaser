import { MapSchema, Schema, filter, type } from "@colyseus/schema";
import { Client, Delayed } from "colyseus";
import { Character, MobCanlı } from "../../../game/Karakter";

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
  @type("boolean") connected: boolean = true;
  @type("boolean") authoritive: boolean = false;
  @type("string") sessionId: string;
  @type(Character) character: Character;
  @type(Inventory) inventory: Inventory;
  @filter(inSameGuild) @type("uint16") x: number;
  @filter(inSameGuild) @type("uint16") y: number;

  transformation?: Delayed;

  constructor(
    sessionId: string,
    character: Character,
    x: number,
    y: number,
    inventory: Inventory
  ) {
    super();
    this.sessionId = sessionId;
    this.inventory = inventory;
    this.character = character;
    this.x = x;
    this.y = y;
  }
}

export class ServerMob extends Schema {
  @type(MobCanlı) mob: MobCanlı;
  @type("uint16") x: number;
  @type("uint16") y: number;
  id: number;

  constructor(mob: MobCanlı, x: number, y: number, id: number) {
    super();
    this.mob = mob;
    this.x = x;
    this.y = y;
    this.id = id;
  }
}

export class RelayState extends Schema {
  @type({ map: ServerPlayer }) public players = new MapSchema<ServerPlayer>();
  @type({ map: ServerMob }) public mobs = new MapSchema<ServerMob>();

  getAuthoritivePlayer() {
    let player: ServerPlayer | undefined;
    this.players.forEach((p) => {
      if (player && p.authoritive)
        throw new Error("multiple authoritive players");

      if (p.authoritive) player = p;
    });
    return player;
  }

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
