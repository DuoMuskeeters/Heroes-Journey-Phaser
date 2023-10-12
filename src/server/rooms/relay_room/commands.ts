import { Command } from "@colyseus/command";
import { z } from "zod";
import { Client } from "colyseus";
import { RelayRoom } from "./RelayRoom";
import { Inventory, ServerPlayer } from "../schema/RelayRoomState";
import { type PlayerType } from "../../../game/playerStats";
import { playerBaseStates } from "../../../game/playerStats";
import { AllPermutations } from "../../../objects/utils";
import { Iroh, getCharacterClass } from "../../../game/Karakter";

const SessionId = z.string().min(1).max(32);

const Coordinates = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

const PlayerTypes = z.enum([
  "iroh",
  "jack",
] satisfies AllPermutations<PlayerType>);

const PlayerSkill = z.enum(["basic", "heavy", "transform"]);

export class Move extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = Coordinates;

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    this.player.x = this.payload.x;
    this.player.y = this.payload.y;
  }

  validate(payload: unknown): boolean {
    if (!this.validator.safeParse(payload).success) return false;
    return !this.player.character.isDead();
  }
}

export type PlayerSkillPayload = [
  z.infer<typeof SessionId>,
  z.infer<typeof PlayerSkill>
];

export class Skill extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = PlayerSkill;

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    this.room.broadcast(
      "player-skill",
      [this.client.sessionId, this.payload] satisfies PlayerSkillPayload,
      { except: this.client }
    );
  }

  validate(payload: unknown): boolean {
    if (!this.validator.safeParse(payload).success) return false;
    return !this.player.character.isDead();
  }
}

export class ConnectPlayer extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = Coordinates.extend({
    type: PlayerTypes,
  });

  execute() {
    const Character = getCharacterClass(this.payload.type);

    this.state.players.set(
      this.client.sessionId,
      new ServerPlayer(
        this.client.sessionId,
        new Character("playerName", playerBaseStates[this.payload.type]),
        this.payload.x,
        this.payload.y,
        new Inventory(this.client.sessionId, "gold", 31),
        this.payload.type
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

export class Transform extends Command<RelayRoom> {
  client!: Client;
  payload!: z.infer<typeof this.validator>;
  validator = z.number().min(100).max(5000);

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    if (!(this.player.character instanceof Iroh)) {
      this.client.error(19, "Transformation Failed, You are not Iroh");
      return;
    }

    if (this.player.transformation) {
      this.client.error(19, "Transformation Failed, Already on transformation");
      return;
    }

    this.player.character.transform();
    this.player.transformation = this.clock.setTimeout(() => {
      if (!(this.player.character instanceof Iroh))
        throw new Error("[Internal] Transformation Failed, Player is not Iroh");

      this.player.character.transform();
      this.player.transformation = undefined;
    }, this.payload);
  }

  validate(): boolean {
    if (!this.validator.safeParse(this.payload).success) return false;
    return !this.player.character.isDead();
  }
}

export class Leave extends Command<RelayRoom> {
  client!: Client;

  execute() {
    this.state.getPlayer(this.client).connected = false;
  }
}

export const COMMANDS = [Move, Skill, Transform, Disconnect, Leave];
