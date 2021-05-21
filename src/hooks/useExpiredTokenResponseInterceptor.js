import { ModalContext } from "../contexts/Modal";
import { refreshTokenIfExpired } from "../utils/Auth";
import { axiosInstance } from "./api";
import { useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useClientLibraryProvider } from "./useClientLibraryProvider";

export const useExpiredTokenResponseInterceptor = () => {
  const modalContext = useContext(ModalContext);
  const context = useWeb3React();
  const { account, library, chainId } = context;
  const clientLibraryProvider = useClientLibraryProvider();

  useEffect(() => {
    if (account && library && chainId && modalContext) {
      axiosInstance.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            const jwtTokenSent =
              error?.config?.headers?.Authorization?.split(" ")[1];
            if (jwtTokenSent) {
              refreshTokenIfExpired(
                jwtTokenSent,
                modalContext,
                clientLibraryProvider,
                account
              );
              console.log(error);
            }
          }
          return Promise.reject(error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return true;
};
