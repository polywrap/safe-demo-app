import { Button, List, ListItem } from "@chakra-ui/react";
import React from "react";
import { useMatches } from "react-router";
import { useInvokeManager } from "../hooks";

export default function ModuleManager() {
  //ModuleManager

  const [match] = useMatches();
  const safeAddress = match.params.safe!;

  const [getModules, { data: modules }] = useInvokeManager<string[]>(
    "getModules",
    safeAddress
  );
  /* 
  const [isModuleEnabled, { data: isModuleEnabledResult }] =
    useInvokeManager<boolean>("isModuleEnabled", safeAddress); // {  moduleAddress: String!}
  const [encodeEnableModuleData] = useInvokeManager<string>(
    "encodeEnableModuleData",
    safeAddress
  ); // {  moduleAddress: String!}
  const [encodeDisableModuleData] = useInvokeManager<string>(
    "encodeDisableModuleData",
    safeAddress
  ); // {  moduleAddress: String!} */

  const handleGetModules = async () => {
    getModules({}).then(console.log);
  };

  return (
    <div>
      ModuleManager
      <List>
        {modules?.map((m) => (
          <ListItem key={m}>{m} </ListItem>
        ))}
      </List>
      <Button onClick={handleGetModules}>Get Modules</Button>
    </div>
  );
}
