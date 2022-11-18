import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AddSafe from "../components/AddSafe";
import DeployForm from "../components/DeployForm";
import Panel, { PanelBody, PanelHead } from "../components/Panel";

export default function NewSafe() {
  return (
    <Box>
      <Panel sx={{ mb: "20px" }}>
        <PanelHead>
          <Heading>Add Safe</Heading>
        </PanelHead>
        <PanelBody>
          <AddSafe />
        </PanelBody>
      </Panel>
      <Panel>
        <PanelHead>
          <Heading>Deploy new Safe</Heading>
        </PanelHead>
        <PanelBody>
          <DeployForm />
        </PanelBody>
      </Panel>
    </Box>
  );
}
