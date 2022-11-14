import { defineStyleConfig, extendTheme } from "@chakra-ui/react";

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "20px",
    borderRadius: "8px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "16px",
      px: "9px", // <-- px is short for paddingLeft and paddingRight
      py: "19px", // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      px: "37px", // <-- these values are tokens from the design system
      py: "16px", // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "purple.500",
      color: "purple.500",
    },
    solid: {
      bg: "orange.500",
      color: "white",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  },
});

const theme = extendTheme({
  colors: {
    orange: { 500: "#E47A3D" },
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
  components: { Button },
});

export default theme;
