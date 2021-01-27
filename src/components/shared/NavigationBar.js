import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { useLocation } from 'react-router-dom';

import "./NavigationBar.scss"

import { IconAccount, IconAdd, IconList, IconQR } from "./Icons"

import { GlobalContext } from "../../contexts/Global"
import { BuyerContext, Buyer } from "../../contexts/Buyer"
import { DIC, MODAL_TYPES, ROUTE } from "../../helpers/Dictionary"
import { useWeb3React } from "@web3-react/core";
import ContractInteractionButton from "./ContractInteractionButton";
import { decodeData, getEncodedTopic, useCashierContract } from "../../hooks/useContract";
import * as ethers from "ethers";
import { ModalContext, ModalResolver } from "../../contexts/Modal";
import VOUCHER_KERNEL from './../../hooks/ABIs/VoucherKernel';
import { SMART_CONTRACTS_EVENTS } from "../../hooks/configs";
import { commitToBuy } from "../../hooks/api";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import Loading from "../offerFlow/Loading";
import { useHistory } from 'react-router-dom';

function NavigationBar(props) {
    const globalContext = useContext(GlobalContext)
    const buyerContext = useContext(BuyerContext)
    const modalContext = useContext(ModalContext);
    const [transitionState, setTransitionState] = useState(0)
    const [transitionTrigger, setTransitionTrigger] = useState(0)
    const [loading, setLoading] = useState(0)

    const { library, account } = useWeb3React();
    const location = useLocation();

    const { delay } = props
    const aniamtionTimout = 300


    useEffect(() => {
        // use this to compare {previus} screen and {current} screen
        // setTransitionTrigger(transitionState)
        setTransitionTrigger('out')

        setTimeout(() => {
            setTransitionState(globalContext.state.navigation.state)
            setTransitionTrigger('in')
        }, aniamtionTimout);
    }, [globalContext.state.navigation.state])

    const history = useHistory();

    function getSelectedVoucherSet() {
        let productsReviewed = localStorage.getItem('productsReviewed') ? JSON.parse(localStorage.getItem('productsReviewed')) : false
        if (!productsReviewed) {
            return;
        }

        return globalContext.state.allVoucherSets.find(x => x.id === productsReviewed[productsReviewed.length - 1]);
    }

    const cashierContract = useCashierContract();

    async function onCommitToBuy() {
        if (!library || !account) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please connect your wallet account'
            }));
            return;
        }

        const authData = getAccountStoredInLocalStorage(account);

        if (!authData.activeToken) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed'
            }));
            return;
        }

        setLoading(1)

        const voucherSetInfo = getSelectedVoucherSet();

        if (voucherSetInfo.voucherOwner.toLowerCase() === account.toLowerCase()) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'The connected account is the owner of the voucher set'
            }));
            return;
        }

        console.log(voucherSetInfo)

        const price = ethers.utils.parseEther(voucherSetInfo.price).toString();
        const buyerDeposit = ethers.utils.parseEther(voucherSetInfo.buyerDeposit).toString();
        const txValue = ethers.BigNumber.from(price).add(buyerDeposit);
        const supplyId = voucherSetInfo.setId;
        

        let tx;
        let metadata = {};
        let data;

        try {
            tx = await cashierContract.requestVoucher_ETH_ETH(supplyId, voucherSetInfo.voucherOwner, {
                value: txValue.toString()
            });

            const receipt = await tx.wait();

            let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherCreated);

            data = await decodeData(receipt, encodedTopic, ['uint256', 'address', 'address', 'bytes32']);

        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
            return;
        }

        metadata = {
            _tokenIdSupply: supplyId,
            _tokenIdVoucher: data[0].toString(),
            _issuer: data[1],
            _holder: data[2]
        };

        try {
            const commitToBuyResponse = await commitToBuy(voucherSetInfo.id, metadata, authData.authToken);
            console.log(commitToBuyResponse);

            history.push(ROUTE.ActivityVouchers)
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }

        setLoading(0)
    }

    return (
        <div>
            { loading ? <Loading/> : null }
            <nav className={ `navigation-bar flex ${ transitionState } ${ transitionTrigger }` }>
                <div className="nav-container flex center">
                    { transitionState === DIC.NAV.DEF ?
                        <div className={ `control-wrap flex center ${ DIC.NAV.DEF }` }>
                            <div className="control list flex center" role="button">
                                <IconList/>
                            </div>
                            <div className="control add-product flex center animate" role="button"
                                 style={ { transitionDelay: delay } }>
                                <Link to={ ROUTE.NewOffer }><IconAdd/></Link>
                            </div>
                            <div className="control account flex center" role="button">
                                <Link to={ ROUTE.ActivityVouchers }><IconAccount/></Link>
                            </div>
                        </div> : null
                    }
                    { transitionState === DIC.NAV.COMMIT ?
                        <div className={ `control-wrap ${ DIC.NAV.COMMIT }` }>
                            <div className="flex center" role="button"
                                 onClick={ () => buyerContext.dispatch(Buyer.commitToBuy()) }
                            >
                                <ContractInteractionButton
                                    className="button -green"
                                    handleClick={ onCommitToBuy }
                                    label="COMMIT TO BUY"
                                    sourcePath={ location.pathname }
                                />
                            </div>
                        </div> : null
                    }
                    { transitionState === DIC.NAV.REDEEM ?
                        <div className="control-wrap">
                            <div className="control redeem list flex center" role="button">
                                <Link to={ ROUTE.ShowQR }><IconQR size="21" color="#FFFFFF"/> REDEEM</Link>
                            </div>
                        </div> : null
                    }
                </div>
            </nav>
        </div>
    )
}

export default NavigationBar
