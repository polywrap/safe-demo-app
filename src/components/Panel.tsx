import React from "react";
import { Box, SystemStyleObject } from "@chakra-ui/react";

type Props = React.PropsWithChildren<{ sx?: SystemStyleObject }>;

export default function Panel({ sx, children }: Props) {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function PanelHead({ sx, children }: Props) {
  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(5px)",
        p: "20px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function PanelBody({ sx, children }: Props) {
  return (
    <Box
      sx={{
        background: "#FFFFFF",
        backdropFilter: "blur(5px)",
        p: "20px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
