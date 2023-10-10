import { Command } from "@colyseus/command";
import { z } from "zod";
import { Client } from "colyseus";
import { Canlı, CanlıState } from "../schema/MyRoomState";
import { RelayRoom } from "./RelayRoom";
import { Inventory, Player } from "../schema/RelayRoomState";

const SessionId = z.string().min(1).max(32);

const Coordinates = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

export class Move extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = Coordinates.extend({
    dir: z.enum(["left", "right"]).optional(),
  });

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    this.player.x = this.payload.x;
    this.player.y = this.payload.y;
    if (this.payload.dir) this.player.dir = this.payload.dir;
  }

  validate(payload: unknown): boolean {
    return this.validator.safeParse(payload).success;
  }
}

export class ConnectPlayer extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = Coordinates;

  execute() {
    this.state.players.set(
      this.client.sessionId,
      new Player(
        this.client.sessionId,
        "PlayerName",
        new Inventory(this.client.sessionId, "gold", 31),
        new Canlı(
          "main player",
          new CanlıState({
            Strength: 25,
            Agility: 25,
            Intelligence: 25,
            Constitution: 25,
          })
        ),
        this.payload.x,
        this.payload.y
      )
    );
  }

  validate(payload: unknown): boolean {
    return this.validator.safeParse(payload).success;
  }
}

export class Disconnect extends Command<RelayRoom> {
  client!: Client;

  execute() {
    this.state.getPlayer(this.client).connected = false;
  }
}

export class Leave extends Command<RelayRoom> {
  client!: Client;

  execute() {
    this.state.getPlayer(this.client).connected = false;
  }
}

export const COMMANDS = [Move, Disconnect, Leave];
