import React from "react";
import { useMetaMask } from "metamask-react";
import { Button, Flex } from "@chakra-ui/react";
import {
  NotificationContainer,
  NotificationManager,
  //@ts-ignore
} from "react-notifications";

export default function Header() {
  const { connect, account, chainId, status } = useMetaMask();

  const handleConnect = () => {
    if (status !== "connected") {
      connect();
    } else {
      navigator.clipboard.writeText(account!);
      NotificationManager.success(account, "Address Copied");
    }
  };

  return (
    <header>
      <Flex justifyContent={"flex-end"} p={4}>
        <Button onClick={handleConnect}>
          {status === "connected" ? chainId + ": " + account : "Connect"}
        </Button>
      </Flex>
      <NotificationContainer />
    </header>
  );
}
