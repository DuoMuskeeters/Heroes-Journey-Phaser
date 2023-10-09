import { Command } from "@colyseus/command";
import { z } from "zod";

export function command<Cmd extends Command & { validator?: z.Schema }>(
  cmd: Cmd,
  payload: Cmd["validator"] extends z.Schema
    ? z.input<Cmd["validator"]>
    : undefined
) {
  return [1, { command: cmd.constructor.name, payload }] as const;
}
