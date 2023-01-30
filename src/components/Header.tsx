import React from "react";
import { useMetaMask } from "metamask-react";
import { Button, Flex, Image, Link } from "@chakra-ui/react";
import {
  NotificationContainer,
  NotificationManager,
  //@ts-ignore
} from "react-notifications";
import logoSrc from "../images/logo.svg";

export default function Header() {
  const { connect, account, chainId, status, switchChain } = useMetaMask();

  const handleConnect = async () => {
    if (status !== "connected") {
      // switch to Goerli
      await switchChain("0x5");
      await connect();
    } else {
      navigator.clipboard.writeText(account!);
      NotificationManager.success(account, "Address Copied");
    }
  };

  return (
    <header>
      <Flex
        justifyContent={"space-between"}
        alignItems="center"
        p={4}
        sx={{ boxShadow: "1px 1px 5px silver" }}
      >
        <Link href={"/"}>
          <Image src={logoSrc} />
        </Link>
        <Button onClick={handleConnect} size="sm">
          {status === "connected" ? chainId + ": " + account : "Connect"}
        </Button>
      </Flex>
      <NotificationContainer />
    </header>
  );
}
