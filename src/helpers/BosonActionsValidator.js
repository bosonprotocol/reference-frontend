import { smartContractToUserFriendlyErrorMapping } from "../constants/ErrorMessages";

export const validateContractInteraction = async (contract, actionName, params) => {
    let complaintUserFriendlyErrorMessageMaker = () => '';

    try {
        if(params) {
            await contract.callStatic[actionName](...params)
        } else {
            await contract.callStatic[actionName]()
        }
    } catch(e) {
        console.log(e)
        try {
            const smartContractsErrorMessage = extractErrorMessageFromError(e);
            complaintUserFriendlyErrorMessageMaker = smartContractToUserFriendlyErrorMapping.get(smartContractsErrorMessage);
            
            if(!complaintUserFriendlyErrorMessageMaker) {
                throw(e);
            }
        } catch(e) {
            complaintUserFriendlyErrorMessageMaker = () => 'Unknown error occured, please try again later and if the problem persist, see the console for details/contact administrator'
        }
    }
    
    return complaintUserFriendlyErrorMessageMaker;
}

const extractErrorMessageFromError = (e) => {
    return e.error.message.split('execution reverted:')[1].trim();
}

