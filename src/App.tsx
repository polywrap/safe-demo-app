import logo from "./logo.svg";
import "./App.css";
import { PolywrapProvider } from "@polywrap/react";

function App() {
  return (
    <PolywrapProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </PolywrapProvider>
  );
}

export default App;
