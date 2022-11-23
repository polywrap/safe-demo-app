import { Box, Image } from "@chakra-ui/react";
import React from "react";
import logoSrc from "../images/logo_triple.svg";

export default function HomeLogo() {
  return (
    <Box display={'flex'} alignItems='center' h={'calc(100vh - 54px)'}>
      <Image src={logoSrc} m='auto' />
    </Box>
  );
}
