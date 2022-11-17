export interface SignSignature {
  signer: string;
  data: string;
}

export interface Transaction {
  data: any;
  signatures: Map<string, SignSignature>;
}

export type WithId<T> = T & { id: string };
