import { TargetOptions } from "./Options";
import { makeHTTPRequest } from "./request";
import { addTarget } from "./sockets";

/**
 * Abstract class to initialize a remote rpc target. This abstract class helps performing requests and parsing responses from the corresponding server.
 */
export abstract class ERPCTarget {
  private options: TargetOptions;
  private type: "http-server" | "browser";

  constructor(options: TargetOptions, type: "http-server" | "browser") {
    //TODO make compatibility request

    this.options = options;
    this.type = type;

    addTarget(options);
  }

  private async call(methodIdentifier: string, parameters: any): Promise<any> {
    //TODO add checks for ensuring correct parameters, their types, array lengths, etc.
    if (this.type == "http-server") {
      return makeHTTPRequest(this.options, methodIdentifier, parameters);
    } else if (this.type == "browser") {
      throw new Error("Requests on browsers are not supported!");
    } else {
      throw new Error("Unknown server type of target");
    }
  }
}
