import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "./utils/NetworkConnector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  4: "https://rinkeby.infura.io/v3/653584f4572b4aa894dfa26281f834f2",
  1337: "http://localhost:8545"
};

export const SUPPORTED_CHAIN_IDS = [4, 1337];

// rinkeby
export const network = new NetworkConnector({
  urls: { 4: RPC_URLS[4] },
});

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

// rinkeby
export const walletconnect = new WalletConnectConnector({
  rpc: { 4: RPC_URLS[4] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
