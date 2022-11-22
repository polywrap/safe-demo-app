import { useEffect } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useInvokeManager } from "../hooks";
import { SAFE_CREATE_TRANSACTION } from "../modules/router/routes";
import useStorage from "../hooks/useStorage";
import { reviver } from "../utils/string";
import TransactionsHistoryTable from "../components/TransactionsTable/TransactionsHistoryTable";

export default function Transactions() {
  const params = useParams();
  const safeAddress = params.safe!;
  const navigate = useNavigate();

  const [getThreshold, { data: threshold }] =
    useInvokeManager<number>("getThreshold");

  const pendingTransactions = useStorage(`pendingTx:${safeAddress}`, reviver);
  const executedTransactions = useStorage(`executedTx:${safeAddress}`, reviver);

  useEffect(() => {
    getThreshold({});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box display={"flex"} flexDir="column" gap="40px">
      {pendingTransactions.length ? (
        <Box>
          <Heading mb="20px">Pending Transactions</Heading>
          <TransactionsTable
            transactions={pendingTransactions}
            threshold={threshold}
          />
        </Box>
      ) : (
        <Box>
          <Heading mb="20px">No pending transactions</Heading>
          <Text mb={"20px"}>Safe doesn't have pending transactions</Text>
          <Button
            onClick={() =>
              navigate(`/${safeAddress}/${SAFE_CREATE_TRANSACTION}`)
            }
          >
            New Transaction
          </Button>
        </Box>
      )}
      {executedTransactions?.length ? (
        <Box>
          <Heading mb="20px">Executed Transactions</Heading>
          <TransactionsHistoryTable transactions={executedTransactions} />
        </Box>
      ) : null}
    </Box>
  );
}
