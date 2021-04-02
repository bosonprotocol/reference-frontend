import { useEffect, useState, useRef, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
// import { parseBytes32String } from "@ethersproject/strings";
import copy from "copy-to-clipboard";
import { isMobile } from "react-device-detect";
import { NetworkContextName } from "../constants";
import { injected, walletconnect } from "../Connectors";
import { parseLocalStorage } from "../utils/FormatUtils";
import {
  authenticateUser,
  createUnauthenticatedLocalStorageRecord,
  getAccountStoredInLocalStorage,
} from "./authenticate";
import { CONNECTOR_TYPES } from "../shared-components/wallet-connect/WalletConnect";
// import { useDefaultTokenList } from "../redux/lists/hooks";
// import { useTokenContract, useBytes32TokenContract } from "./useContract";

export function useLocalStorage(key, defaultValue, didChange = []) {
  const [value, setStateValue] = useState(
    parseLocalStorage(localStorage[key], key)
  );

  useEffect(() => {
    let initialValue = parseLocalStorage(localStorage[key], key);
    if (initialValue === null) {
      initialValue = defaultValue;
    }
    setStateValue(initialValue);
    // eslint-disable-next-line
  }, [didChange]);
  useEffect(() => {
    function onStorageUpdate(e) {
      if (e.detail.key !== key) return;
      setStateValue(parseLocalStorage(e.detail.value, e.detail.key));
    }

    window.addEventListener("newStorageValue", onStorageUpdate);
    return () => {
      window.removeEventListener("newStorageValue", onStorageUpdate);
    };
  }, [key, setStateValue]);

  function setValue(newValue) {
    newValue = JSON.stringify(newValue);
    localStorage[key] = newValue;
    setStateValue(newValue);
    const e = new CustomEvent("newStorageValue", {
      detail: { key, value: newValue },
    });
    window.dispatchEvent(e);
  }

  return [value, setValue];
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const lastActiveConnectorType = localStorage.getItem("previous-connector");

    if (lastActiveConnectorType === CONNECTOR_TYPES.WALLET_CONNECT) {
      const walletConnectData = localStorage.getItem("walletconnect");
      const walletConnectDataObject = JSON.parse(walletConnectData);

      if (walletConnectDataObject) {
        activate(walletconnect);
        return;
      }
    }

    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they are on
 */
export function useInactiveListener(suppress = false) {
  const { library, account, active, error, activate, chainId } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && account) {
      const handleChainChanged = () => {
        // ToDo: Add global notification for network changing

        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
          createUnauthenticatedLocalStorageRecord(newAccount);

          const localStoredAccountData = getAccountStoredInLocalStorage(
            account
          );
          if (!localStoredAccountData.activeToken) {
            await authenticateUser(library, newAccount, chainId);
          }

          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return;
  }, [active, error, suppress, activate, account, chainId, library]);
}

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback((text) => {
    const didCopy = copy(text);
    setIsCopied(didCopy);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => {
        clearTimeout(hide);
      };
    }
    return;
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy];
}

export function useActiveWeb3React() {
  const context = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);
  return context.active ? context : contextNetwork;
}

// export function useAllTokens() {
//     const { chainId } = useActiveWeb3React();
//     // TODO - store user-added tokens
//     const userAddedTokens = []; // useUserAddedTokens()
//     const allTokens = useDefaultTokenList();
//
//     return useMemo(() => {
//         if (!chainId) return {};
//         return (
//             userAddedTokens
//                 // reduce into all ALL_TOKENS filtered by the current chain
//                 .reduce(
//                     (tokenMap, token) => {
//                         tokenMap[token.address] = token;
//                         return tokenMap;
//                     },
//                     // must make a copy because reduce modifies the map, and we do not
//                     // want to make a copy in every iteration
//                     { ...allTokens[chainId] }
//                 )
//         );
//     }, [chainId, userAddedTokens, allTokens]);
// }

// parse a name or symbol from a token response
// const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

// function parseStringOrBytes32(str, bytes32, defaultValue) {
//     return str && str.length > 0
//         ? str
//         : bytes32 && BYTES32_REGEX.test(bytes32)
//             ? parseBytes32String(bytes32)
//             : defaultValue;
// }

// // undefined if invalid or does not exist
// // null if loading
// // otherwise returns the token
// export function useToken(tokenAddress) {
//     const { chainId } = useActiveWeb3React();
//     const tokens = useAllTokens();
//
//     const address = isAddress(tokenAddress);
//
//     const tokenContract = useTokenContract(address ? address : undefined, false);
//     const tokenContractBytes32 = useBytes32TokenContract(
//         address ? address : undefined,
//         false
//     );
//     const token = address ? tokens[address] : undefined;
//
//     const tokenName = useSingleCallResult(
//         token ? undefined : tokenContract,
//         "name",
//         undefined,
//         NEVER_RELOAD
//     );
//     const tokenNameBytes32 = useSingleCallResult(
//         token ? undefined : tokenContractBytes32,
//         "name",
//         undefined,
//         NEVER_RELOAD
//     );
//     const symbol = useSingleCallResult(
//         token ? undefined : tokenContract,
//         "symbol",
//         undefined,
//         NEVER_RELOAD
//     );
//     const symbolBytes32 = useSingleCallResult(
//         token ? undefined : tokenContractBytes32,
//         "symbol",
//         undefined,
//         NEVER_RELOAD
//     );
//     const decimals = useSingleCallResult(
//         token ? undefined : tokenContract,
//         "decimals",
//         undefined,
//         NEVER_RELOAD
//     );
//
//     return useMemo(() => {
//         if (token) return token;
//         if (!chainId || !address) return undefined;
//         if (decimals.loading || symbol.loading || tokenName.loading) return null;
//         if (decimals.result) {
//             return new Token(
//                 chainId,
//                 address,
//                 decimals.result[0],
//                 parseStringOrBytes32(
//                     symbol.result?.[0],
//                     symbolBytes32.result?.[0],
//                     "UNKNOWN"
//                 ),
//                 parseStringOrBytes32(
//                     tokenName.result?.[0],
//                     tokenNameBytes32.result?.[0],
//                     "Unknown Token"
//                 )
//             );
//         }
//         return undefined;
//     }, [
//         address,
//         chainId,
//         decimals.loading,
//         decimals.result,
//         symbol.loading,
//         symbol.result,
//         symbolBytes32.result,
//         token,
//         tokenName.loading,
//         tokenName.result,
//         tokenNameBytes32.result,
//     ]);
// }

// modified from https://usehooks.com/useDebounce/
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const VISIBILITY_STATE_SUPPORTED = "visibilityState" in document;

function isWindowVisible() {
  return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== "hidden";
}

/**
 * Returns whether the window is currently visible to the user.
 */
export function useIsWindowVisible() {
  const [focused, setFocused] = useState(isWindowVisible());
  const listener = useCallback(() => {
    setFocused(isWindowVisible());
  }, [setFocused]);

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return;

    document.addEventListener("visibilitychange", listener);
    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [listener]);

  return focused;
}
