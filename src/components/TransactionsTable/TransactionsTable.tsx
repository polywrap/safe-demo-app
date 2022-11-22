/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { TxReceipt } from "@polywrap/ethereum-plugin-js/build/wrap";
import { useConnectedMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useEthereumPlugin, useInvokeManager } from "../../hooks";
import { Transaction, WithId } from "../../types";
import {
  addExecutedTransaction,
  removePendingTransaction,
  updateTransaction,
} from "../../utils/localstorage";
import { attachId, removeId } from "../../utils/transaction";

//@ts-ignore
import { NotificationManager } from "react-notifications";
import { SmallCloseIcon } from "@chakra-ui/icons";

export default function TransactionsTable({
  transactions,
  threshold,
}: {
  transactions: WithId<Transaction>[];
  threshold?: number;
}) {
  return (
    <TableContainer sx={{ ".chakra-popover__popper": { textAlign: "left" } }}>
      <Table variant={"striped"} size="sm">
        <Thead>
          <Tr>
            <Th>Receiver</Th>
            <Th>Data</Th>
            <Th isNumeric>Value</Th>
            <Th isNumeric>Signatures</Th>
            <Th isNumeric>Approved</Th>
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

interface TxState {
  hash: string;
  ownersApproved: string[];
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
  const [txState, setTxState] = useState<TxState>({
    hash: "",
    ownersApproved: [],
  });

  const signed = Array.from(tx.signatures.keys())
    .map((k) => k.toLowerCase())
    .includes(account);

  const [addSignature, { loading: signing }] =
    useInvokeManager<Transaction>("addSignature");

  const [approveTransactionHash, { loading: approving }] = useInvokeManager(
    "approveTransactionHash"
  );

  const [getTransactionHash, { loading: gettingTxHash }] =
    useInvokeManager<string>("getTransactionHash");

  const [executeTx, { loading: executing }] =
    useInvokeManager<TxReceipt>("executeTransaction");

  const [getOwnersWhoApprovedTx, { loading: gettingApprovers }] =
    useInvokeManager<string[]>("getOwnersWhoApprovedTx");

  const { execute: getSignerAddress } = useEthereumPlugin("getSignerAddress");

  const handleSignTransaction = async () => {
    addSignature({ tx: removeId(tx) }).then((res) => {
      if (res.ok) {
        updateTransaction(safe!, tx.id, attachId(tx.id, res.value));
      }
    });
  };

  const handleExecuteTransaction = async () => {
    console.log("tx", removeId(tx));
    getSignerAddress({}).then(console.log);
    executeTx({ tx: removeId(tx) }).then((res) => {
      if (!res.ok) {
        NotificationManager.error(
          "Check console for additional details",
          "Error"
        );
        console.log("Error:", res.error);
        return;
      }
      NotificationManager.success(
        `Your transaction executed with txHash: ${res.value.transactionHash}`,
        "Congratulations !"
      );

      addExecutedTransaction(safe!, tx, res.value.transactionHash);
    });
  };

  const handleApproveTransaction = async () => {
    const hashRes = await getTransactionHash({ tx: removeId(tx).data });
    if (!hashRes.ok) return "";

    approveTransactionHash({ hash: hashRes.value }).then(console.log);
  };

  const handleRemoveTx = () => {
    removePendingTransaction(safe!, tx.id);
  };

  useEffect(() => {
    getTransactionHash({ tx: removeId(tx).data }).then((hashRes) => {
      if (!hashRes.ok) return "";
      getOwnersWhoApprovedTx({ hash: hashRes.value }).then((ownersRes) => {
        if (!ownersRes.ok) return "";
        setTxState({ hash: hashRes.value, ownersApproved: ownersRes.value });
      });
    });
  }, []);

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
        {threshold ? (
          <Popover placement="top">
            <PopoverTrigger>
              <Button
                variant={"outlined"}
              >{`${tx.signatures.size} / ${threshold}`}</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Signatures:</PopoverHeader>
              <PopoverBody>
                {
                  <List>
                    {Array.from(tx.signatures.keys()).map((signer: string) => {
                      const signature = tx.signatures.get(signer)!;
                      return (
                        <ListItem key={signature?.signer}>
                          <Tooltip
                            label={signature?.data}
                            placement="top"
                            sx={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Box
                              sx={{
                                bg:
                                  signature.signer.toLowerCase() ===
                                  account.toLowerCase()
                                    ? "green"
                                    : "",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {signature?.signer}
                            </Box>
                          </Tooltip>
                        </ListItem>
                      );
                    })}
                  </List>
                }
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Spinner />
        )}
      </Td>
      <Td isNumeric>
        {!gettingApprovers ? (
          <Popover placement="top">
            <PopoverTrigger>
              <Button
                variant={"outlined"}
              >{`${txState.ownersApproved.length} / ${threshold}`}</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Approved by:</PopoverHeader>
              <PopoverBody>
                {
                  <List>
                    {txState.ownersApproved.map((o) => (
                      <ListItem
                        key={o}
                        sx={{
                          bg:
                            o.toLowerCase() === account.toLowerCase()
                              ? "green"
                              : "",
                        }}
                      >
                        {o}
                      </ListItem>
                    ))}
                  </List>
                }
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Spinner />
        )}
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
            disabled={
              executing ||
              threshold! > tx.signatures.size + txState.ownersApproved.length
            }
          >
            {executing ? <Spinner /> : "Execute"}
          </Button>
          <Button
            sx={{ px: "8px", h: "16px", fontSize: "12px" }}
            onClick={handleApproveTransaction}
            disabled={
              executing ||
              approving ||
              txState?.ownersApproved.includes(account)
            }
          >
            {approving || gettingTxHash ? <Spinner /> : "Approve"}
          </Button>
          <Button
            variant={"outline"}
            sx={{ p: "0", h: "auto", w: "auto" }}
            onClick={handleRemoveTx}
          >
            <SmallCloseIcon />
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};
