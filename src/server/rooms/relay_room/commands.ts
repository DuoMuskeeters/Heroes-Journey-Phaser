import { Command } from "@colyseus/command";
import { z } from "zod";
import { Client } from "colyseus";
import { RelayRoom } from "./RelayRoom";
import { Inventory, ServerPlayer } from "../schema/RelayRoomState";

import { playerBaseStates } from "../../../game/playerStats";
import { type AllPermutations } from "../../../objects/utils";
import {
  type CharacterType,
  Iroh,
  getCharacterClass,
  IrohTransform,
} from "../../../game/Karakter";
import { MobType } from "../../../game/mobStats";

const SessionId = z.string().min(1).max(32);

const UINT16_MAX = 65535;

const Coordinates = z.object({
  x: z.number().min(0).max(UINT16_MAX),
  y: z.number().min(0).max(UINT16_MAX),
});

const MobTypes = z.enum(["goblin"] satisfies AllPermutations<MobType>);
const PlayerTypes = z.enum([
  "iroh",
  "jack",
] satisfies AllPermutations<CharacterType>);

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
    mobs: z.array(
      Coordinates.extend({
        name: z.string().min(1),
        type: MobTypes,
        id: z.number().int().min(1),
      })
    ),
  });

  execute() {
    const Character = getCharacterClass(this.payload.type);

    const player = new ServerPlayer(
      this.client.sessionId,
      new Character("playerName", playerBaseStates[this.payload.type]),
      this.payload.x,
      this.payload.y,
      new Inventory(this.client.sessionId, "gold", 31)
    );

    if (!this.state.getAuthoritivePlayer()) player.authoritive = true;

    this.state.players.set(this.client.sessionId, player);
  }

  validate(payload: unknown): boolean {
    return this.validator.safeParse(payload).success;
  }
}

export class Disconnect extends Command<RelayRoom> {
  client!: Client;

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    this.state.players.forEach((p) => {
      if (!p.authoritive) {
        p.authoritive = true;
        return;
      }
    });
    this.player.authoritive = false;
    this.player.connected = false;
  }
}

export class Reconnect extends Command<RelayRoom> {
  client!: Client;

  get player() {
    return this.state.getPlayer(this.client);
  }

  execute() {
    if (!this.state.getAuthoritivePlayer()) this.player.authoritive = true;
    this.player.connected = true;
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

    IrohTransform(this.player.character);
    this.player.transformation = this.clock.setTimeout(() => {
      if (!(this.player.character instanceof Iroh))
        throw new Error("[Internal] Transformation Failed, Player is not Iroh");

      IrohTransform(this.player.character);
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
  payload!: boolean; //consented

  execute() {
    this.state.players.delete(this.client.sessionId);
  }
}

export const COMMANDS = [Move, Skill, Transform, Disconnect, Leave];
