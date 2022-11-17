import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Root() {
  return (
    <Box display={"flex"} flexDirection="row" sx={{ w: "100%" }}>
      <Sidebar />
      <Container sx={{ h: "calc(100vh - 60px)", maxW: "100%", p: "20px" }}>
        <Outlet />
      </Container>
    </Box>
  );
}
