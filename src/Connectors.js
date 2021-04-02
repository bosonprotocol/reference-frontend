import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "./utils/NetworkConnector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
  4: "https://rinkeby.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
  5: "https://goerli.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
  42: "https://kovan.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
};

export const NETWORK_ID = 5;

// rinkeby
export const network = new NetworkConnector({
  urls: { 5: RPC_URLS[5] },
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 100],
});

// rinkeby
export const walletconnect = new WalletConnectConnector({
  rpc: { 5: RPC_URLS[5] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
