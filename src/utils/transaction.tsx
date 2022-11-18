import { WithId } from "../types";

export function attachId(id: string, obj: any) {
  return {
    id: id,
    ...obj,
  };
}

export function removeId<T = any>(obj: WithId<T>): T {
  const newObj = Object.assign({}, obj);
  //@ts-ignore
  delete newObj.id;
  return newObj;
}
