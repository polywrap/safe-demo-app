import { Transaction, WithId } from "../types";
import { replacer, reviver } from "./string";

type JSON = string;

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

  localStorage.setItem(
    `pendingTx:${safeAddress}`,
    JSON.stringify(txs, replacer)
  );
  window.dispatchEvent(new Event("storage"));
};

export function updateTransaction(
  safeAddress: string,
  id: string,
  updatedTx: WithId<Transaction>
) {
  const localStorageItem = localStorage.getItem(`pendingTx:${safeAddress}`);

  let txs: WithId<Transaction>[] = localStorageItem
    ? JSON.parse(localStorageItem)
    : [];

  const newTxs = txs.map((tx) => (tx.id === id ? updatedTx : tx));

  localStorage.setItem(
    `pendingTx:${safeAddress}`,
    JSON.stringify(newTxs, replacer)
  );

  window.dispatchEvent(new Event("storage"));
}

export function parseTransactions(transactions: JSON) {
  return JSON.parse(transactions, reviver);
}
