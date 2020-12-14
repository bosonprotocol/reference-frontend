import React, { useEffect, useState, useRef, useContext } from "react";
import Web3 from "web3";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "../../hooks";
import { shortenAddress, getSigner, formatEIP712Data } from "../../utils";
import Modal from "../Modal";
import { injected, walletconnect } from "../../connectors";
import WalletConnectIcon from "../../images/walletconnect.svg";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";
import Identicon from "../Identicon";
import CopyHelper from "../../copyHelper";
import './WalletConnect.scss'
import { WalletContext } from "../../contexts/Wallet";
import { splitSignature } from 'ethers/lib/utils'

// ToDo: Move next imports in util files
import apiService from "../../utils/api";
import * as ethers from 'ethers'

export const WALLET_VIEWS = {
    OPTIONS: "options",
    OPTIONS_SECONDARY: "options_secondary",
    ACCOUNT: "account",
    PENDING: "pending",
};

export function getWalletTitle({ account, walletView, setWalletView }) {
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
        return <h1 className="account-title">Account</h1>;
    }
    if (account && walletView === WALLET_VIEWS.OPTIONS) {
        return (
            <button
                onClick={ () => setWalletView(WALLET_VIEWS.ACCOUNT) }
                className="button primary"
            >
                Back
            </button>
        );
    }
    if (!account) {
        return <h1 className="account-title">Connect to a wallet</h1>;
    }
}

export default function ModalWalletConnect({ modal, setModal }) {
    const context = useWeb3React();
    const { account } = context;
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

    return (
        <Modal
            title={ getWalletTitle({ account, walletView, setWalletView }) }
            setModal={ setModal }
            modal={ modal }
        >
            <InnerModal isAccount={ account && walletView === WALLET_VIEWS.ACCOUNT }>
                <WalletConnect
                    onSuccess={ () => setModal(null) }
                    walletView={ walletView }
                    setWalletView={ setWalletView }
                />
            </InnerModal>
        </Modal>
    );
}

export async function signMessage(library, account, chainId) {

    const web3 = new Web3(library.provider);

    const msgParams = JSON.stringify(
        formatEIP712Data()
    );
    const params = [account, msgParams];
    const method = "eth_signTypedData_v4";
    web3.currentProvider.sendAsync(
        {
            method,
            params,
            account,
        },
        async (err, result) => {
            console.log(err);
            console.log(result);

            const domain = {
                name: 'Boson Protocol',
                version: '1',
                chainId: '4',
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
            };

            const types = {
                Message: [
                    { name: 'content', type: 'string' }
                ]
            };

            const message = {
                content: 'udri'
            };

            let verifiedAddress = ethers.utils.verifyTypedData(domain, types, message, result.result)
            console.log(verifiedAddress);
        }
    );
}

// ToDo: Move below util functions to separate files
const authenticateUser = async (library, account) => {
    const signer = getSigner(library, account);
    const signerAddress = await signer.getAddress();
    console.log("udri");
    console.log(signerAddress);

    const nonce = (await apiService.generateNonce(signerAddress)).data;
    console.log(nonce);

    const signature = await signMessage(signer, nonce);
    console.log(signature);

    const verified = ethers.utils.verifyMessage('\x19Ethereum Signed Message:\n' + nonce, signature);

    console.log(verified);

    console.log(verified === signerAddress);

    // const jwt = (await apiService.verifySignature(signerAddress, signature)).data;

    // console.log(jwt);
    //
    // updateAuthToken(signerAddress, jwt)
};

const authenticateUserWalletConnect = async (library, account) => {
    const signer = getSigner(library, account);
    console.log("Wallet connect signer:");
    console.log(signer);
    const signerAddress = await signer.getAddress();

    const rawMessage = "Hello World";
    const rawMessageLength = new Blob([rawMessage]).size;
    let message = ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + rawMessageLength + rawMessage);
    message = ethers.utils.keccak256(message);
    const params = [
        signerAddress,
        message
    ];
    const signature = await library.provider.connector.signMessage(params);
    console.log(signature);

    const verified = ethers.utils.verifyMessage(rawMessage, signature);

    console.log(verified);

    console.log(verified === signerAddress);
};

const signMessageMetaMask = async (signer, nonce) => {
    const msg = '\x19Ethereum Signed Message:\n' + nonce
    return await signer.signMessage(ethers.utils.toUtf8Bytes(msg));
};

