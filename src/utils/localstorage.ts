import { Transaction, WithId } from "../types";

export const addSafe = async (safeAddress: string) => {
  const localStorageItem = localStorage.getItem("savedSafes");

  let safes: string[] = localStorageItem ? JSON.parse(localStorageItem) : [];

  const alreadyAdded = safes.find((safe) => safe === safeAddress);
  if (alreadyAdded) return;

  safes.push(safeAddress);
  localStorage.setItem("savedSafes", JSON.stringify(safes));
  window.dispatchEvent(new Event("storage"));
};

export const getSafes = (): string[] => {
  const localStorageItem = localStorage.getItem("savedSafes");
  return localStorageItem ? JSON.parse(localStorageItem) : [];
};

export const addPendingTransaction = (safeAddress: string, tx: Transaction) => {
  const localStorageItem = localStorage.getItem(`pendingTx:${safeAddress}`);

  let txs = localStorageItem ? JSON.parse(localStorageItem) : [];

  txs.push({ id: Date.now().toString(), ...tx });

  localStorage.setItem(`pendingTx:${safeAddress}`, JSON.stringify(txs));
  window.dispatchEvent(new Event("storage"));
};

export const getPendingTransactions = (
  safeAddress: string
): WithId<Transaction>[] => {
  const localStorageItem = localStorage.getItem(`pendingTx:${safeAddress}`);

  return localStorageItem ? parseJsonTransaction(localStorageItem) : [];
};

export const parseJsonTransaction = (
  transactions: string
): WithId<Transaction>[] => {
  let txs: WithId<Transaction>[] = JSON.parse(transactions);
  //console.log("txs", txs);

  return txs.map((tx) => {
    const signatureKeys = Object.keys(tx.signatures);
    console.log("signatureKeys", signatureKeys);
    return {
      ...tx,
      signatures: new Map(),
    };
  });
};

//0x3cbf4e1ce15f606ab9441358f1fa42bd96f27a3a
