import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
} from "@chakra-ui/react";
import { Transaction, WithId, WithTxHash } from "../../types";
import { getExplorerTxLink } from "../../utils/string";

type Props = {
  transactions: WithTxHash<WithId<Transaction>>[];
};

export default function TransactionsHistoryTable({ transactions }: Props) {
  return (
    <TableContainer sx={{ ".chakra-popover__popper": { textAlign: "left" } }}>
      <Table variant={"striped"} size="sm">
        <Thead>
          <Tr>
            <Th>Receiver</Th>
            <Th>Data</Th>
            <Th isNumeric>Value</Th>
            <Th isNumeric>Proof</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((tx) => (
            <TransactionTableItem key={tx.id} tx={tx} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export const TransactionTableItem = ({
  tx,
}: {
  tx: WithTxHash<WithId<Transaction>>;
}) => {
  return (
    <Tr>
      <Td>{tx.data.to}</Td>
      <Td
        sx={{
          maxWidth: "400px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {tx.data.data}
      </Td>
      <Td isNumeric>{tx.data.value}</Td>
      <Td isNumeric>
        <Link
          target={"_blank"}
          href={`${getExplorerTxLink()}/${tx.transactionHash}`}
        >
          {tx.transactionHash}
        </Link>
      </Td>
    </Tr>
  );
};