const updateAuthToken = (userAddress, token, active = true) => {
    const AUTH_ADDRESSES_KEY = "authAddresses"

    let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));

    const addressToLower = userAddress.toLowerCase();
    let updatedUserInfo = {
        address: addressToLower,
        authToken: token,
        activeToken: active
    };

    if (!Array.isArray(allAddresses)) {
        allAddresses = [updatedUserInfo]
    }

    let updatedLS = [...allAddresses.filter(e => e.address != addressToLower)];
    updatedLS.push(updatedUserInfo);

    localStorage.setItem(AUTH_ADDRESSES_KEY, JSON.stringify(updatedLS))
};

const ethersVersionOfSigning = async (library, account) => {
    const signer = getSigner(library, account);

    const test = {
        name: "EIP712 example",
        domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 4,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        primaryType: "Mail",
        types: {
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' }
            ],
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' }
            ]
        },
        data: {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
            },
            contents: 'Hello, Bob!'
        },
        encoded: "0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2fc71e5fa27ff56c350aa531bc129ebdf613b772b6604664f5d8dbe21b85eb0c8cd54f074a4af31b4411ff6a60c9719dbd559c221c8ac3492d9d872b041d703d1b5aadf3154a261abdd9086fc627b61efca26ae5702701d05cd2305f7c52a2fc8",
        digest: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
        privateKey: "0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4",
        signature: "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c"
    };

    const wallet = new ethers.Wallet(test.privateKey);
    console.log(wallet);
    const signature = await wallet._signTypedData(test.domain, test.types, test.data);
    console.log(signature);
    console.log("^^^walet --- signer");
    let verifiedWalletAddress = ethers.utils.verifyTypedData(test.domain, test.types, test.data, signature);
    console.log("@@@@@@@@@@@@@@@@@@@@@");
    console.log(verifiedWalletAddress);

    await signer.getAddress();
    console.log(signer);
    const signatureMeta = await signer._signTypedData(test.domain, test.types, test.data);
    console.log(signatureMeta);

    let verifiedAddress = ethers.utils.verifyTypedData(test.domain, test.types, test.data, signatureMeta);

    console.log("#########################");
    console.log(verifiedAddress);

    // wallet._signTypedData(test.domain, test.types, test.data)
    //     .then(signature => {
    //         console.log(signature);
    //         console.log(test.signature);
    //
    //         let verifiedAddress = ethers.utils.verifyTypedData(test.domain, test.types, test.data, signature);
    //         console.log(verifiedAddress);
    //         console.log("-------");
    //         console.log("0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826");
    //     });


    // signer.getAddress().then(walletAddress => {
    //     signer._signTypedData(test.domain, test.types, test.data)
    //         .then(signature => {
    //             console.log(signature);
    //             console.log(test.signature);
    //             // let verifiedAddress = ethers.utils.verifyTypedData(test.domain, test.types, test.data, signature);
    //             // if (verifiedAddress !== walletAddress) {
    //             //     alert(`Signed by: ${ verifiedAddress }\r\nExpected: ${ walletAddress }`)
    //             // }
    //         })
    // })
};

const uniSwapVersion = async (library, account) => {
    const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
    ];
    const domain = {
        name: 'Uniswap V2',
        version: '1',
        chainId: 4, //ToDo: get chain id
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
    };
    const AuthSignature = [
        { name: 'value', type: 'string' },
    ];
    const message = {
        value: "Sign message: 92292"
    };
    const data = JSON.stringify({
        types: {
            EIP712Domain,
            AuthSignature
        },
        domain,
        primaryType: 'AuthSignature',
        message
    });

    library
        .send('eth_signTypedData_v4', [account, data])
        .then(splitSignature)
        .then(signature => {
            console.log(signature);
            let verifiedWalletAddress = ethers.utils.verifyTypedData(domain, {
                AuthSignature
            }, message, signature);
            console.log("Verified wallet address:");
            console.log(verifiedWalletAddress);

        })
        .catch(error => {
            console.log(error);
        })
};

