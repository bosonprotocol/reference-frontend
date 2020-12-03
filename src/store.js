import Store from "./utils/store";
import { injected, walletconnect } from "./connectors";

export const store = new Store({
    modal: null,
    account: {},
    web3: null,
    web3context: null,
    connectorsByName: {
        MetaMask: injected,
        WalletConnect: walletconnect,
    },
});
window.store = store;
