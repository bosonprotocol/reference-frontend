import { ethers } from "ethers";

export const ErrorMessages = {
    NOT_ENOUGH_OF_CURRENCY_IN_ACCOUNT: (currency, txValueBn, amountInAccountBn) => `Currently you have ${ethers.utils.formatEther(amountInAccountBn)} ${currency} in your account, but you need ${ethers.utils.formatEther(txValueBn)}`,
    NO_VOUCHERS_LEFT_IN_SUPPLY: `Sorry. There seems to be no vouchers left.`,
    WALLET_ACCOUNT_NOT_CONNECTED: 'Please connect your wallet account',
    ACCOUT_OWNER_OF_VOUCHER_SET: 'The connected account is the owner of the voucher set'
    
}

export const smartContractToUserFriendlyErrorMapping = new Map([
    ['UNDEFINED_OWNER', ({account}) => `Unauthorised access for this ${account}. Please check the wallet connected.`],
    ['Pausable: not paused', () => 'The smart contracts have been paused. Please try again later.'],
    ['IN_FU', () => 'Invalid funds sent to the contract. Please try again and if the problem persist, file a bug report.'],

    ['INVALID_VALIDITY_FROM', () => 'Start date sent to the contract is before the end date. Please try again and if the problem persist, file a bug report.'],

    ['INVALID_VALIDITY_TO', () => 'End date send to the contract is invalid. Please try again and if the problem persist, file a bug report.'],
    ['INVALID_QUANTITY', () => 'Invalid voucher quantity send to the contract. Please try again and if the problem persist, file a bug report.'],
    ['UNAUTHORIZED_CO', ({account}) => `Unauthorised access for this ${account}. Please check the wallet connected. `],
    ['ERC20WithPermit: EXPIRED', () => 'Permit for tokens sending expired. Please file a bug report'],
    ['ERC20WithPermit: INVALID_SIGNATURE', () => 'Permit for tokens sending with invalid signature. Please file a bug report'],
    ['PROMISE_ALREADY_EXISTS', () => 'Voucher set already exist. Please check your offers. If the problem persist, file a bug report.'],
    ['IN_C', () => 'Wrong currency combination contract function called. Please file a bug report.'],
    ['IN_D', () => 'Invalid deposit send to the contract. Please try again and if the problem persist, file a bug report.'],
    ['IN_DE', () => 'Invalid deposit send to the contract. Please try again and if the problem persist, file a bug report.'],
    ['ALREADY_COMPLAINED', () => 'You have already complained successfuly. Please file a bug report if it takes more than a minute to see the relevant changes in the UI.'],
    ['ALREADY_FINALIZED', ({action}) => `Can't ${action}, since the voucher has already been finalized. Please file a bug report if it takes more than a minute to see the relevant changes in the UI.`],
    ['COMPLAINPERIOD_EXPIRED', ({action}) => `${action} period has expired.`],
    ['INAPPLICABLE_STATUS', ({action}) => `Can't ${action} in this state.`],
    ['UNAUTHORIZED_COF', () => `You are not the holder of this voucher set. Can't Cancel/Fault.`],
    ['ALREADY_CANCELFAULT', () => 'You have already cancel/faulted this voucher.'],
    ['ALREADY_FINALIZED', ({action}) => `Can't ${action}, since the voucher has already been finalized. Please file a bug report if it takes more than a minute to see the relevant changes in the UI.`],
    ['COFPERIOD_EXPIRED', ({action}) => `${action} period has expired.`],
    ['OFFER_EMPTY', ({action}) => `Can't ${action} a voucher set that has no vouchers left.`],
    ['ALREADY_PROCESSED', () => 'You have already redeemed this voucher successfuly. Please file a bug report if it takes more than a minute to see the relevant changes in the UI.'],
])