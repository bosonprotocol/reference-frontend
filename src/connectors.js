import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "./utils/networkConnector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: "https://mainnet.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
    4: "https://rinkeby.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
    42: "https://kovan.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
};

// rinkeby
export const network = new NetworkConnector({
    urls: { 1: RPC_URLS[4] },
});

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 100],
});

// rinkeby
export const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[4] },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

// rinkeby
export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[4],
    appName: "Boson Protocol",
});
