import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Heading,
  List,
  ListItem,
  Stack,
  SystemStyleObject,
  Tooltip,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import useStorage from "../../hooks/useStorage";
import {
  DEPLOY_SAFE,
  SAFE_CREATE_TRANSACTION,
  SAFE_DETAILS,
  SAFE_SETTING,
  SAFE_TRANSACTIONS,
} from "../../modules/router/routes";
import { Transaction } from "../../types";
import { shortenAddress } from "../../utils/string";
import styles, { navListStyles } from "./styles";

export default function Sidebar() {
  const safes: string[] = useStorage("savedSafes");
  const params = useParams();
  const accordionOpenedIndex =
    safes?.length && safes.findIndex((safe) => safe === params?.safe);

  return (
    <Stack id="sidebar" as="nav" sx={styles}>
      <Heading as="h3">Safes</Heading>
      <Accordion
        className="accordion"
        defaultIndex={[accordionOpenedIndex]}
        allowMultiple={true}
      >
        {safes?.length
          ? safes?.map((safe, index) => (
              <SafeNavItem key={safe + index} address={safe} />
            ))
          : null}
      </Accordion>
      <Heading as="h3">Settings</Heading>
      <List sx={navListStyles}>
        <NavLink href={`/${DEPLOY_SAFE}`}>Add safe</NavLink>
      </List>
    </Stack>
  );
}

export const SafeNavItem = ({ address }: { address: string }) => {
  const pendingTransactions: Transaction[] = useStorage(`pendingTx:${address}`);

  return (
    <AccordionItem key={address}>
      <AccordionButton sx={{ justifyContent: "space-between" }}>
        {shortenAddress(address, 8)}
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <List>
          <NavLink
            href={`/${address}/${SAFE_CREATE_TRANSACTION}`}
            sx={{ bg: "green.400", "&.active": { bg: "green.400 !important" } }}
          >
            New Transaction
          </NavLink>
          <NavLink href={`/${address}/${SAFE_DETAILS}`}>Home</NavLink>
          <NavLink href={`/${address}/${SAFE_TRANSACTIONS}`}>
            Transactions{" "}
            {pendingTransactions.length ? (
              <Tooltip label="Pending Transactions" placement="top">
                <Badge colorScheme="green" size="md">
                  {pendingTransactions.length}
                </Badge>
              </Tooltip>
            ) : null}
          </NavLink>
          <NavLink href={`/${address}/${SAFE_SETTING}`}>Settings</NavLink>
        </List>
      </AccordionPanel>
    </AccordionItem>
  );
};

const NavLink = ({
  href,
  children,
  sx,
}: PropsWithChildren<{ href: string; sx?: SystemStyleObject }>) => {
  const { pathname } = useLocation();
  const isActive = href === pathname;

  return (
    <ListItem className={isActive ? "active" : undefined} sx={sx}>
      <Link to={href}>{children}</Link>
    </ListItem>
  );
};
