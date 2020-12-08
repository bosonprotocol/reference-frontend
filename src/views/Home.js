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

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

const isMobile = window.innerWidth <= 960

function Home() {
  const homepage = useRef()
  const [productViewState, setProductViewState] = useState(0)

  const productListSettings = {
    dots: false,
    arrows: isMobile ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : 4,
    slidesToScroll: 2,
    autoplay: isMobile ? false : true,
    autoplaySpeed: 5000,
  };

  const cardListSettings = {
    dots: false,
    arrows: isMobile ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 2,
    centerMode: isMobile ? true : false,
    centerPadding: '25px',
    autoplay: isMobile ? false : true,
    autoplaySpeed: 5000,
  };

  const animateEl = {
    'PL': isMobile ? 2 : 4,
    'CL': isMobile ? 1 : 2,
    'HP': isMobile ? 2 : 6,
  }

  const animateDel = {
    'PL': 1,
    'CL': 7,
    'HP': 5,
    'NAV': 400,
  }

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
