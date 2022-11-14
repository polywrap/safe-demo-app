import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import closeImg from "../images/close.svg";

type Props = {
  value: string;
  onRemove: any;
};

export default function AddressPanel({ value, onRemove }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",

        p: "16px 14px 16px 20px",
        background:
          "linear-gradient(138.32deg, rgba(0, 140, 115, 0.3) 14.45%, rgba(228, 122, 61, 0.3) 86.56%)",
        boxShadow: "0px 1.69912px 32px rgba(0, 0, 0, 0.16)",
        backdropFilter: "blur(5px)",
        borderRadius: "212.389px",
      }}
    >
      <Text as={"span"}>{value}</Text>
      <Image src={closeImg} sx={{ cursor: "pointer" }} />
    </Box>
  );
}

export const AddressList = ({ addressess }: { addressess: string[] }) => {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {addressess.map((a) => (
        <AddressPanel value={a} onRemove={""} />
      ))}
    </Box>
  );
};
