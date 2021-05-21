import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import App from "./App";
import { NetworkContextName } from "./constants";
import { ClientLibrary } from "client-library";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const clientLibrary = new ClientLibrary(process.env.REACT_APP_BACKEND_BASE_URL);

export { clientLibrary };
function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <App />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
