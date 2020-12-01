import { useActiveWeb3React } from "../../hooks";
import { useSelector } from "react-redux";

export function useBlockNumber() {
  const { chainId } = useActiveWeb3React();

  return useSelector((state) => state.application.blockNumber[chainId ?? -1]);
}
