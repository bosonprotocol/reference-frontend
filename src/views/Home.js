import React, { useEffect, useRef, useState, useContext } from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/home/Header";
import ProductBlock from "../components/home/ProductBlock";
import CardBlock from "../components/home/CardBlock";
import CategoryMenu from "../components/home/CategoryMenu"
import NavigationBar from "../components/shared/NavigationBar"
import ProductListing from "../components/home/ProductListing"
import ProductView from "../components/shared/ProductView"
import Onboarding from '../views/Onboarding'
import QRCodeScanner from "../components/shared/QRCodeScanner"

import { animateEl, animateDel } from "../helpers/AnimationMap"
import { productListSettings, cardListSettings } from "../helpers/SliderSettings"

import { cardBlocks } from "../PlaceholderAPI"

import { BuyerContext } from "../contexts/Buyer"
import { GlobalContext, Action } from "../contexts/Global"

import { getAllVoucherSets } from "../hooks/api";
import * as ethers from "ethers";

function Home() {
    const [productBlocks, setProductBlocks] = useState([]);
    const homepage = useRef()
    const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
    const screensRef = useRef()
    const onboardingModalRef = useRef()

    const redeemContext = useContext(BuyerContext)
    const globalContext = useContext(GlobalContext)

    const modalCloseTimeout = 900;

    useEffect(() => {
        let openProductView = localStorage.getItem('productIsOpen') && localStorage.getItem('productIsOpen')
        let productsReviewed = localStorage.getItem('productsReviewed') ? JSON.parse(localStorage.getItem('productsReviewed')) : false

        if (parseInt(openProductView))
            globalContext.dispatch(Action.openProduct(productsReviewed[productsReviewed.length - 1]))

        async function getVoucherSets() {
            const allVoucherSets = await getAllVoucherSets();
            prepareVoucherSetData(allVoucherSets);
        }

        getVoucherSets()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const prepareVoucherSetData = (rawVoucherSets) => {
        if (!rawVoucherSets) {
            setProductBlocks([])
            return;
        }

        let parsedVoucherSets = [];

        console.log(rawVoucherSets.voucherSupplies);

        for (const voucherSet of rawVoucherSets.voucherSupplies) {
            let parsedVoucherSet = {
                id: voucherSet._id,
                title: voucherSet.title,
                image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
                price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
                buyerDeposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
                sellerDeposit: ethers.utils.formatEther(voucherSet.sellerDeposit.$numberDecimal),
                deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
                description: voucherSet.description,
                category: voucherSet.category,
                startDate: voucherSet.startDate,
                expiryDate: voucherSet.expiryDate,
                qty: voucherSet.qty
            };

            parsedVoucherSets.push(parsedVoucherSet)
        }

        console.log(parsedVoucherSets);
        productListSettings.infinite = parsedVoucherSets.length > 4;
        setProductBlocks(parsedVoucherSets);
        globalContext.dispatch(Action.allVoucherSets(parsedVoucherSets));
    };

    useEffect(() => {
        setTimeout(() => {
            homepage.current.classList.add('init')
        }, 100);
    }, [redeemContext.state])

    const completeOnboarding = () => {
        localStorage.setItem('onboarding-completed', '1')

        onboardingModalRef.current.classList.add('fade-out')
        screensRef.current.classList.add('onboarding-done')

        setTimeout(() => {
            setNewUser(false)
        }, modalCloseTimeout);
    }

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
                        <Header/>
                        <CategoryMenu/>
                    </div>
                    <section className="product-list">
                        <div className="container">
                            <Slider { ...productListSettings }>
                                { productBlocks.map((block, id) => <ProductBlock key={ id } { ...block }
                                                                                 delay={ `${ (id + animateDel.PL) * 50 }ms` }
                                                                                 animate={ id < animateEl.PL }/>) }
                            </Slider>
                        </div>
                    </section>
                    <section className="card-list">
                        <div className="container erase-right">
                            <Slider { ...cardListSettings }>
                                { cardBlocks.map((block, id) => <CardBlock key={ id } { ...block }
                                                                           delay={ `${ (id + animateDel.CL) * 50 }ms` }
                                                                           animate={ id < animateEl.CL }/>) }
                            </Slider>
                        </div>
                    </section>
                    <section className="home-products">
                        <div className="container">
                            <ProductListing animateEl={ animateEl.HP } animateDel={ animateDel.HP }/>
                        </div>
                    </section>
                    {
                        globalContext.state.productView.open ?
                            <ProductView/> :
                            null
                    }
                    <NavigationBar delay={ animateDel.NAV }/>
                </div>
            </div>
        </>
    )
}

export default Home
