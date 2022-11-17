import { useEffect } from "react";
import { useMatches } from "react-router";
import { Heading, Stack } from "@chakra-ui/react";
import { useConnectedMetaMask } from "metamask-react";
import { useInvokeManager } from "../hooks";
import { withLoading } from "../utils/loader";
import { AddressList } from "./AddressPanel";
import Panel, { PanelHead, PanelBody } from "./Panel";
import { usePolywrapInvoke } from "@polywrap/react";
import { SAFE_CONTRACTS_URI } from "../lib/polywrap/uris";

export default function Safe() {
  const [match] = useMatches();
  const safeAddress = match.params.safe!;

  const [
    getOwners,
    { data: owners, loading: ownersLoading, error: ownersError },
  ] = useInvokeManager<string[]>("getOwners", safeAddress);

  const { account } = useConnectedMetaMask();

  const [
    getThreshold,
    { data: threshold, loading: thresholdLoading, error: isOwnerError },
  ] = useInvokeManager<number>("getThreshold", safeAddress);

  const [isOwner, { data: isOwnerData, loading: isOwnerLoading }] =
    useInvokeManager<number>("isOwner", safeAddress); //  ownerAddress: String!

  useEffect(() => {
    getOwners({ address: safeAddress });
    getThreshold({});
    isOwner({ ownerAddress: account });
  }, [safeAddress]);

  return (
    <Panel sx={{ mb: "40px" }}>
      <PanelHead sx={{ p: "60px 122px 40px" }}>
        <Heading>Owners:</Heading>
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
          <AddressList addressess={owners || new Array(6).fill(account)} />
        )}
      </PanelBody>
    </Panel>
  );
}
