import { Room, type Client } from "@colyseus/core";
import { MyRoomState } from "../schema/MyRoomState";
import { Dispatcher } from "@colyseus/command";
import { COMMANDS, ConnectPlayer } from "./commands";

export class MyRoom extends Room<MyRoomState> {
  dispatcher = new Dispatcher(this);
  maxClients = 4;

  onCreate(options: unknown) {
    console.log("MyRoom created!", options);
    this.setState(new MyRoomState());
    /**
     * Commands are executed by the 1 payload type
     */
    this.onMessage(1, (client, data) => {
      const Command = COMMANDS.find((c) => c.name === data.command);
      if (!Command) throw new Error(`command ${data.command} not found`);
      const command = new Command();
      command.client = client;
      this.dispatcher.dispatch(command, data.payload);
    });
  }

  onJoin(client: Client, options: unknown) {
    const command = new ConnectPlayer();
    command.client = client;
    this.dispatcher.dispatch(command);
    console.log(client.sessionId, "joined!");
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.getPlayer(client).connected = false;
    try {
      if (consented) {
        throw new Error("consented leave");
      }
      await this.allowReconnection(client, 2);
      this.state.getPlayer(client).connected = true;
    } catch (error) {
      console.log("player timed out");
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
