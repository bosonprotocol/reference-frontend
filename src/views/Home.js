import React, { useEffect, useRef, useState, useContext } from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"
import ProductListing from "../components/ProductListing"
import ProductView from "../components/ProductView"
import Onboarding from '../views/Onboarding'
import QRCodeScanner from "../components/QRCodeScanner"

import { animateEl, animateDel } from "../helpers/AnimationMap"
import { productListSettings, cardListSettings } from "../helpers/SliderSettings"

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

import { BuyerContext } from "../contexts/Buyer"
import { GlobalContext, Action } from "../contexts/Global"

function Home() {
  const homepage = useRef()
  const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
  const screensRef = useRef()
  const onboardingModalRef = useRef()

  const redeemContext = useContext(BuyerContext)
  const globalContext = useContext(GlobalContext)

  const modalCloseTimeout = 900

  useEffect(() => {
    let openProductView = localStorage.getItem('productIsOpen') && localStorage.getItem('productIsOpen')
    let productsReviewed = localStorage.getItem('productsReviewed') ? JSON.parse(localStorage.getItem('productsReviewed')) : false

    if(parseInt(openProductView))
      globalContext.dispatch(Action.openProduct(productsReviewed[productsReviewed.length - 1]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      {newUser &&
        <div className="onboarding-modal flex center" ref={onboardingModalRef}>
          <Onboarding completeOnboarding={completeOnboarding} />
        </div>
      }
      <div className={`screens ${newUser ? 'new-user' : ''}`} ref={screensRef}>
        <div ref={homepage} className="home relative atomic-scoped">
          <div className="container o-hidden">
            <Header />
            <CategoryMenu />
          </div>
          <section className="product-list">
            <div className="container">
              <Slider {...productListSettings}>
                {productBlocks.map((block, id) => <ProductBlock key={id} {...block} delay={`${(id + animateDel.PL) * 50}ms`} animate={id < animateEl.PL}/>)}
              </Slider>
            </div>
          </section>
          <section className="card-list">
            <div className="container erase-right">
              <Slider {...cardListSettings}>
                {cardBlocks.map((block, id) => <CardBlock key={id} {...block} delay={`${(id + animateDel.CL) * 50}ms`} animate={id < animateEl.CL} />)}
              </Slider>
            </div>
          </section>
          <section className="home-products">
            <div className="container">
              <ProductListing animateEl={animateEl.HP} animateDel={animateDel.HP} />
            </div>
          </section>
          {
            globalContext.state.productView.open ?
            <ProductView /> :
            null
          }
          <NavigationBar delay={animateDel.NAV} />
        </div>
      </div>
    </>
  )
}

export default Home
