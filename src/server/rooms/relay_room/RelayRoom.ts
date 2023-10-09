import { MapSchema, Schema, filter, type } from "@colyseus/schema";
import { Client, Room } from "colyseus";

// TOOD: x, y -> position

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

class Inventory extends Schema {
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

class Player extends Schema {
  constructor(sessionId: string, name: string, inventory: Inventory) {
    super();
    this.sessionId = sessionId;
    this.name = name;
    this.inventory = inventory;
    this.connected = true;
  }

  @filter(inSameGuild) @type("boolean") connected: boolean;
  @type("string") name: string;
  @type("string") sessionId: string;
  @type(Inventory) inventory: Inventory;
}

class RelayState extends Schema {
  @type({ map: Player }) public players = new MapSchema<Player>();
}

/**
 * client.joinOrCreate("relayroom", {
 *   maxClients: 10,
 *   allowReconnectionTime: 20
 * });
 */

export class RelayRoom extends Room<RelayState> {
  public allowReconnectionTime: number = 5;

  public onCreate(
    options: Partial<{
      maxClients: number;
      allowReconnectionTime: number;
      metadata: any;
    }>
  ) {
    this.setState(new RelayState());

    if (options.maxClients) {
      this.maxClients = options.maxClients;
    }

    if (options.allowReconnectionTime) {
      this.allowReconnectionTime = Math.min(options.allowReconnectionTime, 40);
    }

    if (options.metadata) {
      this.setMetadata(options.metadata);
    }

    this.onMessage("*", (client, type, message) => {
      this.broadcast(type, [client.sessionId, message], { except: client });
    });
  }

  public onJoin(
    client: Client,
    options: Partial<{ authId: string; name: string }> = {}
  ) {
    const player = new Player(
      client.sessionId,
      options.name ?? "",
      new Inventory(client.sessionId, "gold", 100)
    );

    this.state.players.set(client.sessionId, player);
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "disconnected!");
    this.state.players.get(client.sessionId)!.connected = false;
    try {
      if (consented) {
        throw new Error("consented leave");
      }
      await this.allowReconnection(client, this.allowReconnectionTime);
      this.state.players.get(client.sessionId)!.connected = true;
      console.log(client.sessionId, "reconnected!");
    } catch (error) {
      console.log("player timed out or consented leave");
      this.state.players.delete(client.sessionId);
    }
  }
}
