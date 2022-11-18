import React, { useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { useInvokeManager } from "../hooks";
import { addSafe } from "../utils/localstorage";
import { useNavigate } from "react-router";
import { SAFE_DETAILS } from "../modules/router/routes";

export default function AddSafe() {
  const [safeAddress, setSafeAddress] = useState<string>("");
  const navigate = useNavigate();

  const [getOwners] = useInvokeManager("getOwners", safeAddress);

  const validateSafeAddress = async () => {
    const safeOwners = await getOwners({});
    const safeHasOwners = safeOwners.ok;
    return safeHasOwners;
  };

  const handleAddSafe = async () => {
    const validated = await validateSafeAddress();
    if (validated) {
      addSafe(safeAddress);
      navigate(`/${safeAddress}/${SAFE_DETAILS}`);
    }
  };

  return (
    <Box>
      <Input
        placeholder={"Safe Address"}
        value={safeAddress}
        onChange={(e) => setSafeAddress(e.target.value)}
        mb="12px"
      />
      <Button onClick={handleAddSafe}>Add Safe</Button>
    </Box>
  );
}
