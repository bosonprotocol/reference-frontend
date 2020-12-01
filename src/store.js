import Store from "./utils/store";
import { injected, walletconnect, walletlink } from "./connectors";

export const store = new Store({
    modal: null,
    account: {},
    web3: null,
    web3context: null,
    connectorsByName: {
        MetaMask: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        // Ledger: ledger,
        // Trezor: trezor,
        // Frame: frame,
        // Fortmatic: fortmatic,
        // Portis: portis,
        // Squarelink: squarelink,
        // Torus: torus,
        // Authereum: authereum
    },
    kChannels: {
        AuthenticationChallenge: null,
        jwt: null,
        channelDefinition: null,
        client: null,
        zoneLocation: null,
        assetList: [],
        channelStateHash: null,
        channelStatus: null,
        transactions: [],
    },
});
window.store = store;
