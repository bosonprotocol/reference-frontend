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

import { animateEl, animateDel } from "../helpers/AnimationMap"
import { productListSettings } from "../helpers/SliderSettings"

import { cardBlocks } from "../PlaceholderAPI"

import { GlobalContext, Action } from "../contexts/Global"
import { LoadingContext, Toggle, home } from "../contexts/Loading"
import { homeSlider } from "../helpers/Placeholders"
import { useWeb3React } from "@web3-react/core";
import { authenticateUser, getAccountStoredInLocalStorage } from "../hooks/authenticate";

SwiperCore.use([Navigation]);

function Home() {
    const [productBlocks, setProductBlocks] = useState([]);
    const [productBlocksFiltered, setProductBlocksFiltered] = useState([]);
    const homepage = useRef()
    const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
    const screensRef = useRef()
    const onboardingModalRef = useRef()

    const {account, library, chainId} = useWeb3React();

    const globalContext = useContext(GlobalContext)
    const loadingContext = useContext(LoadingContext)

    const voucherSets = globalContext.state.allVoucherSets

    const modalCloseTimeout = 900;

    useEffect(() => {
        if(voucherSets) {
            setProductBlocks(voucherSets)
            productListSettings.infinite = voucherSets.length > 4;
        } else {
            setProductBlocks([])
        }
    }, [voucherSets])

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
        setProductBlocksFiltered(productBlocks.filter((block) => block.qty > 0 ))
    }, [productBlocks])

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
                            {!productBlocksFiltered?.length ? <Swiper
                            spaceBetween={7}
                            navigation
                            slidesPerView={3}
                            loop={productBlocksFiltered.length > 3 ? true : false}
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
                                    loop: productBlocksFiltered.length > 2 ? true : false
                                },
                                769: {
                                  slidesPerView: 3,
                                  loop: productBlocksFiltered.length > 3 ? true : false
                                },
                            }} >
                            { productBlocksFiltered.map((block, id) =>
                                <SwiperSlide key={id}>
                                    <ProductBlock { ...block }
                                    delay={ `${ (id + animateDel.PL) * 50 }ms` }
                                    animate={ id < animateEl.PL }/>
                                </SwiperSlide>) }
                            </Swiper> : 
                            // homeSlider 
                            null
                            }
                        </div>
                    </section>
                    <section className="card-list">
                        <div className="container erase-right">
                        <Swiper
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
                                <CardBlock { ...block }
                                delay={ `${ (id + animateDel.CL) * 50 }ms` }
                                animate={ id < animateEl.CL }/>
                            </SwiperSlide>) }
                        </Swiper>
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
