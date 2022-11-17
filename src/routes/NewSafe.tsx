import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import AddSafe from "../components/AddSafe";
import DeployForm from "../components/DeployForm";

export default function NewSafe() {
  return (
    <Box>
      <Box>
        <Heading>Add Safe</Heading>
        <AddSafe />
      </Box>
      <Box>
        <Heading>Or deploy new</Heading>
        <DeployForm />
      </Box>
    </Box>
  );
}
