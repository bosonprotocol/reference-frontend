import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

const useClientLibraryProvider = () => {
  const { library, chainId } = useWeb3React();
  let provider;
  if (library) {
    provider = {
      provider: {
        network: {
          chainId,
        },
        connector: library.provider?.connector,
        send: library.send,
        signTypedData_v4: async function (account, data) {
          return await library.send("eth_signTypedData_v4", [
            account,
            JSON.stringify(data),
          ]);
        },
      },
    };
  }
  return useMemo(() => provider, [library, chainId]);
};

export { useClientLibraryProvider };
