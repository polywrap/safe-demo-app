import "./App.css";
import { PolywrapProvider } from "@polywrap/react";
import { getClientConfig } from "./lib/polywrap/config";
import DeployForm from "./components/DeployForm";
import { useMetaMask } from "metamask-react";
import { Spinner, Container } from "@chakra-ui/react";
import "react-notifications/lib/notifications.css";
import Header from "./components/Header";
import Manager from "./components/Manager";

function App() {
  const { account, chainId, ethereum, status } = useMetaMask();

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
            <Manager />
            <DeployForm />
          </PolywrapProvider>
        );
      }
    }
  };
  return (
    <div className="app">
      <Header />
      <Container sx={{ maxW: "fit-content" }}>{getContent()}</Container>
    </div>
  );
}

export default App;
