import { SystemStyleObject } from "@chakra-ui/react";

export const navListStyles: SystemStyleObject = {
  display: "flex",
  flexDir: "column",
  gap: "4px",
  li: {
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "8px",
    a: {
      h: "100%",
      p: 2,
      display: "flex",
      justifyContent: "space-between",
      w: "100%",
    },
    "&.active": {
      bg: "silver",
    },
    "&:hover": {
      bg: "silver",
    },
  },
};

export const styles: SystemStyleObject = {
  p: "12px",
  border: "1px solid silver",
  w: "300px",
  h3: { fontSize: "24px" },
  ".accordion": {
    ".chakra-accordion__item": {
      mb: "4px",
      ".chakra-accordion__button": {
        bg: "silver",
        borderRadius: 4,
        fontWeight: "bold",
      },
      ".chakra-collapse": {
        ".chakra-accordion__panel": {
          px: "0",
          ul: navListStyles,
        },
      },
    },
  },
};

export default styles;
