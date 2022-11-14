import React, { useState } from "react";
import { Box, Button, FormLabel, Input, Stack } from "@chakra-ui/react";
import ModuleManager from "./ModuleManager";
import OwnerManager from "./OwnerManager";

export default function Manager() {
  const [safeAddress, setSafeAddress] = useState<string>(
    localStorage.getItem("selectedSafe") || ""
  );

  const handleSafeAddressValueChange = (e: any) => {
    const value = e.target.value;
    localStorage.setItem("selectedSafe", value);
  };

  const update = () => {
    setSafeAddress(localStorage.getItem("selectedSafe") || "");
  };

  return (
    <Box
      sx={{
        padding: "12px",
        border: "1px solid steelblue",
        borderRadius: "8px",
        minW: "600px",
        width: "fit-content",
        mb: "40px",
      }}
    >
      <FormLabel>
        <h3>Safe address</h3>
        <Input
          defaultValue={localStorage.getItem("selectedSafe") || ""}
          onChange={handleSafeAddressValueChange}
        />
      </FormLabel>
      <Button onClick={update}>Load Safe Info</Button>
      {/*       <OwnerManager safeAddress={safeAddress} />
      <Stack direction={"row"}>
        <ModuleManager />
      </Stack> */}
    </Box>
  );
}
