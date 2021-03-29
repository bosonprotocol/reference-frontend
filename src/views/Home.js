/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from 'react'

import "./Home.scss"


import ProductBlock from "../components/home/ProductBlock";
import CardBlock from "../components/home/CardBlock";
import CategoryMenu from "../components/home/CategoryMenu"
// import ProductListing from "../components/home/ProductListing"
import Onboarding from '../views/Onboarding'
import QRCodeScanner from "../components/shared/QRCodeScanner"

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import "swiper/swiper.min.css"

import { productListSettings } from "../helpers/SliderSettings"

import { cardBlocks } from "../PlaceholderAPI"

import { GlobalContext, Action } from "../contexts/Global"

import { useWeb3React } from "@web3-react/core";
import { authenticateUser, getAccountStoredInLocalStorage } from "../hooks/authenticate";

SwiperCore.use([Navigation]);

function Home() {
    const [productBlocks, setProductBlocks] = useState([]);
    const [productBlocksFiltered, setProductBlocksFiltered] = useState(false);
    const homepage = useRef()
    const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
    const screensRef = useRef()
    const onboardingModalRef = useRef()

    const [pageLoading, setPageLoading] = useState(1)

    const {account, library, chainId} = useWeb3React();

    const globalContext = useContext(GlobalContext)

    const loadingPlaceholder = <div className="slider"><div className="block is-loading"><div className="text is-loading"></div>
    <div className="text is-loading"></div></div><div className="block is-loading"><div className="text is-loading"></div>
    <div className="text is-loading"></div></div><div className="block is-loading"><div className="text is-loading"></div>
    <div className="text is-loading"></div></div></div>

    const voucherSets = globalContext.state.allVoucherSets

    const modalCloseTimeout = 900;

    useEffect(() => {
        if(voucherSets) {
            // filter by "expiry date in future" and "don't show voucher sets to their creator/supplier"
            setProductBlocks(voucherSets.filter(x => new Date(x?.expiryDate) > new Date() && x.voucherOwner !== account.toLowerCase()));
            productListSettings.infinite = voucherSets.length > 4;
        } else {
            setProductBlocks([])
        }
    }, [voucherSets, globalContext.state.checkAccountUpdate])

    const completeOnboarding = () => {
        localStorage.setItem('onboarding-completed', '1')
        globalContext.dispatch(Action.completeOnboarding())

        onboardingModalRef.current.classList.add('fade-out')
        screensRef.current.classList.add('onboarding-done')

        setTimeout(() => {
            setNewUser(false)
        }, modalCloseTimeout);

        if (!account) {
            return;
        }

        const localStoredAccountData = getAccountStoredInLocalStorage(account);
        const onboardingCompleted = localStorage.getItem('onboarding-completed');

        if (!onboardingCompleted || localStoredAccountData.activeToken) {
            return;
        }

        authenticateUser(library, account, chainId);
    }

    useEffect(() => {
        if(productBlocks?.length) setProductBlocksFiltered(productBlocks?.filter((block) => block?.qty > 0 ))
    }, [productBlocks])

    useEffect(() => {
        if(productBlocksFiltered !== false) setPageLoading(0)
    }, [productBlocksFiltered])

    return (
        <>

            { globalContext.state.qrReaderActivated ? (<QRCodeScanner/>) : null }
            { newUser &&
            <div className="onboarding-modal flex center" ref={ onboardingModalRef }>
                <Onboarding completeOnboarding={ completeOnboarding }/>
            </div>
            }
            <div className={ `screens ${ newUser ? 'new-user' : '' }` } ref={ screensRef }>
                <div ref={ homepage } className="home relative atomic-scoped">
                    <div className="container o-hidden">
                        <CategoryMenu/>
                    </div>
                    <section className="product-list">
                        <div className="container">
                            {!pageLoading ?
                            productBlocksFiltered?.length ? <Swiper
                            spaceBetween={7}
                            navigation
                            slidesPerView={3}
                            loop={true}
                            shortSwipes={false}
                            threshold={5}
                            freeMode={true}
                            freeModeSticky={true}
                            observer={true}
                            observeParents={true}
                            freeModeMomentumVelocityRatio={0.01}
                            breakpoints={{
                                320: {
                                    slidesPerView: 2,
                                },
                                769: {
                                  slidesPerView: 3,
                                },
                            }} >
                            { productBlocksFiltered.map((block, id) =>
                                <SwiperSlide key={id}>
                                    <ProductBlock { ...block } />
                                </SwiperSlide>) }
                            </Swiper> : null :
                            loadingPlaceholder 
                            }
                        </div>
                    </section>
                    <section className="card-list">
                        <div className="container erase-right">
                        {cardBlocks?.length ? <Swiper
                        spaceBetween={8}
                        slidesPerView={'auto'}
                        loop={true}
                        navigation
                        shortSwipes={false}
                        threshold={5}
                        freeMode={true}
                        freeModeSticky={true}
                        observer={true}
                        observeParents={true}
                        freeModeMomentumVelocityRatio={0.05} 
                        breakpoints={{
                            320: {
                                slidesPerView: 'auto',
                            },
                            769: {
                              slidesPerView: 2,
                            },
                        }} >
                        { cardBlocks.map((block, id) => 
                            <SwiperSlide key={id}>
                                <CardBlock { ...block } />
                            </SwiperSlide>) }
                        </Swiper> : null}
                        </div>
                    </section>
                    {/* <section className="home-products">
                       <div className="container">
                           <ProductListing animateEl={ animateEl.HP } animateDel={ animateDel.HP }/>
                       </div>
                    </section> */}
                </div>
            </div>
        </>
    )
}

export default Home
