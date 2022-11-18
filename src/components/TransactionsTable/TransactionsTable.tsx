import {
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import { useParams } from "react-router";
import { useInvokeManager } from "../../hooks";
import { Transaction, WithId } from "../../types";
import { updateTransaction } from "../../utils/localstorage";
import { attachId, removeId } from "../../utils/transaction";

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
            <TransactionTableItem key={tx.id} tx={tx} threshold={threshold} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

const TransactionTableItem = ({
  tx,
  threshold,
}: {
  tx: WithId<Transaction>;
  threshold?: number;
}) => {
  const { account } = useConnectedMetaMask();
  const { safe } = useParams();

  const signed = Array.from(tx.signatures.keys())
    .map((k) => k.toLowerCase())
    .includes(account);

  const [addSignature, { loading: signing }] =
    useInvokeManager<Transaction>("addSignature");

  const [executeTx, { loading: executing }] =
    useInvokeManager<Transaction>("executeTransaction");

  const handleSignTransaction = async () => {
    addSignature({ tx: removeId(tx) }).then((res) => {
      if (res.ok) {
        updateTransaction(safe!, tx.id, attachId(tx.id, res.value));
      }
    });
  };

  const handleExecuteTransaction = async () => {
    executeTx({ tx: removeId(tx) });
  };

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
