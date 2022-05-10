import { TargetOptions } from "./Options";

const targets = new Set<TargetOptions>();
const serverCallbacks = new Set<(options: TargetOptions) => void>();

/**
 * Called whenever a new target is created
 */
export function addTarget(target: TargetOptions) {
  targets.add(target);

  // notify all existing servers over the new target
  serverCallbacks.forEach((cb) => cb(target));
}

/**
 * Register a notifier for a new server
 */
export function registerNewTargetNotifier(
  callback: (options: TargetOptions) => void
) {
  serverCallbacks.add(callback);

  // notify the new server over all existing targets
  targets.forEach((t) => callback(t));
}
