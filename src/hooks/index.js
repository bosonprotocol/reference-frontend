import { useEffect, useState, useRef, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import copy from "copy-to-clipboard";
import { isMobile } from "react-device-detect";
import { NetworkContextName } from "../constants";
import { injected, walletconnect } from "../Connectors";
import {
  authenticateUser,
  createUnauthenticatedLocalStorageRecord,
  getAccountStoredInLocalStorage,
} from "./authenticate";
import { CONNECTOR_TYPES } from "../shared-components/wallet-connect/WalletConnect";

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

          const localStoredAccountData =
            getAccountStoredInLocalStorage(account);
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
