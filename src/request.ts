import { TargetOptions } from "./Options";

export async function makeHTTPRequest(
  options: TargetOptions,
  methodIdentifier: string,
  parameters?: any
) {
  const body = JSON.stringify(parameters);

  if (
    !options.address.startsWith("http") &&
    !options.address.startsWith("https")
  ) {
    options.address = "https://" + options.address;
  }

  if (!methodIdentifier.startsWith("/")) {
    methodIdentifier = "/" + methodIdentifier;
  }

  const res = await fetch(
    `${options.address}:${options.port}${methodIdentifier}`,
    {
      method: "POST",
      credentials: "include",
      body: body,
    }
  );

  //TODO fail if status not ok etc.

  return res.json();
}
