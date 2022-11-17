import "./App.css";
import { PolywrapProvider } from "@polywrap/react";
import { getClientConfig } from "./lib/polywrap/config";
import { useMetaMask } from "metamask-react";
import { Spinner, Box } from "@chakra-ui/react";
import "react-notifications/lib/notifications.css";
import Header from "./components/Header";
import { RouterProvider } from "react-router";
import router from "./modules/router";

function App() {
  const { account, ethereum, status } = useMetaMask();

  const getContent = () => {
    switch (status) {
      case "initializing":
        return <Spinner />;
      case "connected": {
        return (
          <PolywrapProvider
            {...getClientConfig(
              ethereum.networkVersion || "",
              ethereum,
              account || ""
            )}
          >
            <RouterProvider router={router} />
          </PolywrapProvider>
        );
      }
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
