/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useInvokeManager } from "../hooks";
import { SAFE_TRANSACTIONS } from "../modules/router/routes";
import { Transaction } from "../types";
import { withLoading } from "../utils/loader";
import {
  addExecutedTransaction,
  addPendingTransaction,
} from "../utils/localstorage";
import { Ethereum_TxReceipt } from "../wrap";
import { AddressList } from "./AddressPanel";
import Panel, { PanelHead, PanelBody } from "./Panel";

export default function OwnerManager() {
  const { safe: safeAddress } = useParams();
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const rerender = () => setToggle((state) => !state);

  const [getOwners, { data: owners, loading: ownersLoading }] =
    useInvokeManager<string[]>("getOwners", safeAddress);
  const { account } = useConnectedMetaMask();

  const [getThreshold, { data: threshold, loading: thresholdLoading }] =
    useInvokeManager<number>("getThreshold", safeAddress);

  const [isOwner, { data: isOwnerData, loading: isOwnerLoading }] =
    useInvokeManager<number>("isOwner", safeAddress);

  const [createTransaction] =
    useInvokeManager<Transaction>("createTransaction");

  const [executeTx, { loading: executing }] =
    useInvokeManager<Ethereum_TxReceipt>("executeTransaction");

  //SET
  const [encodeAddOwnerWithThresholdData, { loading: encodingAddOwner }] =
    useInvokeManager<string>("encodeAddOwnerWithThresholdData", safeAddress); // {  ownerAddress: String!  threshold: UInt32}

  const [encodeRemoveOwnerData] = useInvokeManager<string>(
    "encodeRemoveOwnerData",
    safeAddress
  );

  /*   const [encodeSwapOwnerData, { data: swapOwnerResult }] =
    useInvokeManager<string>("encodeSwapOwnerData"); // {  oldOwnerAddress: String!  newOwnerAddress: String!}
 */

  const [encodeChangeThresholdData, { loading: encodingChangeThreshold }] =
    useInvokeManager<string>("encodeChangeThresholdData"); // {  threshold: UInt32!}

  const handleChangeThreshold = async () => {
    const encoded = await encodeChangeThresholdData({ threshold: newThresold });
    if (!encoded.ok) return;
    const tx = await createTransaction({
      tx: {
        to: safeAddress,
        value: "0",
        data: encoded.value,
      },
    });
    if (!tx.ok) return;
    if (threshold && threshold > 1) {
      addPendingTransaction(safeAddress!, tx.value);
      navigate(`/${safeAddress}/${SAFE_TRANSACTIONS}`);
    } else {
      const changeResult = await executeTx({ tx: tx.value });
      if (!changeResult.ok) return;
      addExecutedTransaction(
        safeAddress!,
        { id: Date.now().toString(), ...tx.value },
        changeResult.value.transactionHash
      );
      rerender();
    }
  };
  const [newOwner, setNewOwner] = useState("");
  const [newThresold, setNewTreshold] = useState<number>();

  const handleAddOwner = async () => {
    const encoded = await encodeAddOwnerWithThresholdData({
      ownerAddress: newOwner, // "0x9f9a1dEc7Bc1Ab6E4104B186fa0C5E4dD8d0D30e", //
    });
    if (!encoded.ok) return;
    const tx = await createTransaction({
      tx: {
        to: safeAddress,
        value: "0",
        data: encoded.value,
      },
    });
    if (!tx.ok) return;
    if (threshold && threshold > 1) {
      addPendingTransaction(safeAddress!, tx.value);
      navigate(`/${safeAddress}/${SAFE_TRANSACTIONS}`);
    } else {
      const addResult = await executeTx({ tx: tx.value });
      if (!addResult.ok) return;
      addExecutedTransaction(
        safeAddress!,
        { id: Date.now().toString(), ...tx.value },
        addResult.value.transactionHash
      );
      rerender();
    }
  };

  const handleRemoveOwner = async (ownerAddress: string) => {
    const encoded = await encodeRemoveOwnerData({
      // {  ownerAddress: String!  threshold: UInt32}
      ownerAddress: ownerAddress,
    });
    if (!encoded.ok) return;
    const tx = await createTransaction({
      tx: {
        to: safeAddress,
        value: "0",
        data: encoded.value,
      },
    });
    if (!tx.ok) return;
    if (threshold && threshold > 1) {
      addPendingTransaction(safeAddress!, tx.value);
      navigate(`/${safeAddress}/${SAFE_TRANSACTIONS}`);
    } else {
      const removeResult = await executeTx({ tx: tx.value });
      if (!removeResult.ok) return;
      addExecutedTransaction(
        safeAddress!,
        { id: Date.now().toString(), ...tx.value },
        removeResult.value.transactionHash
      );
      rerender();
    }
  };

  useEffect(() => {
    getOwners({});
    getThreshold({});
    isOwner({ ownerAddress: account });
  }, [safeAddress, toggle]);

  return (
    <div>
      <Panel sx={{ mb: "40px" }}>
        <PanelHead sx={{ p: "60px 122px 40px" }}>
          <Heading>Owner Manager</Heading>
          <Stack>
            <Heading size={"md"}>
              Account is owner:{" "}
              {withLoading(
                isOwnerLoading,
                isOwnerData && Boolean(isOwnerData).toString()
              )}
            </Heading>
          </Stack>
          <Stack>
            <Heading size={"md"}>
              Threshold: {withLoading(thresholdLoading, threshold)}
            </Heading>
          </Stack>
        </PanelHead>
        <PanelBody>
          Owners:
          {withLoading(
            ownersLoading,
            <AddressList
              addressess={owners || []}
              onRemove={handleRemoveOwner}
            />
          )}
        </PanelBody>
      </Panel>

      <Stack>
        <Flex>
          <NumberInput
            w={70}
            min={0}
            max={99}
            defaultValue={threshold || 1}
            onChange={(e) => setNewTreshold(Number(e))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button
            isLoading={encodingChangeThreshold || executing}
            onClick={handleChangeThreshold}
          >
            Change Threshold
          </Button>
        </Flex>
        <Flex>
          <Input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <Button
            onClick={handleAddOwner}
            isLoading={encodingAddOwner || executing}
          >
            Add Owner
          </Button>
        </Flex>
      </Stack>
    </div>
  );
}
