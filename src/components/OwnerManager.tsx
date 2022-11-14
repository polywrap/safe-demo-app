import {
  Button,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import React, { useEffect } from "react";
import { useInvokeManager } from "../hooks";
import { AddressList } from "./AddressPanel";
import Panel, { PanelHead, PanelBody } from "./Panel";

const withLoading = (
  isLoading: boolean | undefined,
  component: React.ReactNode
) => (isLoading ? <Spinner /> : component ? component : undefined);

export default function OwnerManager({
  safeAddress,
}: {
  safeAddress?: string;
}) {
  //GET
  const [
    getOwners,
    { data: owners, loading: ownersLoading, error: ownersError },
  ] = useInvokeManager<string[]>("getOwners");
  const { account } = useConnectedMetaMask();

  const [
    getThreshold,
    { data: threshold, loading: thresholdLoading, error: isOwnerError },
  ] = useInvokeManager<number>("getThreshold");

  const [isOwner, { data: isOwnerData, loading: isOwnerLoading }] =
    useInvokeManager<number>("isOwner"); //  ownerAddress: String!

  //SET
  const [encodeAddOwnerWithThresholdData, { data: addOwnerResult }] =
    useInvokeManager<string>("encodeAddOwnerWithThresholdData"); // {  ownerAddress: String!  threshold: UInt32}

  const [encodeRemoveOwnerData, { data: removeOwnerResult }] =
    useInvokeManager<string>("encodeRemoveOwnerData"); // {  ownerAddress: String!  threshold: UInt32}

  const [encodeSwapOwnerData, { data: swapOwnerResult }] =
    useInvokeManager<string>("encodeSwapOwnerData"); // {  oldOwnerAddress: String!  newOwnerAddress: String!}

  const [
    encodeChangeThresholdData,
    { data: changeTresholdResult, loading: changeThresholdLoading },
  ] = useInvokeManager<string>("encodeChangeThresholdData"); // {  threshold: UInt32!}

  const handleChangeThreshold = () => {
    encodeChangeThresholdData({ threshold: 2 }).then(console.log);
  };

  const handleAddOwner = () => {
    encodeAddOwnerWithThresholdData({
      ownerAddress: "0x4300bc1Ed00706E5386C6B938382d37eDB31d143",
      threshold: 2,
    }).then(console.log);
  };

  useEffect(() => {
    getOwners({});
    getThreshold({});
    isOwner({ ownerAddress: account });
  }, [safeAddress]);
  // 0x4300bc1Ed00706E5386C6B938382d37eDB31d143
  console.log("owners", ownersError);
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
          <Stack>
            <Heading size={"md"}>Owners</Heading>
          </Stack>
        </PanelHead>
        <PanelBody>
          Owners:
          {withLoading(
            ownersLoading,
            <AddressList addressess={owners || new Array(6).fill(account)} />
          )}
        </PanelBody>
      </Panel>

      <Stack>
        <Flex>
          <NumberInput w={70} min={0} max={99} defaultValue={0}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button
            isLoading={changeThresholdLoading}
            onClick={handleChangeThreshold}
          >
            Change Threshold
          </Button>
        </Flex>
        <Flex>
          <Input />
          <Button onClick={handleAddOwner}>Add Owner</Button>
        </Flex>
      </Stack>
    </div>
  );
}
