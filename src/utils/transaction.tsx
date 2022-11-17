import { Transaction, WithId } from "../types";

export function removeId<T = any>(obj: WithId<T>): T {
  //@ts-ignore
  delete obj.id;
  return obj;
}
