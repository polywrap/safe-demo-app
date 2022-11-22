import { Transaction, WithId, WithTxHash } from "../types";
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

  let txs = localStorageItem ? parseTransactions(localStorageItem) : [];

  txs.push({ id: Date.now().toString(), ...tx });

  localStorage.setItem(
    `pendingTx:${safeAddress}`,
    JSON.stringify(txs, replacer)
  );
  window.dispatchEvent(new Event("storage"));
};

export const addExecutedTransaction = (
  safeAddress: string,
  tx: WithId<Transaction>,
  transactionHash: string
) => {
  removePendingTransaction(safeAddress, tx.id);

  const localStorageItem = localStorage.getItem(`executedTx:${safeAddress}`);

  let txs = localStorageItem
    ? parseTransactions<WithTxHash<WithId<Transaction>>>(localStorageItem)
    : [];

  txs.push({ ...tx, transactionHash: transactionHash });

  localStorage.setItem(
    `executedTx:${safeAddress}`,
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
    ? parseTransactions(localStorageItem)
    : [];

  const newTxs = txs.map((tx) => (tx.id === id ? updatedTx : tx));

  localStorage.setItem(
    `pendingTx:${safeAddress}`,
    JSON.stringify(newTxs, replacer)
  );

  window.dispatchEvent(new Event("storage"));
}

export function removePendingTransaction(safeAddress: string, txId: string) {
  const localStorageItem = localStorage.getItem(`pendingTx:${safeAddress}`)!;

  if (localStorageItem) {
    let transactions = parseTransactions(localStorageItem);
    transactions = transactions?.filter((tx) => tx.id !== txId);

    localStorage.setItem(
      `pendingTx:${safeAddress}`,
      JSON.stringify(transactions, replacer)
    );
    window.dispatchEvent(new Event("storage"));
  }
}

export function parseTransactions<T = WithId<Transaction>>(
  transactions: JSON
): T[] {
  let result = [];
  try {
    result = JSON.parse(transactions, reviver);
  } catch (e) {
    console.log(e);
  }
  return result;
}
