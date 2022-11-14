import { Button, List, ListItem } from "@chakra-ui/react";
import React from "react";
import { useInvokeManager } from "../hooks";

type Props = {};

export default function ModuleManager({}: Props) {
  //ModuleManager

  const [getModules, { data: modules }] =
    useInvokeManager<string[]>("getModules");

  const [isModuleEnabled, { data: isModuleEnabledResult }] =
    useInvokeManager<boolean>("isModuleEnabled"); // {  moduleAddress: String!}
  const [encodeEnableModuleData] = useInvokeManager<string>(
    "encodeEnableModuleData"
  ); // {  moduleAddress: String!}
  const [encodeDisableModuleData] = useInvokeManager<string>(
    "encodeDisableModuleData"
  ); // {  moduleAddress: String!}

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
