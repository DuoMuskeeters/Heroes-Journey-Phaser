import { Client, Delayed, Room } from "colyseus";
import { RelayState } from "../schema/RelayRoomState";
import {
  COMMANDS,
  ConnectPlayer,
  Disconnect,
  Leave,
  Reconnect,
} from "./commands";
import { Dispatcher } from "@colyseus/command";
import { CommandInput } from "../../../client/utils";

/**
 * client.joinOrCreate("relayroom", {
 *   maxClients: 10,
 *   allowReconnectionTime: 20
 * });
 */

export class RelayRoom extends Room<RelayState> {
  public allowReconnectionTime: number | "manual" = "manual";
  public dispatcher = new Dispatcher(this);

  public onCreate(
    options: Partial<{
      maxClients: number;
      allowReconnectionTime: number;
      metadata: any;
    }>
  ) {
    this.setState(new RelayState());
    this.clock.setInterval(() => {
      // console.log("Regeneration");
    }, 1000);

    if (options.maxClients) {
      this.maxClients = options.maxClients;
    }

    if (options.allowReconnectionTime) {
      this.allowReconnectionTime =
        options.allowReconnectionTime ?? this.allowReconnectionTime;
    }

    if (options.metadata) {
      this.setMetadata(options.metadata);
    }

    this.onMessage("*", (client, type, message) => {
      this.broadcast(type, [client.sessionId, message], { except: client });
    });

    /**
     * Commands are executed by the 1 payload type
     */
    this.onMessage(1, (client, data) => {
      const Command = COMMANDS.find((c) => c.name === data.command);
      if (!Command) {
        client.error(2, `command ${data.command} not found`);
        return;
      }
      const command = new Command();
      command.client = client;
      this.dispatcher.dispatch(command, data.payload);
    });
  }

  public onJoin(client: Client, options: CommandInput<ConnectPlayer>) {
    const command = new ConnectPlayer();
    command.client = client;

    this.dispatcher.dispatch(command, options);
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "disconnected!");
    const disconnect = new Disconnect();
    disconnect.client = client;
    this.dispatcher.dispatch(disconnect);
    try {
      if (consented) {
        throw new Error("consented leave");
      }
      await this.allowReconnection(client, this.allowReconnectionTime);
      const reconnect = new Reconnect();
      reconnect.client = client;
      this.dispatcher.dispatch(reconnect);
      console.log(client.sessionId, "reconnected!");
    } catch (error) {
      console.log("player timed out or consented leave");
      const leave = new Leave();
      leave.client = client;
      this.dispatcher.dispatch(leave, consented);
    }
  }
}
