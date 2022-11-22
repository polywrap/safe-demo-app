import { useEffect } from "react";
import { useMatches } from "react-router";
import { Flex, Heading, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import { useEthereumPlugin, useInvokeManager } from "../hooks";
import { withLoading } from "../utils/loader";
import { AddressList } from "./AddressPanel";
import Panel, { PanelHead, PanelBody } from "./Panel";
import { formatValue } from "../utils/number";

export default function Safe() {
  const [match] = useMatches();
  const safeAddress = match.params.safe!;

  const [getOwners, { data: owners, loading: ownersLoading }] =
    useInvokeManager<string[]>("getOwners", safeAddress);

  const { account } = useConnectedMetaMask();

  const [getThreshold, { data: threshold, loading: thresholdLoading }] =
    useInvokeManager<number>("getThreshold", safeAddress);

  const [isOwner, { data: isOwnerData, loading: isOwnerLoading }] =
    useInvokeManager<number>("isOwner", safeAddress); //  ownerAddress: String!

  const {
    execute: getBalance,
    data: balanceData,
    loading: balanceLoading,
  } = useEthereumPlugin<string>("getBalance"); //  ownerAddress: String!

  useEffect(() => {
    getOwners({ address: safeAddress });
    getThreshold({});
    isOwner({ ownerAddress: account });
    getBalance({ address: safeAddress });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress]);

  return (
    <Panel sx={{ mb: "40px" }}>
      <PanelHead sx={{ p: "60px" }}>
        <Flex alignItems={"center"} gap="4px">
          <Text fontSize={"18px"} fontWeight="bold">
            Safe Address:
          </Text>
          <Text fontSize={"18px"}>{safeAddress}</Text>
        </Flex>
        <Stack>
          <Heading size={"md"}>
            Balance:{" "}
            {withLoading(
              balanceLoading,
              balanceData && (
                <Tooltip label={balanceData.toString()}>
                  {formatValue(balanceData)}
                </Tooltip>
              )
            )}
          </Heading>
        </Stack>
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
            Required confirmations:{" "}
            {withLoading(
              thresholdLoading || ownersLoading,
              `${threshold} out of ${owners?.length} owners`
            )}
          </Heading>
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
  );
}
