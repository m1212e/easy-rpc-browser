import { ERPCTarget } from "./ERPCTarget";
import { ServerOptions, TargetOptions } from "./Options";
import { registerNewTargetNotifier } from "./sockets";

//TODO auto reconnect websocket?
//TODO make connection manual/let the user choose when to connect ws where

/**
 * Abstract class to initialize a rpc server.
 */
export abstract class ERPCServer {
  private role: string;
  private mappedCallbacks = {};
  private sockets: WebSocket[] = [];

  constructor(
    options: ServerOptions,
    types: ("http-server" | "browser")[],
    enableSockets: boolean,
    role: string
  ) {
    //TODO make compatibility request

    this.role = role;

    if (!enableSockets) {
      throw new Error("A server on browser side must enable sockets to work!");
    }
    //TODO correct type check
    if (types.length == 0) {
      throw new Error("Types can't be empty");
    }
    if (types.length != 1) {
      throw new Error("Types array has wrong length: " + types.length);
    }
    if (types.find((e) => e != "browser")) {
      throw new Error('Cannot initialize with role other than "browser"');
    }
  }

  /**
    This method is used by easy-rpc internally and is not intended for manual use. It can be used to register a function on the server dynamically.
  */
  private registerERPCCallbackFunction(func, identifier) {
    if (!identifier.startsWith("/")) {
      identifier = "/" + identifier;
    }
    this.mappedCallbacks[identifier] = func;
  }

  /**
   * Starts the server
   */
  start() {
    registerNewTargetNotifier((o) => this.newTargetNotifier(o));
  }

  /**
   * Stops the server
   */
  stop() {
    throw new Error("Stopping is not supported yet");
  }

  /**
   * Gets called whenever a new target is initialized
   */
  private async newTargetNotifier(options: TargetOptions) {
    let address = options.address.replace("https://", "ws://");
    address = address.replace("http://", "ws://");
    const socket = new WebSocket(address + ":" + options.port);
    this.sockets.push(socket);

    socket.addEventListener("error", (event) => {
      console.error("Websocket error: ", event);
    });

    socket.addEventListener("message", (event) => {
      this.onMessage(event.data, socket);
    });

    socket.addEventListener("open", (event) => {
      // identification request
      socket.send(
        JSON.stringify({
          role: this.role,
        })
      );
    });
  }

  private async onMessage(data: any, socket: WebSocket) {
    const parsedData = JSON.parse(data);
    const res = await (parsedData.body
      ? this.mappedCallbacks[parsedData.url](...parsedData?.body)
      : this.mappedCallbacks[parsedData.url]());

    socket.send(
      JSON.stringify({
        id: parsedData.id,
        body: res,
      })
    );
  }
}
