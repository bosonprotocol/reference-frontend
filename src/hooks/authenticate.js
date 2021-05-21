import { clientLibrary } from "..";

export const AUTH_ADDRESSES_KEY = "authAddresses";

export const authenticateUser = async (
  library,
  account,
  chainId,
  successCallback
) => {
console.log(library._network, library._connector)
  const web3Provider = {
    provider: {
      network: library._network,
      connector: library._connector,
      send: library.send,
      signTypedData_v4: async function (account, data) {
        return await library.send("eth_signTypedData_v4", [
          account, 
          data,
        ]);
      },
    }
  }
 const jwt = await clientLibrary.authenticateUser(account, web3Provider);

  updateAuthToken(account, jwt);
  if (successCallback) {
    successCallback();
  }
};

export const updateAuthToken = (userAddress, token, active = true) => {
  let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));

  const addressToLower = userAddress.toLowerCase();
  let updatedUserInfo = {
    address: addressToLower,
    authToken: token,
    activeToken: active,
  };

  if (!Array.isArray(allAddresses)) {
    allAddresses = [updatedUserInfo];
  }

  let updatedLS = [...allAddresses.filter((e) => e.address !== addressToLower)];
  updatedLS.push(updatedUserInfo);

  localStorage.setItem(AUTH_ADDRESSES_KEY, JSON.stringify(updatedLS));
};

export const createUnauthenticatedLocalStorageRecord = (accountAddress) => {
  let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));
  let updatedAddress = {
    address: `${accountAddress.toLowerCase()}`,
    authToken: "",
    activeToken: false,
  };

  if (!Array.isArray(allAddresses)) {
    allAddresses = [updatedAddress];
  }

  if (!allAddresses.some((e) => e.address === accountAddress)) {
    allAddresses.push(updatedAddress);
  }

  localStorage.setItem(AUTH_ADDRESSES_KEY, JSON.stringify(allAddresses));
};

export const getAccountStoredInLocalStorage = (userAddress) => {
  let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));
  if (!userAddress || !Array.isArray(allAddresses)) {
    return "";
  }

  const addressToLower = userAddress.toLowerCase();
  const record = allAddresses.find((e) => e.address === addressToLower);

  return record ? record : "";
};
