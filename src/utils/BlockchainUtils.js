import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { isMobile } from "@walletconnect/utils";

export const ChainId = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
};

export const ChainLabels = {
  1: "MAINNET",
  3: "ROPSTEN",
  4: "RINKEBY",
  5: "GÖRLI",
  42: "KOVAN",
};

export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export const waitForRecentTransactionIfSuchExists = (
  library,
  voucherDetails,
  voucherSetDetails,
  setRecentlySignedTxHash,
  setSuccessMessage,
  setSuccessMessageType
) => {
  console.log("in wait func");
  const localStorageList =
    JSON.parse(localStorage.getItem("recentlySignedTxIdToSupplyIdList")) || [];

  const recentlySignedTxHash = voucherDetails
    ? localStorageList
        .filter((x) => x.supplyId === voucherDetails._tokenIdVoucher)
        .map((x) => x.txHash)[0]
    : localStorageList
        .filter((x) => x.supplyId === voucherSetDetails._tokenIdSupply)
        .map((x) => x.txHash)[0];
  if (recentlySignedTxHash) {
    const getTxReceiptAndCheckForCompletion = async () => {
      const receipt = await library.getTransactionReceipt(recentlySignedTxHash);
      if (!receipt) {
        setRecentlySignedTxHash(recentlySignedTxHash);

        const awaitForTx = async () => {
          await library.waitForTransaction(recentlySignedTxHash);
          const localStorageListWithDeletedTx = localStorageList.filter(
            (x) => x.txHash !== recentlySignedTxHash
          );
          localStorage.setItem(
            "recentlySignedTxIdToSupplyIdList",
            JSON.stringify(localStorageListWithDeletedTx)
          );
        };
        await awaitForTx();

        setSuccessMessage(localStorage.getItem("successMessage"));
        setSuccessMessageType(localStorage.getItem("successMessageType"));
      }
    };
    getTxReceiptAndCheckForCompletion();
  }
};
export const setTxHashToSupplyId = (txHash, supplyId) => {
  const localStorageList =
    JSON.parse(localStorage.getItem("recentlySignedTxIdToSupplyIdList")) || [];
  const newList = localStorageList.filter((x) => x.supplyId !== supplyId);
  newList.push({ supplyId, txHash });
  localStorage.setItem(
    "recentlySignedTxIdToSupplyIdList",
    JSON.stringify(newList)
  );
};

export const handleAccountChangedMetaMaskBrowser = (
  previousAccount,
  account
) => {
  const { ethereum } = window;
  const isMetaMask = !!(ethereum && ethereum.isMetaMask);

  if (
    isMetaMask &&
    isMobile() &&
    previousAccount &&
    previousAccount !== account
  ) {
    window.location.reload();
    // eslint-disable-next-line no-self-assign
    window.location = window.location;
  }
};
