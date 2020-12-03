import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { NetworkContextName } from "./constants";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

ReactDOM.render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={ getLibrary }>
            <Web3ProviderNetwork getLibrary={ getLibrary }>
                <App/>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
