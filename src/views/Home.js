import React, { useEffect, useRef, useState } from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"
import ProductListing from "../components/ProductListing"
import ProductView from "../components/ProductView"

import { animateEl, animateDel } from "../helpers/AnimationMap"
import { productListSettings, cardListSettings } from "../helpers/SliderSettings"

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

function Home() {
  const homepage = useRef()
  const [productViewState, setProductViewState] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      homepage.current.classList.add('init')
    }, 100);

    setTimeout(() => {
      setProductViewState(1)
    }, 1000);
  }, [])

  return (
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
        productViewState ?
        <ProductView setProductViewState={setProductViewState} /> :
        null
      }
      <NavigationBar delay={animateDel.NAV} />
    </div>
  )
}

export default Home
