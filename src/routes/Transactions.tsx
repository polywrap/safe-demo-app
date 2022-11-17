import React, { useEffect, useMemo } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useMatches } from "react-router";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useInvokeManager } from "../hooks";
import { Transaction } from "../types";
import { getPendingTransactions } from "../utils/localstorage";

export default function Transactions() {
  const [match] = useMatches();
  const safeAddressParam = match.params.safe!;

  const [getThreshold, { data: threshold }] =
    useInvokeManager<number>("getThreshold");

  const pendingTransactions = useMemo<(Transaction & { id: string })[]>(
    () => getPendingTransactions(safeAddressParam),
    [safeAddressParam]
  );

  useEffect(() => {
    getThreshold({});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Heading mb="20px">Pending Transactions</Heading>
      <TransactionsTable
        transactions={pendingTransactions}
        threshold={threshold}
      />
    </Box>
  );
}