export function WalletConnect({
                                  onSuccess,
                                  setWalletView,
                                  walletView = WALLET_VIEWS.ACCOUNT,
                              }) {
    const isMounted = useRef(false);
    const context = useWeb3React();
    const {
        chainId,
        connector,
        library,
        account,
        activate,
        active,
        error,
    } = context;

    const walletContext = useContext(WalletContext);
    const connectorsByName = walletContext.walletState.connectorsByName;

    const previousAccount = usePrevious(account);

    console.log("Library ---------------");
    console.log(library);
    console.log(library?.provider.connector);
    console.log(connector);

    console.log("Account ----------------");
    console.log(account);

    // close on connection, when logged out before
    useEffect(() => {
        if (isMounted.current && account && !previousAccount) {
            if (onSuccess) onSuccess();
        }
    }, [account, previousAccount, onSuccess]);

    // close modal when a connection is successful
    const activePrevious = usePrevious(active);
    const connectorPrevious = usePrevious(connector);
    useEffect(() => {
        if (!chainId) return;
        if (
            isMounted.current &&
            ((active && !activePrevious) ||
                (connector && connector !== connectorPrevious && !error))
        ) {
            if (setWalletView) setWalletView(WALLET_VIEWS.ACCOUNT);
            // if (window.location.search)
            //     signMessage({ account, chainId, library }, connector);
        }
    }, [
        setWalletView,
        active,
        error,
        chainId,
        connector,
        activePrevious,
        connectorPrevious,
    ]);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    function onConnectionClicked(name) {
        const current = connectorsByName[name];
        activate(current);
    }

    useEffect(async () => {
        if (library && account) {
            // await authenticateUser(library, account);
            // await authenticateUserWalletConnect(library, account);
            // await signMessage(library, account, chainId)
            // ethersVersionOfSigning(library, account);
            uniSwapVersion(library, account)
        }
    }, [library, account]);


    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
        return <WalletAccount setWalletView={ setWalletView }/>;
    }


    return (
        <>
            <WalletListItem
                name={ "MetaMask" }
                imageName={ MetaMaskLogo }
                isActive={ connector === injected }
                onClick={ () => onConnectionClicked("MetaMask") }
            />
            <WalletListItem
                name={ "WalletConnect" }
                imageName={ WalletConnectLogo }
                isActive={ connector === walletconnect }
                onClick={ () => {
                    // if the user has already tried to connect, manually reset the connector
                    if (connector?.walletConnectProvider?.wc?.uri) {
                        connector.walletConnectProvider = undefined;
                    }
                    onConnectionClicked("WalletConnect");
                } }
                imageStyle={ { height: "100%", width: "100%" } }
            />
        </>
    );
}

function InnerModal({ children, isAccount }) {
    return <div className={ "pa4 " + (isAccount ? "pt0" : "") }>{ children }</div>;
}

function WalletListItem({
                            name,
                            imageName,
                            onClick,
                            isActive,
                            imageStyle = {},
                        }) {
    return (
        <div
            onClick={ onClick ? onClick : null }
            className={ classNames(
                "wallet-list-item",
                {
                    "hover-b--primary5": !isActive,
                    "active-connector": isActive,
                }
            ) }
        >
            <div className="">
                { isActive ? (
                    <div className="">
                        <div
                            className=""
                            style={ { height: "8px", width: "8px" } }
                        >
                            <div/>
                        </div>
                    </div>
                ) : null }
                { name }
            </div>
            <div className="wallet-list-item-image-holder">
                <img
                    src={ imageName }
                    alt={ name + "-" + imageName }
                    style={ imageStyle }
                />
            </div>
        </div>
    );
}

function WalletAccount({ setWalletView }) {
    const { account, connector } = useWeb3React();

    function getStatusIcon() {
        if (connector === injected) {
            return <Identicon/>;
        } else if (connector === walletconnect) {
            return (
                <div className="">
                    <img src={ WalletConnectIcon } alt={ "walletconnect logo" }/>
                </div>
            );
        }
    }

    function getName() {
        if (connector === injected) {
            return "MetaMask";
        } else if (connector === walletconnect) {
            return "WalletConnect";
        }
    }

    return (
        <div className="connected-account">
            <div className="connected-with">
                <div className="connected-with-title">Connected with { getName() }</div>
                <button
                    className="button primary change-connector-button"
                    onClick={ () => setWalletView(WALLET_VIEWS.OPTIONS) }
                >
                    Change
                </button>
            </div>
            <div className="connected-account-address-holder">
                <div className="connected-account-address">
                    { getStatusIcon() }
                    <span className="">{ shortenAddress(account) }</span>
                </div>
                <div className="copy-account-address">
                    <CopyHelper toCopy={ account }>
                        <span style={ { marginLeft: "4px" } }>Copy Address</span>
                    </CopyHelper>
                </div>
            </div>
        </div>
    );
}
