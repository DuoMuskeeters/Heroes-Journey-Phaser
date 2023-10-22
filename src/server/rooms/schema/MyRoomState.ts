import { Schema, type, MapSchema } from "@colyseus/schema";
import type { Client } from "colyseus";
import { Canlı } from "../../../game/Karakter";

export class ServerPlayer extends Canlı {
  @type("boolean") connected: boolean = true;
}

export class MyRoomState extends Schema {
  @type("string") message: string = "Hello world";
  @type("string") message2: string = "Hello world";
  @type({ map: ServerPlayer }) players = new MapSchema<ServerPlayer>();

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
