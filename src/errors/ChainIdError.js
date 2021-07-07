export class ChainIdError extends Error {
  constructor() {
    super(
      "Wrong network used. Please ensure your wallet is connected to the Rinkeby test network."
    );
  }
}
