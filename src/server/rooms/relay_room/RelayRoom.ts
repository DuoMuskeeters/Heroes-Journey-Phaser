import { Client, Room } from "colyseus";
import { RelayState } from "../schema/RelayRoomState";
import { ConnectPlayer } from "./commands";
import { Dispatcher } from "@colyseus/command";

/**
 * client.joinOrCreate("relayroom", {
 *   maxClients: 10,
 *   allowReconnectionTime: 20
 * });
 */

export class RelayRoom extends Room<RelayState> {
  public allowReconnectionTime: number = 5;
  public dispatcher = new Dispatcher(this);

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
    const command = new ConnectPlayer();
    command.client = client;

    this.dispatcher.dispatch(command);
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
