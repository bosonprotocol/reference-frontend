import jwt_decode from "jwt-decode";
import {
  authenticateUser,
  getAccountStoredInLocalStorage,
} from "../hooks/authenticate";
import { ModalResolver } from "../contexts/Modal";
import { MODAL_TYPES } from "../helpers/configs/Dictionary";

export const refreshTokenIfExpired = (
  rawToken,
  modalContext,
  library,
  chainId,
  account
) => {
  if (!isTokenValid(rawToken)) {
    const token = getDecodedAccessToken(rawToken);
    const localStoredAccountData = getAccountStoredInLocalStorage(token?.user);
    localStoredAccountData.active = false;

    modalContext.dispatch(
      ModalResolver.showModal({
        show: true,
        type: MODAL_TYPES.GENERIC_ERROR,
        content:
          "Your authentication has expired. Please sign another authentication message.",
      })
    );

    // eslint-disable-next-line no-self-assign
    authenticateUser(library, account, chainId, () => {
      window.location = window.location;
    });
  }
};
export const isTokenValid = (rawToken) => {
  const token = getDecodedAccessToken(rawToken);

  if (token) {
    if (new Date(token.exp).getTime() * 1000 <= new Date().getTime()) {
      return false;
    }
    return true;
  }
  return false;
};

const getDecodedAccessToken = (rawToken) => {
  if (!rawToken) {
    return null;
  }
  try {
    return jwt_decode(rawToken);
  } catch (Error) {
    return null;
  }
};
