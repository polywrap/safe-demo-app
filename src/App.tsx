import "./App.css";
import { PolywrapProvider } from "@polywrap/react";
import { getBuilderConfig } from "./client-config";
import { useMetaMask } from "metamask-react";
import { Spinner, Box } from "@chakra-ui/react";
import "react-notifications/lib/notifications.css";
import Header from "./components/Header";
import { RouterProvider } from "react-router";
import router from "./modules/router";
import HomeLogo from "./components/HomeLogo";

function App() {
  const { account, ethereum, status } = useMetaMask();

  const getContent = () => {
    switch (status) {
      case "initializing":
        return <Spinner />;
      case "connected": {
        return (
          <PolywrapProvider
            {...getBuilderConfig(
              ethereum.networkVersion || "",
              ethereum,
              account || ""
            )}
          >
            <RouterProvider router={router} />
          </PolywrapProvider>
        );
      }
      default:
        return <HomeLogo />;
    }
  };
  return (
    <div className="app">
      <Header />
      <Box>{getContent()}</Box>
    </div>
  );
}

export default App;
