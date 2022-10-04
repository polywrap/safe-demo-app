import "./App.css";
import { PolywrapProvider } from "@polywrap/react";
import { getClientConfig } from "./lib/polywrap/config";
import Safe from "./components/Safe";
import { useMetaMask } from "metamask-react";
import { Spinner, Container } from "@chakra-ui/react";
import "react-notifications/lib/notifications.css";
import Header from "./components/Header";

function App() {
  const { account, chainId, ethereum, status } = useMetaMask();

  const getContent = () => {
    switch (status) {
      case "initializing":
        return <Spinner />;
      case "connected": {
        return (
          <PolywrapProvider
            {...getClientConfig(chainId || "", ethereum, account || "")}
          >
            <Safe />
          </PolywrapProvider>
        );
      }
    }
  };
  return (
    <div className="app">
      <Header />
      <Container>{getContent()}</Container>
    </div>
  );
}

export default App;
