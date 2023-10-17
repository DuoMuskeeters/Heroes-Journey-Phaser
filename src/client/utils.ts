import { Command } from "@colyseus/command";
import { z } from "zod";

type CommandWithValidator = Command & { validator?: z.Schema };

export function commandName(cmd: Command) {
  return cmd.constructor.name;
}

export type CommandInput<Cmd extends CommandWithValidator> =
  Cmd["validator"] extends z.Schema ? z.input<Cmd["validator"]> : undefined;

export function command<Cmd extends CommandWithValidator>(
  cmd: Cmd,
  payload: CommandInput<Cmd>
) {
  return [1, { command: commandName(cmd), payload }] as const;
}

export const IS_SERVER = typeof window === "undefined";
