import React, { useEffect, useRef } from 'react'

import "./Home.scss"

import Slider from "react-slick";

import Header from "../components/Header";
import ProductBlock from "../components/ProductBlock";
import CardBlock from "../components/CardBlock";
import CategoryMenu from "../components/CategoryMenu"
import NavigationBar from "../components/NavigationBar"
import ProductListing from "../components/ProductListing"

import { productBlocks, cardBlocks } from "../PlaceholderAPI"

function Home() {
  const homepage = useRef()

  const productListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth <= 960 ? 2 : 4,
    slidesToScroll: 2
  };

  const cardListSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: window.innerWidth <= 960 ? 1 : 2,
    centerMode: window.innerWidth <= 960 ? true : false,
    centerPadding: '25px',
  };

  const animateEl = {
    'PL': window.innerWidth <= 960 ? 2 : 4,
    'CL': window.innerWidth <= 960 ? 1 : 2,
    'HP': window.innerWidth <= 960 ? 2 : 6,
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
  }, [])

  return (
    <div ref={homepage} className="home atomic-scoped">
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
      <NavigationBar delay={animateDel.NAV} />
    </div>
  )
}

export default Home
