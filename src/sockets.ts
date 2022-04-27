import { ERPCTarget } from "./ERPCTarget";

const targets = new Set<ERPCTarget>();
const serverCallbacks = new Set<(target: ERPCTarget) => void>();

export function addTarget(target: ERPCTarget) {
  targets.add(target);

  serverCallbacks.forEach((cb) => cb(target));
}

export function registerNewTargetNotifier(
  callback: (target: ERPCTarget) => void
) {
  serverCallbacks.add(callback);

  targets.forEach((t) => callback(t));
}
