import React from "react";
import ReactDOM from "react-dom/client";
import { MetaMaskProvider } from "metamask-react";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <MetaMaskProvider>
        <App />
      </MetaMaskProvider>
    </ChakraProvider>
  </React.StrictMode>
);
