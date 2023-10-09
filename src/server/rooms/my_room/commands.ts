import { Command } from "@colyseus/command";
import { MyRoom } from "./MyRoom";
import { z } from "zod";
import { Client } from "colyseus";
import { Canlı, CanlıState } from "../schema/MyRoomState";

const SessionId = z.string().min(1).max(32);

const Coordinates = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

export class Hit extends Command<MyRoom> {
  client!: Client; // isteği yapan kişi
  payload!: z.infer<typeof this.validator>;
  validator = z.object({
    enemy: SessionId.optional(), // rakibin idsi
    type: z.enum(["heavy", "basic"]),
    range: z.number().default(10),
  });

  get player() {
    return this.state.getPlayer(this.client);
  }

  get enemy() {
    if (!this.payload.enemy) return;
    return this.state.players.get(this.payload.enemy);
  }

  execute() {
    const spell = this.payload.type;
    const damage = this.player.state.ATK * 2;
    this.enemy?._takeDamage(damage);
  }

  validate(payload: unknown): boolean {
    return this.validator.safeParse(payload).success;
  }
}

export class Move extends Command<MyRoom> {
  client!: Client; // isteği yapan kişi
  payload!: z.infer<typeof this.validator>;
  validator = Coordinates;

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {}

  validate(payload: unknown): boolean {
    return this.validator.safeParse(payload).success;
  }
}

export class ConnectPlayer extends Command<MyRoom> {
  client!: Client;

  execute() {
    this.state.players.set(
      this.client.sessionId,
      new Canlı(
        "main player",
        new CanlıState({
          Strength: 25,
          Agility: 25,
          Intelligence: 25,
          Constitution: 25,
        })
      )
    );
  }
}

export class Disconnect extends Command<MyRoom> {
  client!: Client;

  execute() {
    this.state.getPlayer(this.client).connected = false;
  }
}

export class Leave extends Command<MyRoom> {
  client!: Client;

  execute() {
    this.state.getPlayer(this.client).connected = false;
  }
}

export const COMMANDS = [Hit, Disconnect, Leave];
