import {
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import { useInvokeManager } from "../../hooks";
import { Transaction, WithId } from "../../types";
import { removeId } from "../../utils/transaction";

export default function TransactionsTable({
  transactions,
  threshold,
}: {
  transactions: WithId<Transaction>[];
  threshold?: number;
}) {
  return (
    <TableContainer>
      <Table variant={"striped"} size="sm">
        <Thead>
          <Tr>
            <Th>Receiver</Th>
            <Th>Data</Th>
            <Th isNumeric>Value</Th>
            <Th isNumeric>Signatures</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <TransactionTableItem tx={removeId(tx)} threshold={threshold} />
          ))}
        </Tbody>
      </Table>
      ;
    </TableContainer>
  );
}

const TransactionTableItem = ({
  tx,
  threshold,
}: {
  tx: Transaction;
  threshold?: number;
}) => {
  const { account } = useConnectedMetaMask();

  const signed = tx.signatures?.has(account);

  const [addSignature, { data: signedTx, loading: signing }] =
    useInvokeManager<Transaction>("addSignature");

  const [executeTx, { data: executedTx, loading: executing }] =
    useInvokeManager<Transaction>("addSignature");

  const handleSignTransaction = async () => {
    addSignature({ tx: tx });
  };

  const handleExecuteTransaction = async () => {
    executeTx({ tx: tx });
  };

  console.log("signedTx", signedTx);

  return (
    <Tr>
      <Td>{tx.data.to}</Td>
      <Td>{tx.data.data}</Td>
      <Td isNumeric>{tx.data.value}</Td>
      <Td isNumeric>
        {threshold ? `${tx.signatures.size} / ${threshold}` : <Spinner />}
      </Td>
      <Td isNumeric>
        <Flex justifyContent="flex-end" gap="4px">
          <Button
            sx={{ px: "8px", h: "16px", fontSize: "12px" }}
            onClick={handleSignTransaction}
            disabled={signing || signed}
          >
            {signing ? <Spinner /> : "Sign"}
          </Button>
          <Button
            sx={{ px: "8px", h: "16px", fontSize: "12px" }}
            onClick={handleExecuteTransaction}
            disabled={executing || !signed || threshold !== tx.signatures.size}
          >
            {executing ? <Spinner /> : "Execute"}
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};
